/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/dental-clinic',
    assetPrefix: '/dental-clinic/',
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
};

export default nextConfig;
