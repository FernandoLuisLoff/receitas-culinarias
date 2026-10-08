import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_PATH = '/receitas-culinarias/';
const baseURL = `http://localhost:${PORT}${BASE_PATH}`;

// Configuração do Playwright para os testes E2E (requisito 9).
// Sobe a build de produção com `vite preview` para simular o ambiente do GitHub Pages.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'html' : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
