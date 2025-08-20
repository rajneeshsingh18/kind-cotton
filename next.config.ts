import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // ✅ ADD THIS NEW ENTRY FOR UNSPLASH
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    };
    return config;
  }
};

export default nextConfig;
