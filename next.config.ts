import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đóng gói gọn để chạy trong container (Fly.io / Docker).
  output: "standalone",
};

export default nextConfig;
