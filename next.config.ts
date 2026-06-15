import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't pick a stray
  // parent-directory lockfile (multiple pnpm-lock.yaml files were detected).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
