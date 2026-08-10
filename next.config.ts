import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    unoptimized: true,
  },

  // Limit concurrent static page generation to prevent OOM on Hostinger shared plan
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  async redirects() {
    return [
      // Google has "new-york" indexed with real search volume (confirmed via
      // GSC: 298 impressions, the single highest of any page on the site) but
      // it was never a real route — the actual slug is "new-york-city". "New
      // York" alone unambiguously means the city (unlike "kansas"/"oklahoma"/
      // "iowa", which collide with their /state/ pages), so this consolidates
      // real indexed signal onto the canonical page instead of 200-ing a
      // "City not found" soft-404.
      {
        source: "/city/new-york",
        destination: "/city/new-york-city",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Static assets — 1 year, immutable
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // All pages — security headers
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
