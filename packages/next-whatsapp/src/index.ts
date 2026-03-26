/**
 * WhatsApp Web.js integration for Next.js applications
 * @module @opensourceframework/next-whatsapp
 */

// Export WhatsAppService
export { WhatsAppService } from './lib/whatsapp/service';

// Export client functions (advanced usage)
export { getClient, initializeClient, startTracking, stopTracking, getStatus } from './lib/whatsapp/client';

// Re-export types from whatsapp-web.js (optional)
export type { Client, LocalAuth } from 'whatsapp-web.js';