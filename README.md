# Bàn Thờ Online

Web **lập bàn thờ tưởng niệm online**: người dùng kéo–thả vật phẩm thờ cúng, tải ảnh người thân làm ảnh thờ, nhận gợi ý bài trí chuẩn phong tục — kèm hệ thống nội dung chuẩn SEO để kéo traffic (hướng tới kiếm tiền qua quảng cáo).

## Tính năng

- 🖐️ **Công cụ kéo–thả** (Konva): thêm/di chuyển/xoay/phóng to/xoá vật phẩm, đổi nền bàn thờ.
- 🖼️ **Ảnh thờ**: tải ảnh người thân, tự lồng khung + tên + năm sinh/mất.
- 🧭 **Gợi ý phong tục**: Nam tả – Nữ hữu, vị trí bát hương, Đông bình – Tây quả.
- 💾 **Lưu / Tải PNG / Chia sẻ link** (lưu trên trình duyệt; chia sẻ qua URL).
- 🔎 **SEO**: metadata + canonical, Open Graph động, JSON-LD (Organization/Article/WebApplication), `sitemap.xml`, `robots.txt`, bài viết MDX.
- 💰 **Ad-ready**: ô `AdSlot` reserve sẵn (không gây CLS) + chỗ nhúng AdSense/GA4 qua biến môi trường.

## Công nghệ

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · react-konva · Zustand · next-mdx-remote.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Cấu hình (tuỳ chọn)

Tạo `.env.local` từ `.env.example`:

| Biến | Ý nghĩa |
|------|---------|
| `NEXT_PUBLIC_SITE_URL` | Domain thật (canonical, sitemap, OG) |
| `NEXT_PUBLIC_ADSENSE_ID` | Bật Google AdSense (`ca-pub-...`) |
| `NEXT_PUBLIC_GA_ID` | Bật Google Analytics 4 (`G-...`) |

Khi để trống AdSense/GA, site vẫn chạy bình thường; ô quảng cáo chỉ là placeholder.

## Cấu trúc

```
app/                 # routes (landing, /thiet-ke, /huong-dan, sitemap, robots, og image)
components/editor/   # AltarEditor (Konva), thư viện, khung ảnh, toolbar, gợi ý
components/marketing # Header, Footer
components/ads/      # AdSlot
lib/                 # site, seo, store (zustand), altarConfig, fengshui, content, types
content/huong-dan/   # bài viết SEO (.mdx)
```

## Thêm bài viết mới (SEO)

Tạo file `content/huong-dan/<slug>.mdx` với frontmatter `title`, `description`, `date`, `keywords`. Bài sẽ tự xuất hiện ở `/huong-dan`, có trang riêng, JSON-LD và vào `sitemap.xml`.

## Hướng mở rộng

- Tài khoản người dùng + lưu thiết kế lên DB (Prisma/Postgres), upload ảnh lên object storage.
- Trang tưởng niệm công khai có URL riêng (tốt cho SEO + chia sẻ).
- Chế độ thương mại (giỏ hàng, đặt mua bàn thờ/vật phẩm) — đã chừa sẵn `app/api/`.

> Lưu ý: artwork bàn thờ/vật phẩm hiện dùng emoji/màu làm placeholder — thay bằng hình minh hoạ thật để hoàn thiện giao diện.
