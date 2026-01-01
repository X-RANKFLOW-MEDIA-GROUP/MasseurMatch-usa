import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/signup",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
