/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yt3.ggpht.com', 'i.ytimg.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // This will allow the build to continue even with ESLint errors
  },
};

export default nextConfig;