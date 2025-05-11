import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  // eslint-disable-next-line no-undef
  plugins: [svelte({ hot: !process.env.VITEST }), svelteTesting()],
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
