// Cấu hình trung tâm của website. Đổi domain ở NEXT_PUBLIC_SITE_URL khi deploy.
export const siteConfig = {
  name: "Bàn Thờ Online",
  shortName: "Bàn Thờ Online",
  // Dùng cho canonical/OG/sitemap. Đặt biến môi trường khi deploy thật.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://banthoonline.vn",
  description:
    "Lập bàn thờ tưởng niệm online miễn phí: kéo–thả vật phẩm thờ cúng, tải ảnh người thân làm ảnh thờ, bố trí chuẩn phong thủy. Kèm hướng dẫn bài trí bàn thờ gia tiên.",
  locale: "vi_VN",
  keywords: [
    "bàn thờ online",
    "lập bàn thờ online",
    "bàn thờ tưởng niệm",
    "thiết kế bàn thờ",
    "bài trí bàn thờ gia tiên",
    "ảnh thờ online",
    "phong thủy bàn thờ",
  ],
  // ID quảng cáo / phân tích — để trống vẫn build & chạy bình thường.
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  author: "Bàn Thờ Online",
};

export type SiteConfig = typeof siteConfig;
