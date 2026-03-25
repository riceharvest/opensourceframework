import { Client, LocalAuth, MessageAck } from 'whatsapp-web.js';

let client: Client | null = null;
let isTracking = false;
let trackingInterval: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 seconds

export const getClient = (): Client => {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      reconnectAttempts = 0; // Reset on successful connection
    });

    client.on('disconnected', (reason) => {
      console.warn('WhatsApp client disconnected:', reason);
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.info(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(() => {
          initializeClient().catch((error) => {
            console.error('Reconnection failed:', error);
          });
        }, reconnectDelay);
      } else {
        console.error('Max reconnection attempts reached. Please reconnect manually.');
      }
    });
  }
  return client;
}

export async function initializeClient(): Promise<Client> {
  const whatsappClient = getClient();
  await whatsappClient.initialize();
  return whatsappClient;
}

async function sendMessageWithRetry(
  clientInstance: Client,
  chatId: string,
  retryCount = 0,
  maxRetries = 3
): Promise<void> {
  if (!clientInstance.info) {
    throw new Error('WhatsApp client not ready');
  }

  try {
    // Send a zero-width space character as a ping
    await clientInstance.sendMessage(chatId, '\u200B');
  } catch (error: any) {
    console.error('Error sending message:', error);
    if (
      error.message?.includes('rate limit') ||
      error.message?.includes('too many requests')
    ) {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Rate limited, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendMessageWithRetry(clientInstance, chatId, retryCount + 1, maxRetries);
      } else {
        throw new Error('Max retries exceeded due to rate limiting', { cause: error });
      }
    } else {
      // Ignore other errors (like invalid contact) to keep loop running
      console.warn(`Failed to send to ${chatId}: ${error.message}`);
    }
  }
}

export async function startTracking(contacts: string[], intervalMinutes: number = 15): Promise<void> {
  if (isTracking) return;

  const whatsappClient = getClient();
  if (!whatsappClient.info) {
    throw new Error('WhatsApp client not ready');
  }

  isTracking = true;

  // Initial run
  await runTrackingCycle(whatsappClient, contacts);

  trackingInterval = setInterval(async () => {
    await runTrackingCycle(whatsappClient, contacts);
  }, intervalMinutes * 60 * 1000);
}

async function runTrackingCycle(whatsappClient: Client, contacts: string[]): Promise<void> {
  try {
    console.info(`Starting tracking cycle for ${contacts.length} contacts`);
    for (const contact of contacts) {
      const chatId = `${contact}@c.us`;
      await sendMessageWithRetry(whatsappClient, chatId);
      await new Promise((r) => setTimeout(r, 2000)); // Delay to be polite
    }
  } catch (error) {
    console.error('Failed tracking cycle:', error);
  }
}

export function stopTracking(): void {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  isTracking = false;
}

export function getStatus(): { connected: boolean; tracking: boolean } {
  return {
    connected: client?.info ? true : false,
    tracking: isTracking,
  };
}

// Optional: expose client events for advanced usage
export function onMessageAck(callback: (message: any, ack: MessageAck) => void): void {
  const clientInstance = getClient();
  clientInstance.on('message_ack', callback);
}
