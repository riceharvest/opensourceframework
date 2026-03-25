# @opensourceframework/next-whatsapp

WhatsApp integration for Next.js applications using whatsapp-web.js.

This package is extracted from the [itsalive](https://github.com/riceharvest/itsalive) project.

## Installation

```bash
pnpm add @opensourceframework/next-whatsapp
```

## Usage

### Basic Connection

```typescript
import { WhatsAppService } from '@opensourceframework/next-whatsapp';

// Connect and get QR code
const qrCode = await WhatsAppService.connect();
// Display QR code to user for scanning

// Check status
const status = WhatsAppService.getStatus();
console.log(`Connected: ${status.connected}, Tracking: ${status.tracking}`);
```

### Tracking Mode

Send periodic messages to track sleep patterns or for automated check-ins:

```typescript
// Start tracking with a list of contacts
await WhatsAppService.startTracking(['+1234567890', '+0987654321'], 15); // every 15 minutes

// Stop tracking
WhatsAppService.stopTracking();
```

### Low-Level Control

For more control, use the individual functions:

```typescript
import { getClient, initializeClient, startTracking, stopTracking, getStatus } from '@opensourceframework/next-whatsapp';

// Initialize the client
await initializeClient();

// Get the raw client for event listeners
const client = getClient();

client.on('message', (msg) => {
  console.log('Received message:', msg.body);
});

// Start tracking with custom contacts
await startTracking(['+1234567890'], 15);
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm dev
```

## License

MIT
