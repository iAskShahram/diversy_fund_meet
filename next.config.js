/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "png.pngtree.com",
        pathname: "/**",
        protocol: "https",
        port: "",
      },
      {
        hostname: "board-portal-2024.s3.us-west-1.amazonaws.com",
        pathname: "/**",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default config;
