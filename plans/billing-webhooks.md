# Plan: Billing Webhook Ingestion + Subscription Sync

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **Env vars:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **All services require DB** — no in-memory fallback

## Goal

Allow users to subscribe to a plan via Stripe, manage subscriptions through Stripe's hosted pages, and keep subscription state synced in our DB via webhooks.

---

## 1. Stripe Events to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate subscription, link customer to user |
| `customer.subscription.created` | Create subscription record |
| `customer.subscription.updated` | Sync plan tier, status, period dates |
| `customer.subscription.deleted` | Mark subscription cancelled |
| `invoice.payment_failed` | Mark subscription `past_due` |
| `invoice.payment_succeeded` | Confirm subscription active, update period_end |

---

## 2. DB Schema Additions

### `subscriptions` table

```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  stripe_customer_id text NOT NULL UNIQUE,
  stripe_subscription_id text NOT NULL UNIQUE,
  plan_tier text NOT NULL DEFAULT 'free',  -- 'free' | 'starter' | 'pro' | 'enterprise'
  status text NOT NULL DEFAULT 'active',  -- 'active' | 'past_due' | 'cancelled' | 'trialing'
  stripe_price_id text,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
```

### `webhook_events` table (idempotency)

```sql
CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  raw jsonb NOT NULL
);
```

### `users` table (if not exists)

```sql
-- If users table already exists, add these columns instead:
ALTER TABLE users ADD COLUMN stripe_customer_id text UNIQUE;
ALTER TABLE users ADD COLUMN subscription_status text NOT NULL DEFAULT 'none';
```

### Drizzle schema file: `src/db/schema/subscriptions.ts`

```ts
import { pgTable, text, uuid, timestamptz, boolean, jsonb } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  planTier: text('plan_tier').notNull().default('free'),
  status: text('status').notNull().default('active'),
  stripePriceId: text('stripe_price_id'),
  currentPeriodStart: timestamptz('current_period_start').notNull(),
  currentPeriodEnd: timestamptz('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  createdAt: timestamptz('created_at').notNull().defaultNow(),
  updatedAt: timestamptz('updated_at').notNull().defaultNow(),
});

export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripeEventId: text('stripe_event_id').notNull().unique(),
  eventType: text('event_type').notNull(),
  processedAt: timestamptz('processed_at').notNull().defaultNow(),
  raw: jsonb('raw').notNull(),
});
```

---

## 3. Directory Structure

```
src/
  lib/
    billing/
      stripe-handler.ts      # event → handler dispatch
      events/
        checkout-completed.ts
        subscription-updated.ts
        subscription-deleted.ts
        invoice-payment-failed.ts
        invoice-payment-succeeded.ts
      service.ts             # SubscriptionService
      errors.ts              # WebhookProcessingError
  server/
    routes/
      webhooks.stripe.ts     # POST /webhooks/stripe
tests/
  billing/
    stripe-handler.test.ts
    service.test.ts
```

---

## 4. Webhook Endpoint

**Route:** `POST /webhooks/stripe`

```ts
// src/server/routes/webhooks.stripe.ts
import { Hono } from 'hono';
import { stripeHandler } from '@/lib/billing/stripe-handler';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export function registerStripeWebhook(app: Hono) {
  app.post('/webhooks/stripe', async (c) => {
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.raw.text();

    try {
      const event = await stripeHandler.verifyAndParse({
        rawBody,
        signature: sig!,
        secret: webhookSecret,
      });

      await stripeHandler.dispatch(event);
      return c.json({ received: true });
    } catch (err) {
      if (err instanceof stripeHandler.errors.InvalidSignature) {
        return c.json({ error: 'invalid signature' }, 400);
      }
      console.error('Webhook processing error:', err);
      return c.json({ error: 'processing failed' }, 500);
    }
  });
}
```

**Note:** The raw body must be preserved — Hono's default JSON parsing destroys the raw body needed for signature verification. Use `c.req.raw.text()`.

---

## 5. Subscription Service

```ts
// src/lib/billing/service.ts

export class SubscriptionService {
  /** Check if user has an active paid subscription */
  async hasActiveSubscription(userId: string): Promise<boolean>;

  /** Get current subscription for a user */
  async getSubscription(userId: string): Promise<Subscription | null>;

  /** Create subscription from checkout.completed event */
  async createFromCheckout(session: Stripe.Checkout.Session): Promise<Subscription>;

  /** Sync from subscription.updated event */
  async updateFromStripe(subscription: Stripe.Subscription): Promise<void>;

  /** Cancel subscription */
  async cancel(subscriptionId: string): Promise<void>;

  /** Mark past_due from invoice.payment_failed */
  async markPastDue(subscriptionId: string): Promise<void>;

  /** Activate from invoice.payment_succeeded */
  async activate(subscriptionId: string, periodEnd: Date): Promise<void>;
}
```

---

## 6. Idempotency

Every webhook handler checks `webhook_events.stripe_event_id` before processing:

```ts
async function processIfNew(eventId: string, handler: () => Promise<void>) {
  const existing = await db.query.webhookEvents.findFirst({
    where: eq(webhookEvents.stripeEventId, eventId),
  });
  if (existing) return; // already processed
  await handler();
  await db.insert(webhookEvents).values({ stripeEventId: eventId, ... });
}
```

---

## 7. Stripe Signature Verification

```ts
import Stripe from 'stripe';

export const stripeHandler = {
  async verifyAndParse(opts: {
    rawBody: string;
    signature: string;
    secret: string;
  }): Promise<Stripe.Event> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    return stripe.webhooks.constructEvent(opts.rawBody, opts.signature, opts.secret);
  },

  async dispatch(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  },
};
```

---

## 8. Environment Variables

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
# Optional: STRIPE_PRICE_ID_STARTER, STRIPE_PRICE_ID_PRO, etc.
```

---

## 9. Migration File

`drizzle/0003_subscriptions.sql` — create `subscriptions` and `webhook_events` tables, add `stripe_customer_id` to `users` table if it doesn't have it.

---

## 10. Testing Strategy

| Test | What it covers |
|------|---------------|
| `stripe-handler.test.ts` | Each event type dispatches to correct handler |
| `idempotency.test.ts` | Same event ID processed twice → second is no-op |
| `service.hasActiveSubscription.test.ts` | Returns true only for `status = 'active'` |
| `checkout-completed.test.ts` | Creates subscription linking user + customer ID |
| `subscription-deleted.test.ts` | Sets status to `cancelled` |
| `invoice-payment-failed.test.ts` | Sets status to `past_due` |
| `invalid-signature.test.ts` | Returns 400 for bad signature |

**Mock approach:** Use Stripe's `stripe-mock` or intercept at the HTTP level with `msw`.

---

## 11. Implementation Order

1. Add `stripe` dependency: `pnpm add stripe`
2. Create `src/lib/billing/service.ts` — `SubscriptionService` with all methods (DB-backed)
3. Create `src/lib/billing/errors.ts` — error types
4. Create `src/lib/billing/events/*.ts` — per-event handlers
5. Create `src/lib/billing/stripe-handler.ts` — verify + dispatch
6. Add `src/db/schema/subscriptions.ts` — schema definitions
7. Add `drizzle/0003_subscriptions.sql` — migration
8. Create `src/server/routes/webhooks.stripe.ts` — webhook endpoint
9. Wire into main app: `registerStripeWebhook(app)`
10. Write tests for each event handler + idempotency
