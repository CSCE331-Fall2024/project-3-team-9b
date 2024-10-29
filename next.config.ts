import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
// next.config.js
const path = require('path');

module.exports = {
  pageExtensions: ['tsx', 'ts', 'js', 'jsx'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src/app');
    return config;
  },
};
