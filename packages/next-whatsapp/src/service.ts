import { getClient, initializeClient, startTracking, stopTracking, getStatus } from './client';
import qrcode from 'qrcode';

export class WhatsAppService {
  /**
   * Connect to WhatsApp and get the QR code or null if already connected
   * @returns Promise resolving to QR code data URL or null if already connected
   */
  static async connect(): Promise<string | null> {
    const client = getClient();

    return new Promise<string | null>((resolve, reject) => {
      client.on('qr', async (qr) => {
        try {
          const qrCodeDataURL = await qrcode.toDataURL(qr);
          resolve(qrCodeDataURL);
        } catch (error) {
          reject(error);
        }
      });

      client.on('ready', () => {
        resolve(null); // Already connected
      });

      client.on('auth_failure', (msg) => {
        reject(new Error(`Authentication failed: ${msg}`));
      });

      initializeClient().catch(reject);
    });
  }

  /**
   * Start periodic tracking by sending messages to the specified contacts
   * @param contacts - Array of phone numbers (without @c.us suffix)
   * @param intervalMinutes - How often to send tracking messages (default 15 minutes)
   */
  static async startTracking(contacts: string[], intervalMinutes: number = 15): Promise<void> {
    await startTracking(contacts, intervalMinutes);
  }

  /**
   * Stop the tracking loop
   */
  static stopTracking(): void {
    stopTracking();
  }

  /**
   * Get the current connection and tracking status
   * @returns Object with connected and tracking boolean properties
   */
  static getStatus(): { connected: boolean; tracking: boolean } {
    return getStatus();
  }
}
