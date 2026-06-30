import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Ảnh OG động dùng chung cho toàn site (hiển thị khi chia sẻ link).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6b1d12 0%, #2a0c06 100%)",
          color: "#fff7ed",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 120 }}>🪔</div>
        <div style={{ marginTop: 24 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 12, fontSize: 34, color: "#f5d59b", fontWeight: 400 }}>
          Lập bàn thờ tưởng niệm online
        </div>
      </div>
    ),
    size,
  );
}
