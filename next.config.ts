/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.API_URL || "https://default-api-url.com"
        }/api/:path*/`,
      },
    ];
  },
};

export default nextConfig;
