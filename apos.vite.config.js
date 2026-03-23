import { defineConfig } from '@apostrophecms/vite/vite';

export default defineConfig({
  plugins: [],
  server: {
    watch: {
      ignored: ['**/modules/views/**/*.html', '**/views/**/*.html'],
    },
  },
});
