import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const nextConfig: NextConfig = {
  turbopack: {
    root: repositoryRoot,
  },
  async redirects() {
    return [
      { source: "/icp-interview", destination: "/who-to-sell-to", permanent: true },
    ];
  },
};

export default nextConfig;
