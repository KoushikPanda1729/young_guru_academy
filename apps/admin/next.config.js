// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@t2p-admin/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "788fa1ad317b3b2376ecd0bdcf4f80a1.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vz-89e3d251-e65.b-cdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.talk2partners.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
