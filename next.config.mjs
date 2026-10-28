/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For zero-cost static export or portable deployment
  },
};

export default nextConfig;
