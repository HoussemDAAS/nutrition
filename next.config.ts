module.exports = {
  typescript: {
    ignoreBuildErrors: true, // Temporary during fixes
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};