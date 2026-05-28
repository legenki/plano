import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function htmlPartialsAndCopyPlugin() {
  return {
    name: 'html-partials-and-copy',
    transformIndexHtml(html) {
      return html.replace(/<!--#include\s+file="([^"]+)"-->/g, (match, filepath) => {
        const fullPath = path.resolve(process.cwd(), filepath);
        try {
          return fs.readFileSync(fullPath, 'utf-8');
        } catch (e) {
          console.error(`Could not read partial: ${fullPath}`);
          return match;
        }
      });
    },
    closeBundle() {
      // Copy lib folder to dist on build
      const srcDir = path.resolve(process.cwd(), 'lib');
      const destDir = path.resolve(process.cwd(), 'dist/lib');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    }
  }
}

export default defineConfig({
  base: '/plano/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [htmlPartialsAndCopyPlugin()]
});
