
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://lumera-beauty-store.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
