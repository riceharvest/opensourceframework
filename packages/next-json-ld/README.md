# @opensourceframework/next-json-ld

[![npm version](https://badge.fury.io/js/@opensourceframework%2Fnext-json-ld.svg)](https://badge.fury.io/js/@opensourceframework%2Fnext-json-ld)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON-LD structured data helpers for Next.js SEO. Generate Schema.org markup for search engines with full TypeScript support.

## Features

- 🎯 **Type-safe**: Full TypeScript support with comprehensive interfaces
- 🔍 **SEO-friendly**: Generate valid Schema.org JSON-LD markup
- ⚡ **Zero dependencies**: Lightweight and tree-shakeable
- 🧩 **Composable**: Mix and match different schema types on the same page
- 📦 **Next.js ready**: Works seamlessly with Next.js App Router and Pages Router

## Installation

```bash
npm install @opensourceframework/next-json-ld
# or
yarn add @opensourceframework/next-json-ld
# or
pnpm add @opensourceframework/next-json-ld
```

## Quick Start

### App Router (Next.js 13+)

```tsx
// app/layout.tsx or any page.tsx
import { createOrganizationSchema, createJsonLdScript } from '@opensourceframework/next-json-ld';

export default function Layout({ children }) {
  const orgSchema = createOrganizationSchema({
    organization: {
      name: 'My Business',
      url: 'https://mybusiness.com',
      telephone: '+1-555-123-4567',
      email: 'info@mybusiness.com',
    },
    areaServed: {
      city: 'New York',
    },
  });

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: createJsonLdScript(orgSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router

```tsx
// pages/_document.tsx or individual pages
import { createOrganizationSchema, createJsonLdScript } from '@opensourceframework/next-json-ld';

export default function Document() {
  const orgSchema = createOrganizationSchema({
    organization: {
      name: 'My Business',
      url: 'https://mybusiness.com',
    },
  });

  return (
    <Html>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: createJsonLdScript(orgSchema),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## API Reference

### Organization Schema

Create structured data for local businesses and organizations.

```typescript
import { createOrganizationSchema } from '@opensourceframework/next-json-ld';

const schema = createOrganizationSchema({
  organization: {
    name: 'My Business',
    description: 'A great business',
    url: 'https://mybusiness.com',
    telephone: '+1-555-123-4567',
    email: 'info@mybusiness.com',
    priceRange: '$$',
    logo: 'https://mybusiness.com/logo.png',
    image: 'https://mybusiness.com/og-image.jpg',
    sameAs: [
      'https://twitter.com/mybusiness',
      'https://facebook.com/mybusiness',
    ],
  },
  areaServed: {
    geoMidpoint: { latitude: 40.7128, longitude: -74.0060 },
    geoRadius: '25km',
  },
  openingHoursSpecification: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
  type: 'LocalBusiness', // or 'Restaurant', 'Store', etc.
});
```

### Service Schema

Create structured data for specific services.

```typescript
import { createServiceSchema } from '@opensourceframework/next-json-ld';

const schema = createServiceSchema({
  name: 'Web Development',
  description: 'Professional web development services',
  url: 'https://mybusiness.com/services/web-development',
  image: 'https://mybusiness.com/services/web-dev.jpg',
  provider: {
    name: 'My Agency',
    url: 'https://myagency.com',
  },
  serviceType: 'Professional Service',
  areaServed: {
    city: 'New York',
  },
});
```

### FAQ Schema

Create structured data for FAQ pages.

```typescript
import { createFAQSchema } from '@opensourceframework/next-json-ld';

const schema = createFAQSchema([
  {
    question: 'What are your hours?',
    answer: 'We are open 24/7.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, within 30 days of purchase.',
  },
]);
```

### Breadcrumb Schema

Create structured data for navigation breadcrumbs.

```typescript
import { createBreadcrumbSchema } from '@opensourceframework/next-json-ld';

const schema = createBreadcrumbSchema([
  { name: 'Home', url: 'https://example.com' },
  { name: 'Products', url: 'https://example.com/products' },
  { name: 'Widgets', url: 'https://example.com/products/widgets' },
]);
```

### Review Schema

Create structured data for reviews and testimonials.

```typescript
import { createReviewSchema } from '@opensourceframework/next-json-ld';

const schema = createReviewSchema({
  organization: {
    name: 'My Business',
    url: 'https://mybusiness.com',
  },
  reviewCount: 150,
  ratingValue: 4.8,
  bestRating: 5,
  worstRating: 1,
  reviews: [
    {
      author: 'John Doe',
      reviewBody: 'Excellent service! Would recommend.',
      reviewRating: 5,
      datePublished: '2024-01-15',
    },
    {
      author: 'Jane Smith',
      reviewBody: 'Great experience overall.',
      reviewRating: 4,
      datePublished: '2024-01-10',
    },
  ],
});
```

### Product Schema

Create structured data for e-commerce products.

```typescript
import { createProductSchema } from '@opensourceframework/next-json-ld';

const schema = createProductSchema({
  name: 'Premium Widget',
  description: 'High-quality widget for all your needs',
  image: 'https://example.com/widget.jpg',
  brand: 'WidgetCo',
  sku: 'WGT-001',
  price: 29.99,
  priceCurrency: 'USD',
  availability: 'InStock',
});
```

### Article Schema

Create structured data for blog posts and news articles.

```typescript
import { createArticleSchema } from '@opensourceframework/next-json-ld';

const schema = createArticleSchema({
  headline: 'How to Build Accessible Websites',
  description: 'A comprehensive guide to web accessibility',
  image: 'https://example.com/article.jpg',
  datePublished: '2024-01-15',
  dateModified: '2024-01-20',
  author: 'Jane Smith',
  publisher: 'Tech Blog',
  publisherLogo: 'https://example.com/logo.png',
  url: 'https://example.com/articles/accessible-websites',
});
```

### Event Schema

Create structured data for events.

```typescript
import { createEventSchema } from '@opensourceframework/next-json-ld';

const schema = createEventSchema({
  name: 'Tech Conference 2024',
  description: 'Annual technology conference',
  startDate: '2024-06-15T09:00:00Z',
  endDate: '2024-06-17T18:00:00Z',
  location: {
    name: 'Convention Center',
    address: '123 Main St, San Francisco, CA',
  },
  url: 'https://example.com/events/tech-conf-2024',
  eventStatus: 'EventScheduled',
});
```

### Combining Multiple Schemas

Use `mergeSchemas` to combine multiple schemas on a single page.

```typescript
import {
  createOrganizationSchema,
  createFAQSchema,
  mergeSchemas,
  createJsonLdScript,
} from '@opensourceframework/next-json-ld';

const orgSchema = createOrganizationSchema({
  organization: { name: 'My Business', url: 'https://mybusiness.com' },
});

const faqSchema = createFAQSchema([
  { question: 'What do you do?', answer: 'We provide great services.' },
]);

const combined = mergeSchemas([orgSchema, faqSchema]);

// Use in your page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: createJsonLdScript(combined),
  }}
/>
```

## Testing Your Schema

Use the [Google Rich Results Test](https://search.google.com/test/rich-results) to validate your structured data.

## Contributing

Contributions are welcome! Please read the [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT © [Open Source Framework](https://github.com/opensourceframework)
