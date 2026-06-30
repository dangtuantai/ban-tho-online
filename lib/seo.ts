import type { Metadata } from "next";
import { siteConfig } from "./site";

const baseUrl = siteConfig.url.replace(/\/$/, "");

/** Tạo absolute URL từ path tương đối (cho canonical/OG). */
export function absoluteUrl(path = "/"): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${baseUrl}${path}`;
}

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  /** Ảnh OG tuỳ biến. Bỏ trống -> dùng ảnh OG động từ app/opengraph-image.tsx. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

/** Helper tạo Metadata nhất quán cho mọi trang (title, canonical, OG, Twitter). */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : undefined;

  return {
    title,
    description,
    keywords: keywords ?? siteConfig.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      // Khi không truyền image, để trống để Next dùng file opengraph-image.tsx.
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/** JSON-LD: tổ chức (đặt ở layout gốc). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: baseUrl,
    description: siteConfig.description,
    logo: absoluteUrl("/icon.png"),
  };
}

/** JSON-LD: ứng dụng web (trang công cụ thiết kế). */
export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${siteConfig.name} – Công cụ lập bàn thờ`,
    url: absoluteUrl("/thiet-ke"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
    description:
      "Công cụ kéo–thả lập bàn thờ tưởng niệm online, tải ảnh người thân làm ảnh thờ.",
  };
}

/** JSON-LD: bài viết + breadcrumb cho trang hướng dẫn. */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  const url = absoluteUrl(`/huong-dan/${opts.slug}`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: opts.title,
      description: opts.description,
      datePublished: opts.date,
      dateModified: opts.date,
      author: { "@type": "Organization", name: siteConfig.author },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
      },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hướng dẫn",
          item: absoluteUrl("/huong-dan"),
        },
        { "@type": "ListItem", position: 3, name: opts.title, item: url },
      ],
    },
  ];
}
