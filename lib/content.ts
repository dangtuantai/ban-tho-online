import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "huong-dan");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  keywords?: string[];
  cover?: string;
};

export type Article = ArticleMeta & { content: string };

/** Danh sách bài viết (chỉ frontmatter), sắp xếp mới nhất trước. */
export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "2026-01-01",
        keywords: data.keywords ?? [],
        cover: data.cover ?? "",
      } satisfies ArticleMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Một bài viết kèm nội dung MDX, hoặc null nếu không tồn tại. */
export function getArticle(slug: string): Article | null {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(CONTENT_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "2026-01-01",
        keywords: data.keywords ?? [],
        cover: data.cover ?? "",
        content,
      };
    }
  }
  return null;
}
