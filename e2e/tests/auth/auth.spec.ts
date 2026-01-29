import { test, expect } from '@playwright/test';

test('login exitoso redirige a home', async ({ page, request }) => {
  const apiBase = 'http://localhost:3000';
  const uniqueEmail = `e2e-${Date.now()}@example.com`;
  const password = '12345678';

  const registerResponse = await request.post(`${apiBase}/auth/register`, {
    data: { email: uniqueEmail, password },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/');
  await page.getByLabel('Correo').fill(uniqueEmail);
  await page.getByLabel('Contrasena').fill(password);
  await page.getByRole('button', { name: /Entrar/i }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: /notas/i })).toBeVisible();

  const token = await page.evaluate(() => localStorage.getItem('fitco_access_token'));
  expect(token).toBeTruthy();
});
