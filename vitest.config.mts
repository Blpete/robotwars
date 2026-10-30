import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Phaser 3's ESM bundle has no default export. Point Vite at the CommonJS
// build so `import Phaser from 'phaser'` matches the application bundle.
export default defineConfig({
  resolve: {
    alias: {
      phaser: path.resolve(import.meta.dirname, 'node_modules/phaser/dist/phaser.js'),
    },
  },
});
