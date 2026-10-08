import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Base ajustado para o GitHub Pages: https://<usuario>.github.io/receitas-culinarias/
// Ajuste este valor para "/<nome-do-repositorio>/" caso o repositório tenha outro nome.
export default defineConfig({
  base: '/receitas-culinarias/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['node_modules', 'dist', 'e2e'],
  },
})
