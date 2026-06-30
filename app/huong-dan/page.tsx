import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/content";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Hướng dẫn thờ cúng & bài trí bàn thờ gia tiên",
  description:
    "Tổng hợp hướng dẫn cách bài trí bàn thờ gia tiên, ý nghĩa các vật phẩm thờ cúng, quy tắc Nam tả – Nữ hữu và bố cục bàn thờ tam cấp chuẩn phong thủy.",
  path: "/huong-dan",
});

export default function HuongDanPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">
          Hướng dẫn thờ cúng
        </h1>
        <p className="mt-2 text-foreground/70">
          Kiến thức về cách bài trí bàn thờ gia tiên và ý nghĩa các vật phẩm thờ cúng.
        </p>
      </header>

      <div className="space-y-4">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/huong-dan/${a.slug}`}
            className="group block rounded-xl border border-border bg-white/60 p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
              {a.title}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{a.description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-primary">
              Đọc tiếp →
            </span>
          </Link>
        ))}
      </div>

      <AdSlot label="Quảng cáo" className="mt-10 w-full" minHeight={120} />
    </div>
  );
}
