import Link from "next/link";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/thiet-ke", label: "Lập bàn thờ" },
  { href: "/huong-dan", label: "Hướng dẫn" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <span aria-hidden className="text-2xl">🪔</span>
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
