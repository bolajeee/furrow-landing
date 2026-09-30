/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.FURROW_BUILD_DIR || '.next',
};

module.exports = nextConfig;
