import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  environment: 'jsdom',
  include: ['**/*.spec.{ts,tsx}'],
  globals: true,
  mockReset: true,
  css: {
    modules: {
      classNameStrategy: 'non-scoped'
    }
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: [
      'node_modules/'
    ],
  },
})
