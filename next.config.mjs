import withPWA from "@ducanh2912/next-pwa";
const isProd = process.env.NODE_ENV === "production";

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: { cacheName: "html-pages", networkTimeoutSeconds: 3 },
      },
    ],
  },
})({
  reactStrictMode: true,
  async rewrites() {
    return []; // don’t touch /api/*
  },
});
