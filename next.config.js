/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // No need for custom webpack externals for three.js
};

module.exports = nextConfig;