import { test, expect } from '@playwright/test';

test.describe('react-virtualized Visual Regression', () => {
  test('Virtualization List matches baseline snapshot', async ({ page }) => {
    // Navigate to the virtualization demo in the showcase app
    await page.goto('/virtualization');
    
    // Wait for the list to be rendered
    const list = page.locator('.ReactVirtualized__List');
    await expect(list).toBeVisible();

    // Take a snapshot of the list
    await expect(page).toHaveScreenshot('virtual-list.png', {
      mask: [page.locator('.timestamp')], // Mask timestamps if they exist to avoid noise
    });
  });

  test('Scrolling behavior maintains layout integrity', async ({ page }) => {
    await page.goto('/virtualization');
    const list = page.locator('.ReactVirtualized__Grid'); // react-virtualized List uses Grid internally
    
    await expect(list).toBeVisible();

    // Scroll down significantly
    await list.evaluate((node) => node.scrollTop = 5000);
    
    // Wait for virtualized items to render
    await page.waitForTimeout(500);

    // Take a snapshot after scrolling
    await expect(page).toHaveScreenshot('virtual-list-scrolled.png');
  });
});
