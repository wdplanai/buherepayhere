/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "buyherepayhere.io" }],
        destination: "https://www.buyherepayhere.io/:path*",
        permanent: true, // 301
      },
    ];
  },
};
export default nextConfig;
