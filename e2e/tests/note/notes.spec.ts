import { test, expect } from '@playwright/test';

test('crea una nota y aparece en activas', async ({ page, request }) => {
  const apiBase = 'http://localhost:3000';
  const email = `e2e-notes-${Date.now()}@example.com`;
  const password = '12345678';

  const registerResponse = await request.post(`${apiBase}/auth/register`, {
    data: { email, password },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contrasena').fill(password);
  await page.getByRole('button', { name: /Entrar/i }).click();
  await expect(page).toHaveURL(/\/home$/);

  const title = `Nota e2e ${Date.now()}`;
  const content = 'Contenido generado por e2e';

  await page.getByLabel('Titulo').fill(title);
  await page.getByLabel('Contenido').fill(content);
  await page.getByRole('button', { name: /Crear nota/i }).click();

  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByText(content)).toBeVisible();
});
