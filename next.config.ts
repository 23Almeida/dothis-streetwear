import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/thumbnail**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/uc**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "**.ibb.co" },
    ],
  },
};

export default nextConfig;
