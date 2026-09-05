import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.url,
  trailingSlash: "always",
  integrations: [
    sitemap({
      // 分页页不进 sitemap（/blog/ 本身保留，避免与首页/列表页重复内容）
      filter: (page) => {
        const path = new URL(page).pathname;
        return !/^\/blog\/(page\/)?\d+\/$/.test(path);
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
});
