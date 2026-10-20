import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Furrow',
    short_name: 'Furrow',
    description: 'Home growing for busy Nigerian households.',
    start_url: '/',
    display: 'browser',
    background_color: '#f4f3e9',
    theme_color: '#f4f3e9',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
