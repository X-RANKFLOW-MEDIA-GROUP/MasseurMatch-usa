import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
