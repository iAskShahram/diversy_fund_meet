/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ['png.pngtree.com', 'board-portal-2024.s3.us-west-1.amazonaws.com'],
  },
};

export default config;
