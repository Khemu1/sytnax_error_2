/** @type {import('next').NextConfig} */
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "**",
      },
    ],
  },

  webpack: (config) => {
    // Prevent duplicate CKEditor modules
    config.externals = config.externals || {};
    config.externals["@ckeditor/ckeditor5-build-classic"] =
      "@ckeditor/ckeditor5-build-classic";

    return config;
  },
};

// Setup Cloudflare's dev platform if in development
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
