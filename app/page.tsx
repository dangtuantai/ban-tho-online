import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/content";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Lập bàn thờ tưởng niệm online miễn phí",
  description:
    "Tự tay lập bàn thờ tưởng niệm online: kéo–thả vật phẩm thờ cúng, tải ảnh người thân làm ảnh thờ, bố trí chuẩn phong thủy. Miễn phí, lưu ngay trên trình duyệt.",
  path: "/",
});

const features = [
  {
    icon: "🖐️",
    title: "Kéo – thả trực quan",
    desc: "Sắp xếp bát hương, đèn, hoa, mâm quả… chỉ bằng thao tác kéo–thả đơn giản.",
  },
  {
    icon: "🖼️",
    title: "Ảnh thờ người thân",
    desc: "Tải ảnh người thân lên, tự động lồng vào khung ảnh thờ kèm tên và năm.",
  },
  {
    icon: "🧭",
    title: "Gợi ý chuẩn phong tục",
    desc: "Nhắc bố trí theo Nam tả – Nữ hữu, vị trí bát hương, Đông bình – Tây quả.",
  },
  {
    icon: "💾",
    title: "Lưu & chia sẻ",
    desc: "Lưu thiết kế trên trình duyệt, tải ảnh PNG hoặc chia sẻ qua liên kết.",
  },
];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-3xl font-bold leading-tight text-primary sm:text-5xl">
            Lập bàn thờ tưởng niệm online
          </h1>
          <p className="mt-4 text-lg text-foreground/75">
            Tự tay bài trí một bàn thờ trang nghiêm để tưởng nhớ người thân —
            kéo–thả vật phẩm, tải ảnh thờ, nhận gợi ý chuẩn phong tục. Hoàn toàn
            miễn phí.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/thiet-ke"
              className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              🪔 Bắt đầu lập bàn thờ
            </Link>
            <Link
              href="/huong-dan"
              className="rounded-lg border border-border bg-white px-6 py-3 text-base font-semibold text-foreground hover:bg-muted"
            >
              Xem hướng dẫn
            </Link>
          </div>
        </div>
        <div
          className="relative flex items-center justify-center rounded-2xl border border-border p-8 text-center shadow-lg"
          style={{ background: "linear-gradient(to bottom, #6b1d12, #411008)" }}
        >
          <div className="text-7xl leading-relaxed">
            🖼️ 🖼️
            <div className="mt-2">🌺 🕯️ 🏺 🕯️ 🍎</div>
            <div className="mt-4 text-base text-amber-100/80">
              Bàn thờ của bạn sẽ hiện ở đây
            </div>
          </div>
        </div>
      </section>

      {/* Tính năng */}
      <section className="py-8">
        <h2 className="mb-6 text-center font-serif text-2xl font-bold text-foreground">
          Vì sao chọn <span className="text-primary">Bàn Thờ Online</span>?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-white/60 p-5 text-center"
            >
              <div className="text-4xl" aria-hidden>
                {f.icon}
              </div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quảng cáo (reserve chỗ, bật khi cấu hình AdSense) */}
      <AdSlot label="Quảng cáo" className="my-8 w-full" minHeight={120} />

      {/* Bài viết mới */}
      {articles.length > 0 && (
        <section className="py-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Hướng dẫn thờ cúng
            </h2>
            <Link href="/huong-dan" className="text-sm font-medium text-primary hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/huong-dan/${a.slug}`}
                className="group rounded-xl border border-border bg-white/60 p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
                  {a.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="my-12 rounded-2xl bg-primary/95 px-6 py-10 text-center text-primary-foreground">
        <h2 className="font-serif text-2xl font-bold">Sẵn sàng tưởng nhớ người thân?</h2>
        <p className="mx-auto mt-2 max-w-xl text-primary-foreground/85">
          Chỉ vài phút để lập một bàn thờ trang nghiêm, lưu lại và chia sẻ với gia đình.
        </p>
        <Link
          href="/thiet-ke"
          className="mt-5 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary hover:bg-amber-50"
        >
          Lập bàn thờ ngay
        </Link>
      </section>
    </div>
  );
}
