import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for production
  reactCompiler: process.env.NODE_ENV === 'production',
  
  typescript: {
    ignoreBuildErrors: false, // Set to false for production
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all image domains for flexibility
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Vercel-specific optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
