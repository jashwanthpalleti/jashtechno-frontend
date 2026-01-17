import withPWA from '@ducanh2912/next-pwa';
const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,   // disable in dev
  workboxOptions: {
    runtimeCaching: [
      // Network-first for HTML so pages aren’t stale
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: { cacheName: 'html-pages', networkTimeoutSeconds: 3 },
      },
    ],
  },
})({
  reactStrictMode: true,
});
