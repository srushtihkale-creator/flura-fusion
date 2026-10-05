/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["gsap", "lenis"],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/plants/:slug",
        destination: "/product/:slug",
      },
      {
        source: "/pots/:slug",
        destination: "/product/:slug",
      },
      {
        source: "/seeds/:slug",
        destination: "/product/:slug",
      },
    ];
  },
};

export default nextConfig;
