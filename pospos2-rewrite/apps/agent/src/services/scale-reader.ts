import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export interface ScaleReading {
  scaleId: string;
  weightGrams: number | null;
  stable: boolean;
  connected: boolean;
  measuredAt: string;
  source: 'serial' | 'unavailable';
}

interface ScaleReader {
  getReading(): Promise<ScaleReading>;
}

export interface ScaleRegistry {
  getReading(scaleId?: string): Promise<ScaleReading>;
  getAllReadings(): Promise<ScaleReading[]>;
}

function unavailableReading(scaleId: string): ScaleReading {
  return {
    scaleId,
    weightGrams: null,
    stable: false,
    connected: false,
    measuredAt: new Date().toISOString(),
    source: 'unavailable'
  };
}

class SerialScaleReader implements ScaleReader {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private currentWeight = 0;
  private stable = false;
  private readonly portPath: string;

  constructor(portPath: string, private readonly scaleId: string) {
    this.portPath = portPath;
  }

  async initialize(): Promise<void> {
    try {
      this.port = new SerialPort({ path: this.portPath, baudRate: 9600 });
      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
      this.parser.on('data', (line) => {
        const trimmed = line.trim();
        // Try A&D style format: "ST,+00004.05  g" or "US, 000.00  kg"
        const match = trimmed.match(/^([A-Z0-9]{2}),\s*([+-]?\d+\.?\d*)\s*([a-zA-Z]*)$/);
        if (match) {
          const status = match[1];
          const weightStr = match[2];
          const weight = parseFloat(weightStr);
          if (!isNaN(weight)) {
            this.currentWeight = weight;
            this.stable = (status === 'ST');
          }
        } else {
          // Fallback: raw numeric value (e.g., "123.45")
          const grams = parseFloat(trimmed);
          if (!isNaN(grams)) {
            this.currentWeight = grams;
            this.stable = true;
          }
        }
      });
      console.log(`Scale '${this.scaleId}' connected on ${this.portPath}`);
    } catch (err) {
      console.error(`Failed to open scale port ${this.portPath} for '${this.scaleId}':`, err);
    }
  }

  async getReading(): Promise<ScaleReading> {
    if (!this.port) {
      return unavailableReading(this.scaleId);
    }
    return {
      scaleId: this.scaleId,
      weightGrams: this.currentWeight,
      stable: this.stable,
      connected: !!this.port?.isOpen,
      measuredAt: new Date().toISOString(),
      source: 'serial'
    };
  }
}

class UnavailableScaleReader implements ScaleReader {
  constructor(private readonly scaleId: string) {}

  async getReading(): Promise<ScaleReading> {
    return unavailableReading(this.scaleId);
  }
}

export class CompositeScaleRegistry implements ScaleRegistry {
  private readonly readers: Map<string, SerialScaleReader | UnavailableScaleReader>;
  private readonly defaultScaleId: string;

  constructor(readers: Map<string, SerialScaleReader | UnavailableScaleReader>, defaultScaleId: string) {
    this.readers = readers;
    this.defaultScaleId = defaultScaleId;
  }

  async getReading(scaleId?: string): Promise<ScaleReading> {
    const id = scaleId ?? this.defaultScaleId;
    const reader = this.readers.get(id);
    if (!reader) {
      return unavailableReading(id);
    }
    return reader.getReading();
  }

  async getAllReadings(): Promise<ScaleReading[]> {
    const readings = await Promise.all(
      Array.from(this.readers.values()).map((reader) => reader.getReading())
    );
    return readings;
  }
}

export function createScaleRegistry(env: any): CompositeScaleRegistry {
  const readers = new Map<string, SerialScaleReader | UnavailableScaleReader>();

  // Support multiple scales via SCALES env var (JSON array of { id, port } or simple comma-separated ports string)
  let defaultScaleId = 'default';

  if (env.SCALES) {
    try {
      const scalesConfig = JSON.parse(env.SCALES);
      if (Array.isArray(scalesConfig)) {
        for (let i = 0; i < scalesConfig.length; i++) {
          const scale = scalesConfig[i];
          const id = scale.id || `scale${i}`;
          const port = scale.port;
          if (!port) continue;
          const reader = new SerialScaleReader(port, id);
          // Initialize connection
          void reader.initialize();
          readers.set(id, reader);
          if (defaultScaleId === 'default') {
            defaultScaleId = id;
          }
        }
      } else if (typeof scalesConfig === 'string') {
        // Backward compatibility: comma-separated ports string
        const ports = scalesConfig.split(',').map(p => p.trim()).filter(p => p);
        ports.forEach((port, idx) => {
          const id = `scale${idx}`;
          const reader = new SerialScaleReader(port, id);
          void reader.initialize();
          readers.set(id, reader);
          if (defaultScaleId === 'default') {
            defaultScaleId = id;
          }
        });
      }
    } catch (err) {
      console.error('Failed to parse SCALES config:', err);
    }
  }

  // Fallback to single SCALE_PORT if no multiple scales configured
  if (readers.size === 0 && env.SCALE_PORT) {
    const reader = new SerialScaleReader(env.SCALE_PORT, 'default');
    void reader.initialize();
    readers.set('default', reader);
    defaultScaleId = 'default';
  }

  // If still no readers, create an unavailable default
  if (readers.size === 0) {
    const reader = new UnavailableScaleReader('default');
    readers.set('default', reader);
    defaultScaleId = 'default';
  }

  return new CompositeScaleRegistry(readers, defaultScaleId);
}
