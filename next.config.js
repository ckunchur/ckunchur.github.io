/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
  output: 'export',
  images: {
    domains: ['zcsfxydhuacdmrtonkvi.supabase.co'],
    unoptimized: true,
  },
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
};

module.exports = withContentlayer(nextConfig); 