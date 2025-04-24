import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/inventory',
        destination: 'https://dev.electorq.com/dummy/inventory',
      },
    ]
  },
  /* other config options here */
};

export default nextConfig;
