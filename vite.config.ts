import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  base: mode === 'production' ? '/sleep/' : '/',
  resolve: {
    alias: {
      test: '/src/test',
      data: '/src/data',
      modules: '/src/modules',
      locales: '/src/locales'
    }
  },
  server: {
    watch: {
      ignored: ['!/public/**']
    }
  },
  test: {
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
      ]
    }
  }
}))
