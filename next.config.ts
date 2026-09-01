import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  experimental: {
    // Photos up to 8 MB plus multipart overhead. Default Server Action limit is 1 MB.
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // proxy.ts clones POST bodies; keep this at least as large as the action limit.
    proxyClientMaxBodySize: "10mb",
  },
};

export default nextConfig;
