import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ====================================
  // IMAGE OPTIMIZATION
  // ====================================
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ====================================
  // PERFORMANCE & BUILD
  // ====================================
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header (security)
  productionBrowserSourceMaps: false, // Disable source maps in production

  // ====================================
  // TYPESCRIPT & LINTING
  // ====================================
  typescript: {
    // Fail build on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Fail build on lint errors
    ignoreDuringBuilds: false,
  },

  // ====================================
  // EXPERIMENTAL FEATURES
  // ====================================
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
    ],
  },

  // ====================================
  // REDIRECTS & REWRITES
  // ====================================
  // Note: Most redirects are handled in proxy.ts middleware
  // Add static redirects here if needed

  // ====================================
  // HEADERS (Additional security - proxy.ts has main headers)
  // ====================================
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Cache control for static assets
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          // No cache for API routes
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
