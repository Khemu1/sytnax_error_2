/** @type {import('next').NextConfig} */

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

  webpack: (config,) => {
    // Prevent duplicate CKEditor modules
    config.externals = config.externals || {};
    config.externals["@ckeditor/ckeditor5-build-classic"] =
      "@ckeditor/ckeditor5-build-classic";

    return config;
  },
};

export default nextConfig;
