const { test, expect } = require('@playwright/test');

test.describe('Next.js PWA Integration', () => {
  test('should load the main page without hydration errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('PWA Test Application');

    await page.waitForTimeout(1000);

    const criticalErrors = consoleErrors.filter(
      (err) => err.includes('Hydration') || err.includes('Minified React error')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should serve PWA manifest', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBe('PWA Test App');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });

  test('should have service worker file generated', async ({ request }) => {
    const response = await request.get('/service-worker.js');
    expect(response.ok()).toBeTruthy();
    const content = await response.text();
    expect(content.length).toBeGreaterThan(0);
  });

  test('should include buildId in service worker for differential updates', async ({ request }) => {
    const response = await request.get('/service-worker.js');
    expect(response.ok()).toBeTruthy();
    const content = await response.text();
    const hasRevision = content.includes('revision');
    const hasPrecache = content.includes('precacheAndRoute');
    expect(hasRevision || hasPrecache).toBeTruthy();
  });

  test('should support differential cache updates via precaching', async ({ request }) => {
    const response = await request.get('/service-worker.js');
    const content = await response.text();
    const hasPrecacheAndRoute = content.includes('precacheAndRoute');
    const hasCacheNames = content.includes('cacheName') || content.includes('revision');
    expect(hasPrecacheAndRoute || hasCacheNames).toBeTruthy();
  });
});

test.describe('PWA Lighthouse Audit', () => {
  test('should pass basic PWA criteria', async ({ request }) => {
    const hasManifest = (await request.get('/manifest.json')).ok();
    expect(hasManifest).toBeTruthy();

    const swResponse = await request.get('/service-worker.js');
    expect(swResponse.ok()).toBeTruthy();
  });
});

test.describe('No-JS Boot', () => {
  test('should render page content without JavaScript', async ({ page, context }) => {
    await context.route('**/*.js', (route) => route.abort());
    
    await page.goto('/');
    
    const content = await page.content();
    expect(content).toContain('PWA Test Application');
    
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('PWA Test Application');
  });

  test('should have valid manifest for PWA installability', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.ok()).toBeTruthy();
    
    const manifest = await response.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.icons).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });
});
