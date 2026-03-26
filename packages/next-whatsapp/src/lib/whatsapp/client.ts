import { Client, LocalAuth } from 'whatsapp-web.js';
import { prisma } from '../database/client';
import { logger } from '../utils/validation';

let client: Client | null = null;
let isTracking = false;
let trackingInterval: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 seconds

export const getClient = () => {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    client.on('ready', () => {
      logger.info('WhatsApp client is ready!');
      reconnectAttempts = 0; // Reset on successful connection
    });

    client.on('disconnected', (reason) => {
      logger.warn('WhatsApp client disconnected:', reason);
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        logger.info(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(() => {
          initializeClient().catch((error) => {
            logger.error('Reconnection failed:', error);
          });
        }, reconnectDelay);
      } else {
        logger.error('Max reconnection attempts reached. Please reconnect manually.');
      }
    });

    client.on('message_ack', async (message, ack) => {
        // Ack 2 means delivered.
      if (ack === 2 && message.fromMe) {
        const now = Date.now();
        const sentTime = message.timestamp * 1000;
        const latency = now - sentTime;
        const to = message.to.split('@')[0];

        try {
          const contact = await prisma.contact.findFirst({
            where: { phoneNumber: to }
          });

          if (contact) {
            await prisma.sleepEntry.create({
              data: {
                timestamp: new Date(),
                messageSent: new Date(sentTime),
                messageDelivered: new Date(now),
                latencyMs: latency,
                inferredState: latency > 30000 ? 'asleep' : 'awake',
                contactId: contact.id
              }
            });
          }
        } catch (error) {
          logger.error('Error saving sleep entry:', error);
        }
      }
    });
  }
  return client;
};

export const initializeClient = async () => {
  const whatsappClient = getClient();
  await whatsappClient.initialize();
  return whatsappClient;
};

const sendMessageWithRetry = async (client: Client, chatId: string, retryCount = 0, maxRetries = 3) => {
  if (!client.info) {
    throw new Error('WhatsApp client not ready');
  }

  try {
    // Sending a subtle ping. The reaction hack might be unstable.
    // We'll send an empty character message or similar if reaction fails.
    // For now, attempting the original reaction hack but catching errors.
    // If it fails, we might just check presence.
    // But let's try to send a 'invisible' char message as fallback or primary.
    // '\u200B' is zero width space.
    await client.sendMessage(chatId, '\u200B');
  } catch (error) {
    logger.error('Error sending message:', error);
    if ((error as any).message.includes('rate limit') ||  (error as any).message.includes('too many requests')) {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.warn(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendMessageWithRetry(client, chatId, retryCount + 1, maxRetries);
      } else {
        throw new Error('Max retries exceeded due to rate limiting', { cause: error });
      }
    } else {
       // Ignore other errors (like invalid contact) to keep loop running
       logger.warn(`Failed to send to ${chatId}: ${ (error as any).message}`);
    }
  }
};

export const startTracking = async (intervalMinutes: number = 15) => {
  if (isTracking) return;

  const whatsappClient = getClient();
  if (!whatsappClient.info) {
    throw new Error('WhatsApp client not ready');
  }

  isTracking = true;
  
  // Initial run
  runTrackingCycle(whatsappClient);

  trackingInterval = setInterval(async () => {
     runTrackingCycle(whatsappClient);
  }, intervalMinutes * 60 * 1000);
};

const runTrackingCycle = async (whatsappClient: Client) => {
    try {
        const contacts = await prisma.contact.findMany();
        logger.info(`Starting tracking cycle for ${contacts.length} contacts`);
        for (const contact of contacts) {
            const chatId = `${contact.phoneNumber}@c.us`;
             await sendMessageWithRetry(whatsappClient, chatId);
             await new Promise(r => setTimeout(r, 2000)); // Delay to be polite
        }
    } catch (error) {
      logger.error('Failed tracking cycle:', error);
    }
}

export const stopTracking = () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  isTracking = false;
};

export const getStatus = () => {
  return {
    connected: client?.info ? true : false,
    tracking: isTracking
  };
};