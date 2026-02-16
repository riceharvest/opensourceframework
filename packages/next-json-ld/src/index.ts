/**
 * JSON-LD Structured Data Helpers for Next.js SEO
 * Generate Schema.org markup for search engines
 * @module @opensourceframework/next-json-ld
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Base JSON-LD schema type
 */
export interface JSONLDSchema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/**
 * Organization information for structured data
 */
export interface OrganizationInfo {
  /** Organization name */
  name: string;
  /** Organization description */
  description?: string;
  /** Organization website URL */
  url: string;
  /** Organization logo URL */
  logo?: string;
  /** Organization image URL */
  image?: string;
  /** Phone number */
  telephone?: string;
  /** Email address */
  email?: string;
  /** Price range (e.g., '$$', '$$$') */
  priceRange?: string;
  /** Social media URLs */
  sameAs?: string[];
  /** Organization ID (for referencing) */
  id?: string;
}

/**
 * Geographic coordinates
 */
export interface GeoCoordinates {
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
}

/**
 * Service area configuration
 */
export interface ServiceArea {
  /** Center point coordinates */
  geoMidpoint?: GeoCoordinates;
  /** Service radius (e.g., '30km') */
  geoRadius?: string;
  /** City name */
  city?: string;
  /** Region/State */
  region?: string;
  /** Country */
  country?: string;
}

/**
 * Opening hours specification
 */
export interface OpeningHours {
  /** Days of the week */
  dayOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  /** Opening time (HH:MM format) */
  opens?: string;
  /** Closing time (HH:MM format) */
  closes?: string;
  /** 24/7 availability */
  open24Hours?: boolean;
}

/**
 * Organization schema options
 */
export interface OrganizationSchemaOptions {
  /** Organization information */
  organization: OrganizationInfo;
  /** Service area */
  areaServed?: ServiceArea;
  /** Opening hours */
  openingHoursSpecification?: OpeningHours;
  /** Organization type (default: 'LocalBusiness') */
  type?: string;
}

/**
 * Service schema options
 */
export interface ServiceSchemaOptions {
  /** Service name */
  name: string;
  /** Service description */
  description: string;
  /** Service URL */
  url: string;
  /** Service image */
  image?: string;
  /** Provider organization */
  provider: OrganizationInfo;
  /** Service type */
  serviceType?: string;
  /** Service area */
  areaServed?: ServiceArea;
}

/**
 * FAQ item
 */
export interface FAQItem {
  /** The question */
  question: string;
  /** The answer */
  answer: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Item name */
  name: string;
  /** Item URL */
  url: string;
}

/**
 * Review item
 */
export interface ReviewItem {
  /** Author name */
  author: string;
  /** Review text */
  reviewBody: string;
  /** Rating value (1-5) */
  reviewRating: number;
  /** Publication date (ISO format) */
  datePublished: string;
}

/**
 * Review schema options
 */
export interface ReviewSchemaOptions {
  /** Organization being reviewed */
  organization: OrganizationInfo;
  /** Total review count */
  reviewCount: number;
  /** Average rating value */
  ratingValue: number;
  /** Best possible rating (default: 5) */
  bestRating?: number;
  /** Worst possible rating (default: 1) */
  worstRating?: number;
  /** Individual reviews */
  reviews: ReviewItem[];
}

/**
 * Product schema options
 */
export interface ProductSchemaOptions {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product image URL(s) */
  image?: string | string[];
  /** Product URL */
  url?: string;
  /** Brand name */
  brand?: string;
  /** SKU */
  sku?: string;
  /** Price */
  price?: number;
  /** Price currency (e.g., 'USD', 'EUR') */
  priceCurrency?: string;
  /** Availability status */
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Backorder' | 'LimitedAvailability';
}

/**
 * Article schema options
 */
export interface ArticleSchemaOptions {
  /** Article headline */
  headline: string;
  /** Article description */
  description?: string;
  /** Article image */
  image?: string;
  /** Publication date (ISO format) */
  datePublished: string;
  /** Modification date (ISO format) */
  dateModified?: string;
  /** Author name */
  author: string;
  /** Publisher name */
  publisher: string;
  /** Publisher logo URL */
  publisherLogo?: string;
  /** Article URL */
  url?: string;
}

/**
 * Event schema options
 */
export interface EventSchemaOptions {
  /** Event name */
  name: string;
  /** Event description */
  description?: string;
  /** Start date (ISO format) */
  startDate: string;
  /** End date (ISO format) */
  endDate?: string;
  /** Event location */
  location?: {
    name: string;
    address?: string;
  };
  /** Event URL */
  url?: string;
  /** Event image */
  image?: string;
  /** Event status */
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  /** Event attendance mode */
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}

// ============================================================================
// JSON-LD Schema Generators
// ============================================================================

/**
 * Creates a JSON-LD script tag for use in Next.js pages
 * 
 * @param schema - The JSON-LD schema object
 * @returns A script tag string for use in <head>
 *
 * @example
 * ```tsx
 * import { createJsonLdScript } from '@opensourceframework/next-json-ld';
 * 
 * // In your Next.js page
 * <head>
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{
 *       __html: createJsonLdScript(organizationSchema)
 *     }}
 *   />
 * </head>
 * ```
 */
export function createJsonLdScript(schema: JSONLDSchema | JSONLDSchema[]): string {
  return JSON.stringify(Array.isArray(schema) ? schema : schema);
}

/**
 * Creates an Organization schema for local businesses
 * 
 * @param options - Organization schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createOrganizationSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createOrganizationSchema({
 *   organization: {
 *     name: 'My Business',
 *     url: 'https://mybusiness.com',
 *     telephone: '+1-555-123-4567',
 *     email: 'info@mybusiness.com',
 *   },
 *   areaServed: {
 *     city: 'New York',
 *     geoMidpoint: { latitude: 40.7128, longitude: -74.0060 },
 *     geoRadius: '25km',
 *   },
 * });
 * ```
 */
export function createOrganizationSchema(
  options: OrganizationSchemaOptions
): JSONLDSchema {
  const { organization, areaServed, openingHoursSpecification, type = 'LocalBusiness' } = options;

  const schema: JSONLDSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: organization.name,
    url: organization.url,
  };

  // Add optional organization fields
  if (organization.id) {
    schema['@id'] = organization.id;
  }
  if (organization.description) {
    schema.description = organization.description;
  }
  if (organization.telephone) {
    schema.telephone = organization.telephone;
  }
  if (organization.email) {
    schema.email = organization.email;
  }
  if (organization.priceRange) {
    schema.priceRange = organization.priceRange;
  }
  if (organization.image) {
    schema.image = organization.image;
  }
  if (organization.logo) {
    schema.logo = organization.logo;
  }
  if (organization.sameAs && organization.sameAs.length > 0) {
    schema.sameAs = organization.sameAs;
  }

  // Add service area
  if (areaServed) {
    if (areaServed.geoMidpoint && areaServed.geoRadius) {
      schema.areaServed = {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: areaServed.geoMidpoint.latitude,
          longitude: areaServed.geoMidpoint.longitude,
        },
        geoRadius: areaServed.geoRadius,
      };
    } else if (areaServed.city) {
      schema.areaServed = {
        '@type': 'City',
        name: areaServed.city,
      };
    }
  }

  // Add opening hours
  if (openingHoursSpecification) {
    if (openingHoursSpecification.open24Hours) {
      schema.openingHours = 'Mo-Su';
    } else if (openingHoursSpecification.dayOfWeek && openingHoursSpecification.opens && openingHoursSpecification.closes) {
      schema.openingHoursSpecification = {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: openingHoursSpecification.dayOfWeek,
        opens: openingHoursSpecification.opens,
        closes: openingHoursSpecification.closes,
      };
    }
  }

  return schema;
}

/**
 * Creates a Service schema for specific services
 * 
 * @param options - Service schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createServiceSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createServiceSchema({
 *   name: 'Web Development',
 *   description: 'Professional web development services',
 *   url: 'https://mybusiness.com/services/web-development',
 *   provider: {
 *     name: 'My Agency',
 *     url: 'https://myagency.com',
 *   },
 *   serviceType: 'Professional Service',
 * });
 * ```
 */
export function createServiceSchema(options: ServiceSchemaOptions): JSONLDSchema {
  const { name, description, url, image, provider, serviceType, areaServed } = options;

  const schema: JSONLDSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'LocalBusiness',
      name: provider.name,
      url: provider.url,
    },
  };

  if (image) {
    schema.image = image;
  }

  if (serviceType) {
    schema.serviceType = serviceType;
  }

  if (areaServed?.city) {
    schema.areaServed = {
      '@type': 'City',
      name: areaServed.city,
    };
  }

  return schema;
}

/**
 * Creates a FAQ schema for FAQ pages
 * 
 * @param faqs - Array of FAQ items
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createFAQSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createFAQSchema([
 *   { question: 'What are your hours?', answer: 'We are open 24/7.' },
 *   { question: 'Do you offer refunds?', answer: 'Yes, within 30 days.' },
 * ]);
 * ```
 */
export function createFAQSchema(faqs: FAQItem[]): JSONLDSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Creates a Breadcrumb schema for navigation
 * 
 * @param items - Array of breadcrumb items
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createBreadcrumbSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createBreadcrumbSchema([
 *   { name: 'Home', url: 'https://example.com' },
 *   { name: 'Products', url: 'https://example.com/products' },
 *   { name: 'Widgets', url: 'https://example.com/products/widgets' },
 * ]);
 * ```
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]): JSONLDSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Creates a Review schema for testimonials and reviews
 * 
 * @param options - Review schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createReviewSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createReviewSchema({
 *   organization: {
 *     name: 'My Business',
 *     url: 'https://mybusiness.com',
 *   },
 *   reviewCount: 150,
 *   ratingValue: 4.8,
 *   reviews: [
 *     {
 *       author: 'John Doe',
 *       reviewBody: 'Excellent service!',
 *       reviewRating: 5,
 *       datePublished: '2024-01-15',
 *     },
 *   ],
 * });
 * ```
 */
export function createReviewSchema(options: ReviewSchemaOptions): JSONLDSchema {
  const {
    organization,
    reviewCount,
    ratingValue,
    bestRating = 5,
    worstRating = 1,
    reviews,
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: organization.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
        bestRating,
        worstRating,
      },
      datePublished: review.datePublished,
    })),
  };
}

/**
 * Creates a Product schema for e-commerce products
 * 
 * @param options - Product schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createProductSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createProductSchema({
 *   name: 'Premium Widget',
 *   description: 'High-quality widget for all your needs',
 *   image: 'https://example.com/widget.jpg',
 *   brand: 'WidgetCo',
 *   sku: 'WGT-001',
 *   price: 29.99,
 *   priceCurrency: 'USD',
 *   availability: 'InStock',
 * });
 * ```
 */
export function createProductSchema(options: ProductSchemaOptions): JSONLDSchema {
  const {
    name,
    description,
    image,
    url,
    brand,
    sku,
    price,
    priceCurrency,
    availability,
  } = options;

  const schema: JSONLDSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
  };

  if (image) {
    schema.image = image;
  }
  if (url) {
    schema.url = url;
  }
  if (brand) {
    schema.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }
  if (sku) {
    schema.sku = sku;
  }
  if (price !== undefined && priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency,
      availability: availability ? `https://schema.org/${availability}` : undefined,
    };
  }

  return schema;
}

/**
 * Creates an Article schema for blog posts and news articles
 * 
 * @param options - Article schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createArticleSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createArticleSchema({
 *   headline: 'How to Build Accessible Websites',
 *   description: 'A comprehensive guide to web accessibility',
 *   image: 'https://example.com/article.jpg',
 *   datePublished: '2024-01-15',
 *   dateModified: '2024-01-20',
 *   author: 'Jane Smith',
 *   publisher: 'Tech Blog',
 *   publisherLogo: 'https://example.com/logo.png',
 *   url: 'https://example.com/articles/accessible-websites',
 * });
 * ```
 */
export function createArticleSchema(options: ArticleSchemaOptions): JSONLDSchema {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
    publisherLogo,
    url,
  } = options;

  const schema: JSONLDSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
      logo: publisherLogo
        ? {
            '@type': 'ImageObject',
            url: publisherLogo,
          }
        : undefined,
    },
  };

  if (description) {
    schema.description = description;
  }
  if (image) {
    schema.image = image;
  }
  if (dateModified) {
    schema.dateModified = dateModified;
  }
  if (url) {
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': url,
    };
  }

  return schema;
}

/**
 * Creates an Event schema for events
 * 
 * @param options - Event schema options
 * @returns JSON-LD schema object
 *
 * @example
 * ```typescript
 * import { createEventSchema } from '@opensourceframework/next-json-ld';
 * 
 * const schema = createEventSchema({
 *   name: 'Tech Conference 2024',
 *   description: 'Annual technology conference',
 *   startDate: '2024-06-15T09:00:00Z',
 *   endDate: '2024-06-17T18:00:00Z',
 *   location: {
 *     name: 'Convention Center',
 *     address: '123 Main St, San Francisco, CA',
 *   },
 *   url: 'https://example.com/events/tech-conf-2024',
 *   eventStatus: 'EventScheduled',
 * });
 * ```
 */
export function createEventSchema(options: EventSchemaOptions): JSONLDSchema {
  const {
    name,
    description,
    startDate,
    endDate,
    location,
    url,
    image,
    eventStatus,
    eventAttendanceMode,
  } = options;

  const schema: JSONLDSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
  };

  if (description) {
    schema.description = description;
  }
  if (endDate) {
    schema.endDate = endDate;
  }
  if (location) {
    schema.location = {
      '@type': 'Place',
      name: location.name,
      address: location.address
        ? {
            '@type': 'PostalAddress',
            streetAddress: location.address,
          }
        : undefined,
    };
  }
  if (url) {
    schema.url = url;
  }
  if (image) {
    schema.image = image;
  }
  if (eventStatus) {
    schema.eventStatus = `https://schema.org/${eventStatus}`;
  }
  if (eventAttendanceMode) {
    schema.eventAttendanceMode = `https://schema.org/${eventAttendanceMode}`;
  }

  return schema;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Merges multiple JSON-LD schemas into a single array
 * Useful when a page has multiple structured data types
 * 
 * @param schemas - Array of JSON-LD schemas
 * @returns Array of JSON-LD schemas
 *
 * @example
 * ```typescript
 * import { mergeSchemas, createOrganizationSchema, createFAQSchema } from '@opensourceframework/next-json-ld';
 * 
 * const combined = mergeSchemas([
 *   createOrganizationSchema({ organization: { name: 'My Business', url: 'https://...' } }),
 *   createFAQSchema([{ question: '...', answer: '...' }]),
 * ]);
 * ```
 */
export function mergeSchemas(schemas: JSONLDSchema[]): JSONLDSchema[] {
  return schemas;
}

export default {
  createJsonLdScript,
  createOrganizationSchema,
  createServiceSchema,
  createFAQSchema,
  createBreadcrumbSchema,
  createReviewSchema,
  createProductSchema,
  createArticleSchema,
  createEventSchema,
  mergeSchemas,
};
