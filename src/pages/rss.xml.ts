import rss from "@astrojs/rss";
import { getPublishedPosts } from "../utils/posts";
import { SITE } from "../config";

export async function GET(context: any) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: "<language>zh-cn</language>",
    // 浏览器直接打开 rss.xml 时套用这份可读样式（RSS 阅读器不受影响）
    stylesheet: "/rss.xsl",
  });
}
