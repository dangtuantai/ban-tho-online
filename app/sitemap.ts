import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllArticles } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/thiet-ke`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/huong-dan`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${baseUrl}/huong-dan/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
