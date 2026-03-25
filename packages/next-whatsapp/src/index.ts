// Main service class for easy static access
export { WhatsAppService } from './service';

// Individual functions for more granular control
export {
  getClient,
  initializeClient,
  startTracking,
  stopTracking,
  getStatus,
  onMessageAck,
} from './client';

// Re-export types if needed
export type { Client } from 'whatsapp-web.js';
