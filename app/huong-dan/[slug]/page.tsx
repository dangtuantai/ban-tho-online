import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticle } from "@/lib/content";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return buildMetadata({ title: "Không tìm thấy bài viết", path: `/huong-dan/${slug}` });
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/huong-dan/${slug}`,
    type: "article",
    publishedTime: article.date,
    keywords: article.keywords,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          slug: article.slug,
          date: article.date,
        })}
      />

      <nav className="mb-4 text-sm text-foreground/60">
        <Link href="/" className="hover:text-primary">Trang chủ</Link> /{" "}
        <Link href="/huong-dan" className="hover:text-primary">Hướng dẫn</Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-primary">{article.title}</h1>
      <p className="mt-2 text-foreground/70">{article.description}</p>

      <AdSlot label="Quảng cáo" className="my-6 w-full" minHeight={120} />

      <div className="article-body mt-6">
        <MDXRemote source={article.content} />
      </div>

      <AdSlot label="Quảng cáo" className="my-8 w-full" minHeight={250} />

      <div className="mt-8 rounded-xl border border-border bg-primary/95 p-6 text-center text-primary-foreground">
        <h2 className="font-serif text-xl font-bold">Tự tay lập bàn thờ của bạn</h2>
        <p className="mt-1 text-sm text-primary-foreground/85">
          Áp dụng ngay những gì vừa đọc với công cụ kéo–thả miễn phí.
        </p>
        <Link
          href="/thiet-ke"
          className="mt-4 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-primary hover:bg-amber-50"
        >
          Lập bàn thờ online →
        </Link>
      </div>
    </article>
  );
}
