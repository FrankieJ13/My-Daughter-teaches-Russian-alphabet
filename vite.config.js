import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/russian-alphabet-pwa/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.svg', 'pwa-512.svg'],
      manifest: {
        name: 'Азбука-игра',
        short_name: 'Азбука',
        description: 'Игра для изучения русского алфавита.',
        start_url: '/russian-alphabet-pwa/',
        scope: '/russian-alphabet-pwa/',
        display: 'standalone',
        background_color: '#fff8df',
        theme_color: '#ffcf4d',
        lang: 'ru',
        icons: [
          {
            src: '/russian-alphabet-pwa/pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/russian-alphabet-pwa/pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ]
});
