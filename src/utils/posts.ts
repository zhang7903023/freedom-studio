import { getCollection, type CollectionEntry } from "astro:content";
import { CATEGORY_LABEL_TO_KEY } from "../config";

export type Post = CollectionEntry<"blog">;

/** 获取所有已发布文章，按发布时间倒序 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

/** 阅读时间（中文按字数、英文按词数估算） */
export function readingTime(post: Post): string {
  const body = post.body ?? "";
  // 去掉代码块与 markdown 标记，粗略估算
  const plain = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-\n\s]/g, "");
  const cjkChars = (plain.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  const latinWords = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;
  const minutes = Math.max(1, Math.round(cjkChars / 400 + latinWords / 200));
  return `${minutes} 分钟`;
}

/** 按中国时区格式化日期（CI 是 UTC 时也不会差一天） */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** 文章分类 -> 分类页 URL */
export function categoryUrl(label: string): string {
  const key = CATEGORY_LABEL_TO_KEY[label];
  return key ? `/category/${key}/` : "/categories/";
}

/** 取某分类下的文章 */
export function postsInCategory(posts: Post[], label: string): Post[] {
  return posts.filter((p) => p.data.category === label);
}

/** 取某标签下的文章 */
export function postsWithTag(posts: Post[], tag: string): Post[] {
  return posts.filter((p) =>
    p.data.tags.some((t) => tagSlug(t) === tagSlug(tag)),
  );
}

/** 标签 URL slug（小写、空格转连字符） */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, "-");
}

/** 所有标签及文章数，按数量倒序 */
export function allTags(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** 相关文章：同分类优先，其次按标签重合度 */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const candidates = all.filter((p) => p.id !== post.id);
  const score = (p: Post) => {
    let s = 0;
    if (p.data.category === post.data.category) s += 10;
    s += p.data.tags.filter((t) => post.data.tags.includes(t)).length * 2;
    // 略微偏向时间接近的文章
    s -= Math.abs(p.data.publishDate.valueOf() - post.data.publishDate.valueOf()) / 1e12;
    return s;
  };
  return candidates.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** 相邻文章（上一篇 / 下一篇，按时间倒序的列表） */
export function adjacentPosts(post: Post, all: Post[]) {
  const idx = all.findIndex((p) => p.id === post.id);
  return {
    newer: idx > 0 ? all[idx - 1] : undefined,
    older: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined,
  };
}
