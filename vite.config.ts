import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'electron/electron.js',
    }),
  ],
  envDir: path.resolve(__dirname, 'environment'),
});
