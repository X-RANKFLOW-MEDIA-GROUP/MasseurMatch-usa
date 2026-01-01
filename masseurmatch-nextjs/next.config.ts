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
      {
        source: "/legal/privacy",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      {
        source: "/legal/cookies",
        destination: "/legal/cookie-policy",
        permanent: true,
      },
      {
        source: "/legal/content-guidelines",
        destination: "/legal/community-guidelines",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
