# @opensourceframework/next-whatsapp

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

WhatsApp Web.js integration for Next.js applications.

This package provides a simple service to connect to WhatsApp via the unofficial WhatsApp Web.js API, send messages, and track delivery latencies.

> **Warning**: This package uses the unofficial WhatsApp Web.js API, which may be blocked or restricted by Meta at any time. Not suitable for production-critical applications.

## Installation

```bash
pnpm add @opensourceframework/next-whatsapp whatsapp-web.js
```

or

```bash
npm install @opensourceframework/next-whatsapp whatsapp-web.js
```

## Usage

### Connect to WhatsApp

```typescript
import { WhatsAppService } from '@opensourceframework/next-whatsapp';

async function connect() {
  const qrCodeDataURL = await WhatsAppService.connect();
  if (qrCodeDataURL) {
    // Display QR code to user
    console.log('QR Code:', qrCodeDataURL);
  } else {
    console.log('Already connected');
  }
}
```

### Start tracking delivery latencies

```typescript
await WhatsAppService.startTracking(15); // interval in minutes
```

### Stop tracking

```typescript
WhatsAppService.stopTracking();
```

### Get status

```typescript
const status = WhatsAppService.getStatus();
console.log(status); // { connected: boolean, tracking: boolean }
```

## API

See [API documentation](./etc/next-whatsapp.api.md) for detailed API reference.

## License

MIT