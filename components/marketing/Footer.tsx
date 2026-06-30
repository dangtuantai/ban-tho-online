import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = 2026; // tránh dùng Date runtime; cập nhật khi cần
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-primary">
            <span aria-hidden>🪔</span> {siteConfig.name}
          </div>
          <p className="mt-2 text-sm text-foreground/70">{siteConfig.description}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Khám phá
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/thiet-ke" className="hover:text-primary">Lập bàn thờ online</Link></li>
            <li><Link href="/huong-dan" className="hover:text-primary">Hướng dẫn thờ cúng</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Về chúng tôi
          </h3>
          <p className="text-sm text-foreground/70">
            Nền tảng giúp bạn lập bàn thờ tưởng niệm và tìm hiểu văn hóa thờ cúng Việt Nam.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-foreground/50">
        © {year} {siteConfig.name}. Mọi nội dung chỉ mang tính tham khảo văn hóa, tín ngưỡng.
      </div>
    </footer>
  );
}
