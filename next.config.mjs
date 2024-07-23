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
  };
  
  export default nextConfig;