import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AmarShop - Bangladesh Premium Marketplace',
    short_name: 'AmarShop',
    description: 'Shop the best deals on electronics, fashion, home goods & more in Bangladesh',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf9f9',
    theme_color: '#a63600',
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
