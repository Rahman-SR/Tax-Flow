import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gst: resolve(__dirname, 'gst.html'),
        itr: resolve(__dirname, 'itr.html'),
        reports: resolve(__dirname, 'reports.html')
      }
    }
  }
});
