import { expect, test } from '@playwright/test';

// Fluxo 1: autenticação com redirecionamento para a área administrativa.
test.describe('Fluxo de autenticação', () => {
  test('bloqueia acesso à área administrativa sem login e redireciona após autenticar', async ({ page }) => {
    await page.goto('./admin');

    // Usuário não autenticado é redirecionado para a tela de login.
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login administrativo' })).toBeVisible();

    await page.getByLabel('Usuário').fill('emilys');
    await page.getByLabel('Senha').fill('emilyspass');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Após o login bem-sucedido, o usuário é enviado para a área administrativa.
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: 'Gestão de receitas' })).toBeVisible();

    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page.getByRole('link', { name: 'Login administrativo' })).toBeVisible();
  });
});
