import { describe, it, expect } from 'vitest';
import {
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
  type JSONLDSchema,
} from '../src/index';

describe('next-json-ld', () => {
  describe('createJsonLdScript', () => {
    it('should stringify a single schema', () => {
      const schema = {
        '@context': 'https://schema.org' as const,
        '@type': 'Organization',
        name: 'Test Org',
      };
      const result = createJsonLdScript(schema);
      expect(result).toContain('"@context":"https://schema.org"');
      expect(result).toContain('"@type":"Organization"');
      expect(result).toContain('"name":"Test Org"');
    });

    it('should stringify an array of schemas', () => {
      const schemas = [
        {
          '@context': 'https://schema.org' as const,
          '@type': 'Organization',
          name: 'Test Org',
        },
        {
          '@context': 'https://schema.org' as const,
          '@type': 'WebPage',
          name: 'Test Page',
        },
      ];
      const result = createJsonLdScript(schemas);
      expect(result).toContain('Test Org');
      expect(result).toContain('Test Page');
    });
  });

  describe('createOrganizationSchema', () => {
    it('should create a basic organization schema', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('My Business');
      expect(schema.url).toBe('https://mybusiness.com');
    });

    it('should include all optional organization fields', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
          description: 'A great business',
          telephone: '+1-555-123-4567',
          email: 'info@mybusiness.com',
          priceRange: '$$',
          image: 'https://mybusiness.com/image.jpg',
          logo: 'https://mybusiness.com/logo.jpg',
          sameAs: ['https://twitter.com/mybusiness'],
          id: 'https://mybusiness.com/#organization',
        },
      });

      expect(schema.description).toBe('A great business');
      expect(schema.telephone).toBe('+1-555-123-4567');
      expect(schema.email).toBe('info@mybusiness.com');
      expect(schema.priceRange).toBe('$$');
      expect(schema.image).toBe('https://mybusiness.com/image.jpg');
      expect(schema.logo).toBe('https://mybusiness.com/logo.jpg');
      expect(schema.sameAs).toContain('https://twitter.com/mybusiness');
      expect(schema['@id']).toBe('https://mybusiness.com/#organization');
    });

    it('should add geo circle area served', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        areaServed: {
          geoMidpoint: { latitude: 52.3676, longitude: 4.9041 },
          geoRadius: '30km',
        },
      });

      expect(schema.areaServed).toEqual({
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 52.3676,
          longitude: 4.9041,
        },
        geoRadius: '30km',
      });
    });

    it('should add city area served', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        areaServed: {
          city: 'Amsterdam',
        },
      });

      expect(schema.areaServed).toEqual({
        '@type': 'City',
        name: 'Amsterdam',
      });
    });

    it('should add 24/7 opening hours', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        openingHoursSpecification: {
          open24Hours: true,
        },
      });

      expect(schema.openingHours).toBe('Mo-Su');
    });

    it('should add specific opening hours', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        openingHoursSpecification: {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      });

      expect(schema.openingHoursSpecification).toEqual({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      });
    });

    it('should allow custom organization type', () => {
      const schema = createOrganizationSchema({
        organization: {
          name: 'My Restaurant',
          url: 'https://myrestaurant.com',
        },
        type: 'Restaurant',
      });

      expect(schema['@type']).toBe('Restaurant');
    });
  });

  describe('createServiceSchema', () => {
    it('should create a service schema', () => {
      const schema = createServiceSchema({
        name: 'Web Development',
        description: 'Professional web development services',
        url: 'https://mybusiness.com/services/web-development',
        provider: {
          name: 'My Agency',
          url: 'https://myagency.com',
        },
      });

      expect(schema['@type']).toBe('Service');
      expect(schema.name).toBe('Web Development');
      expect(schema.description).toBe('Professional web development services');
      expect(schema.url).toBe('https://mybusiness.com/services/web-development');
      expect(schema.provider).toEqual({
        '@type': 'LocalBusiness',
        name: 'My Agency',
        url: 'https://myagency.com',
      });
    });

    it('should include optional service fields', () => {
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

      expect(schema.image).toBe('https://mybusiness.com/services/web-dev.jpg');
      expect(schema.serviceType).toBe('Professional Service');
      expect(schema.areaServed).toEqual({
        '@type': 'City',
        name: 'New York',
      });
    });
  });

  describe('createFAQSchema', () => {
    it('should create a FAQ schema', () => {
      const faqs = [
        { question: 'What are your hours?', answer: 'We are open 24/7.' },
        { question: 'Do you offer refunds?', answer: 'Yes, within 30 days.' },
      ];

      const schema = createFAQSchema(faqs);

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]).toEqual({
        '@type': 'Question',
        name: 'What are your hours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are open 24/7.',
        },
      });
    });
  });

  describe('createBreadcrumbSchema', () => {
    it('should create a breadcrumb schema', () => {
      const items = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Products', url: 'https://example.com/products' },
        { name: 'Widgets', url: 'https://example.com/products/widgets' },
      ];

      const schema = createBreadcrumbSchema(items);

      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com',
      });
      expect(schema.itemListElement[2].position).toBe(3);
    });
  });

  describe('createReviewSchema', () => {
    it('should create a review schema', () => {
      const schema = createReviewSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        reviewCount: 150,
        ratingValue: 4.8,
        reviews: [
          {
            author: 'John Doe',
            reviewBody: 'Excellent service!',
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

      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('My Business');
      expect(schema.aggregateRating).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: 150,
        bestRating: 5,
        worstRating: 1,
      });
      expect(schema.review).toHaveLength(2);
      expect(schema.review[0].author.name).toBe('John Doe');
      expect(schema.review[0].reviewRating.ratingValue).toBe(5);
    });

    it('should allow custom rating scale', () => {
      const schema = createReviewSchema({
        organization: {
          name: 'My Business',
          url: 'https://mybusiness.com',
        },
        reviewCount: 100,
        ratingValue: 8.5,
        bestRating: 10,
        worstRating: 0,
        reviews: [],
      });

      expect(schema.aggregateRating.bestRating).toBe(10);
      expect(schema.aggregateRating.worstRating).toBe(0);
    });
  });

  describe('createProductSchema', () => {
    it('should create a basic product schema', () => {
      const schema = createProductSchema({
        name: 'Premium Widget',
        description: 'High-quality widget for all your needs',
      });

      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Premium Widget');
      expect(schema.description).toBe('High-quality widget for all your needs');
    });

    it('should include all optional product fields', () => {
      const schema = createProductSchema({
        name: 'Premium Widget',
        description: 'High-quality widget for all your needs',
        image: ['https://example.com/widget1.jpg', 'https://example.com/widget2.jpg'],
        url: 'https://example.com/products/widget',
        brand: 'WidgetCo',
        sku: 'WGT-001',
        price: 29.99,
        priceCurrency: 'USD',
        availability: 'InStock',
      });

      expect(schema.image).toHaveLength(2);
      expect(schema.url).toBe('https://example.com/products/widget');
      expect(schema.brand).toEqual({ '@type': 'Brand', name: 'WidgetCo' });
      expect(schema.sku).toBe('WGT-001');
      expect(schema.offers).toEqual({
        '@type': 'Offer',
        price: '29.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    });
  });

  describe('createArticleSchema', () => {
    it('should create an article schema', () => {
      const schema = createArticleSchema({
        headline: 'How to Build Accessible Websites',
        datePublished: '2024-01-15',
        author: 'Jane Smith',
        publisher: 'Tech Blog',
      });

      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('How to Build Accessible Websites');
      expect(schema.datePublished).toBe('2024-01-15');
      expect(schema.author.name).toBe('Jane Smith');
      expect(schema.publisher.name).toBe('Tech Blog');
    });

    it('should include all optional article fields', () => {
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

      expect(schema.description).toBe('A comprehensive guide to web accessibility');
      expect(schema.image).toBe('https://example.com/article.jpg');
      expect(schema.dateModified).toBe('2024-01-20');
      expect(schema.publisher.logo).toEqual({
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      });
      expect(schema.mainEntityOfPage).toEqual({
        '@type': 'WebPage',
        '@id': 'https://example.com/articles/accessible-websites',
      });
    });
  });

  describe('createEventSchema', () => {
    it('should create a basic event schema', () => {
      const schema = createEventSchema({
        name: 'Tech Conference 2024',
        startDate: '2024-06-15T09:00:00Z',
      });

      expect(schema['@type']).toBe('Event');
      expect(schema.name).toBe('Tech Conference 2024');
      expect(schema.startDate).toBe('2024-06-15T09:00:00Z');
    });

    it('should include all optional event fields', () => {
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
        image: 'https://example.com/event.jpg',
        eventStatus: 'EventScheduled',
        eventAttendanceMode: 'OfflineEventAttendanceMode',
      });

      expect(schema.description).toBe('Annual technology conference');
      expect(schema.endDate).toBe('2024-06-17T18:00:00Z');
      expect(schema.location.name).toBe('Convention Center');
      expect(schema.location.address.streetAddress).toBe('123 Main St, San Francisco, CA');
      expect(schema.url).toBe('https://example.com/events/tech-conf-2024');
      expect(schema.image).toBe('https://example.com/event.jpg');
      expect(schema.eventStatus).toBe('https://schema.org/EventScheduled');
      expect(schema.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
    });
  });

  describe('mergeSchemas', () => {
    it('should merge multiple schemas into an array', () => {
      const orgSchema = createOrganizationSchema({
        organization: { name: 'My Business', url: 'https://mybusiness.com' },
      });
      const faqSchema = createFAQSchema([
        { question: 'Q1?', answer: 'A1' },
      ]);

      const merged = mergeSchemas([orgSchema, faqSchema]);

      expect(merged).toHaveLength(2);
      expect(merged[0]['@type']).toBe('LocalBusiness');
      expect(merged[1]['@type']).toBe('FAQPage');
    });
  });

  describe('edge cases', () => {
    describe('createJsonLdScript', () => {
      it('should handle empty object', () => {
        const result = createJsonLdScript({ '@context': 'https://schema.org', '@type': 'Thing' });
        expect(result).toContain('schema.org');
        expect(result).toContain('Thing');
      });

      it('should handle deeply nested objects', () => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: 99.99,
              minPrice: 49.99,
              maxPrice: 149.99,
            },
          },
        };
        const result = createJsonLdScript(schema);
        expect(result).toContain('PriceSpecification');
        expect(result).toContain('99.99');
      });

      it('should handle special characters in strings', () => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: "Test & Sons \"Company\" <test@example.com>",
          description: 'Special chars: éàüö 中文日本語',
        };
        const result = createJsonLdScript(schema);
        expect(result).toContain('Test & Sons');
        expect(result).toContain('中文日本語');
      });

      it('should handle Unicode characters', () => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: '🎉 New Year\'s Eve Party 🎊',
          description: 'Celebrate! 🚀',
        };
        const result = createJsonLdScript(schema);
        expect(result).toContain('🎉');
        expect(result).toContain('🎊');
        expect(result).toContain('🚀');
      });
    });

    describe('createFAQSchema', () => {
      it('should handle empty FAQ array', () => {
        const schema = createFAQSchema([]);
        expect(schema.mainEntity).toHaveLength(0);
      });

      it('should handle single FAQ', () => {
        const schema = createFAQSchema([
          { question: 'Q1', answer: 'A1' },
        ]);
        expect(schema.mainEntity).toHaveLength(1);
        expect(schema.mainEntity[0].name).toBe('Q1');
        expect(schema.mainEntity[0].acceptedAnswer.text).toBe('A1');
      });

      it('should handle FAQ with special characters', () => {
        const schema = createFAQSchema([
          { question: 'What is "CSRF"?', answer: 'It\'s <strong>secure</strong>!' },
        ]);
        expect(schema.mainEntity[0].name).toBe('What is "CSRF"?');
        expect(schema.mainEntity[0].acceptedAnswer.text).toBe('It\'s <strong>secure</strong>!');
      });
    });

    describe('createBreadcrumbSchema', () => {
      it('should handle empty breadcrumb array', () => {
        const schema = createBreadcrumbSchema([]);
        expect(schema.itemListElement).toHaveLength(0);
      });

      it('should handle single breadcrumb', () => {
        const schema = createBreadcrumbSchema([
          { name: 'Home', url: 'https://example.com' },
        ]);
        expect(schema.itemListElement).toHaveLength(1);
        expect(schema.itemListElement[0].position).toBe(1);
      });

      it('should handle URLs with special characters', () => {
        const schema = createBreadcrumbSchema([
          { name: 'Category', url: 'https://example.com/category?filter=price<100' },
        ]);
        expect(schema.itemListElement[0].item).toContain('filter=price');
      });
    });

    describe('createProductSchema', () => {
      it('should handle price without currency', () => {
        const schema = createProductSchema({
          name: 'Test',
          description: 'Test product',
          price: 29.99,
        });
        // Should not include offers if currency is missing
        expect(schema.offers).toBeUndefined();
      });

      it('should handle currency without price', () => {
        const schema = createProductSchema({
          name: 'Test',
          description: 'Test product',
          priceCurrency: 'USD',
        });
        expect(schema.offers).toBeUndefined();
      });

      it('should handle price of zero', () => {
        const schema = createProductSchema({
          name: 'Free Item',
          description: 'Free product',
          price: 0,
          priceCurrency: 'USD',
        });
        expect(schema.offers).toBeDefined();
        expect(schema.offers?.price).toBe('0.00');
      });

      it('should handle all availability options', () => {
        const inStock = createProductSchema({ name: 'a', description: 'b', price: 9.99, priceCurrency: 'USD', availability: 'InStock' });
        const outOfStock = createProductSchema({ name: 'a', description: 'b', price: 9.99, priceCurrency: 'USD', availability: 'OutOfStock' });
        const preOrder = createProductSchema({ name: 'a', description: 'b', price: 9.99, priceCurrency: 'USD', availability: 'PreOrder' });
        const backorder = createProductSchema({ name: 'a', description: 'b', price: 9.99, priceCurrency: 'USD', availability: 'Backorder' });
        const limited = createProductSchema({ name: 'a', description: 'b', price: 9.99, priceCurrency: 'USD', availability: 'LimitedAvailability' });

        expect(inStock.offers?.availability).toContain('InStock');
        expect(outOfStock.offers?.availability).toContain('OutOfStock');
        expect(preOrder.offers?.availability).toContain('PreOrder');
        expect(backorder.offers?.availability).toContain('Backorder');
        expect(limited.offers?.availability).toContain('LimitedAvailability');
      });
    });

    describe('createOrganizationSchema', () => {
      it('should handle organization without optional fields', () => {
        const schema = createOrganizationSchema({
          organization: {
            name: 'Test',
            url: 'https://test.com',
          },
        });
        expect(schema.name).toBe('Test');
        expect(schema.url).toBe('https://test.com');
        expect(schema.description).toBeUndefined();
        expect(schema.telephone).toBeUndefined();
      });

      it('should handle areaServed with region and country', () => {
        const schema = createOrganizationSchema({
          organization: {
            name: 'Test',
            url: 'https://test.com',
          },
          areaServed: {
            region: 'California',
            country: 'USA',
          },
        });
        // Only city and geoMidpoint/geoRadius are handled in current implementation
        expect(schema.areaServed).toBeUndefined();
      });

      it('should handle opening hours without specification', () => {
        const schema = createOrganizationSchema({
          organization: {
            name: 'Test',
            url: 'https://test.com',
          },
        });
        expect(schema.openingHours).toBeUndefined();
        expect(schema.openingHoursSpecification).toBeUndefined();
      });
    });

    describe('createReviewSchema', () => {
      it('should handle review without reviews array', () => {
        const schema = createReviewSchema({
          organization: {
            name: 'Test',
            url: 'https://test.com',
          },
          reviewCount: 0,
          ratingValue: 0,
          reviews: [],
        });
        expect(schema.review).toHaveLength(0);
      });

      it('should handle default rating scale', () => {
        const schema = createReviewSchema({
          organization: {
            name: 'Test',
            url: 'https://test.com',
          },
          reviewCount: 10,
          ratingValue: 3,
          reviews: [],
        });
        expect(schema.aggregateRating?.bestRating).toBe(5);
        expect(schema.aggregateRating?.worstRating).toBe(1);
      });
    });

    describe('createArticleSchema', () => {
      it('should handle article without optional fields', () => {
        const schema = createArticleSchema({
          headline: 'Test Headline',
          datePublished: '2024-01-01',
          author: 'Author Name',
          publisher: 'Publisher Name',
        });
        expect(schema.headline).toBe('Test Headline');
        expect(schema.description).toBeUndefined();
        expect(schema.image).toBeUndefined();
        expect(schema.dateModified).toBeUndefined();
      });

      it('should handle URL without other optional fields', () => {
        const schema = createArticleSchema({
          headline: 'Test',
          datePublished: '2024-01-01',
          author: 'Author',
          publisher: 'Publisher',
          url: 'https://example.com/article',
        });
        expect(schema.mainEntityOfPage).toBeDefined();
        expect(schema.mainEntityOfPage?.['@id']).toBe('https://example.com/article');
      });
    });

    describe('createEventSchema', () => {
      it('should handle event with only required fields', () => {
        const schema = createEventSchema({
          name: 'Test Event',
          startDate: '2024-06-15T09:00:00Z',
        });
        expect(schema.name).toBe('Test Event');
        expect(schema.startDate).toBe('2024-06-15T09:00:00Z');
        expect(schema.description).toBeUndefined();
        expect(schema.endDate).toBeUndefined();
        expect(schema.location).toBeUndefined();
      });

      it('should handle all event status options', () => {
        const scheduled = createEventSchema({ name: 'a', startDate: '2024-01-01', eventStatus: 'EventScheduled' });
        const cancelled = createEventSchema({ name: 'a', startDate: '2024-01-01', eventStatus: 'EventCancelled' });
        const postponed = createEventSchema({ name: 'a', startDate: '2024-01-01', eventStatus: 'EventPostponed' });
        const rescheduled = createEventSchema({ name: 'a', startDate: '2024-01-01', eventStatus: 'EventRescheduled' });

        expect(scheduled.eventStatus).toContain('EventScheduled');
        expect(cancelled.eventStatus).toContain('EventCancelled');
        expect(postponed.eventStatus).toContain('EventPostponed');
        expect(rescheduled.eventStatus).toContain('EventRescheduled');
      });

      it('should handle all event attendance mode options', () => {
        const offline = createEventSchema({ name: 'a', startDate: '2024-01-01', eventAttendanceMode: 'OfflineEventAttendanceMode' });
        const online = createEventSchema({ name: 'a', startDate: '2024-01-01', eventAttendanceMode: 'OnlineEventAttendanceMode' });
        const mixed = createEventSchema({ name: 'a', startDate: '2024-01-01', eventAttendanceMode: 'MixedEventAttendanceMode' });

        expect(offline.eventAttendanceMode).toContain('OfflineEventAttendanceMode');
        expect(online.eventAttendanceMode).toContain('OnlineEventAttendanceMode');
        expect(mixed.eventAttendanceMode).toContain('MixedEventAttendanceMode');
      });
    });

    describe('mergeSchemas', () => {
      it('should handle empty array', () => {
        const merged = mergeSchemas([]);
        expect(merged).toHaveLength(0);
      });

      it('should handle many schemas', () => {
        const schemas = Array(10).fill(null).map((_, i) =>
          createOrganizationSchema({
            organization: { name: `Org ${i}`, url: `https://org${i}.com` },
          })
        );
        const merged = mergeSchemas(schemas);
        expect(merged).toHaveLength(10);
      });
    });
  });
});
