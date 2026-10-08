import { expect, test } from '@playwright/test';

// Fluxo 2: busca de receitas e visualização dos detalhes.
test.describe('Fluxo de busca e detalhes', () => {
  test('busca uma receita pelo nome e navega até a tela de detalhes', async ({ page }) => {
    await page.goto('./');

    await expect(page.getByRole('heading', { name: 'Explore receitas' })).toBeVisible();

    await page.getByPlaceholder('Buscar receita pelo nome...').fill('Pizza');

    const recipeCard = page.getByText('Classic Margherita Pizza').first();
    await expect(recipeCard).toBeVisible();
    await recipeCard.click();

    await expect(page).toHaveURL(/\/receitas\/\d+/);
    await expect(page.getByRole('heading', { name: 'Classic Margherita Pizza' })).toBeVisible();
    await expect(page.getByText('Ingredientes')).toBeVisible();
  });
});
