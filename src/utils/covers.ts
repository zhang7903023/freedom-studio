import type { ImageMetadata } from "astro";

// 封面图统一放在 src/assets/covers/ 下，frontmatter 写文件名（如 cover: cover.jpg）
const files = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/covers/*.{jpg,jpeg,png,webp,avif,gif,svg}",
  { eager: true },
);

/** 把 frontmatter 里的文件名解析为可优化的图片资产；无效文件名返回 undefined */
export function resolveCover(name: string | undefined): ImageMetadata | undefined {
  if (!name) return undefined;
  return files[`/src/assets/covers/${name}`]?.default;
}
