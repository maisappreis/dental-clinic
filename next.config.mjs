/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/dental-clinic',
    assetPrefix: '/dental-clinic/',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
};

export default nextConfig;
