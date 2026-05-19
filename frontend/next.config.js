/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typedRoutes: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
    ],
  },
  async rewrites() {
    const geoserver =
      process.env.NEXT_PUBLIC_GEOSERVER_URL ?? 'https://gis.virunga.org/geoserver';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'}/api/:path*`,
      },
      {
        source: '/api/geoserver/:path*',
        destination: `${geoserver}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
