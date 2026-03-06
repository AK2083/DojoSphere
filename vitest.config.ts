import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@lib': path.resolve(__dirname, 'src/lib')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      clean: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'env.d.ts',
        'main.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/types/**',
        '**/exceptions/**',
        '**/mocks/**',
        '**/pages/**',
        '**/autoimport/**',
        '**/components/**',
        '**/pages/**',
        '**/constants/**',
        '**/monitoring/**',
        '**/form/**',
        '**/provider/**'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
})
