import { test, expect } from '@playwright/test';

test('app carga', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/localhost:4200/);
});