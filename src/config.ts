/**
 * 站点统一配置文件
 * 可编辑内容（站名/关于/联系/社交/服务）已抽到 src/data/site.json，
 * 在 z8en.com/admin 后台「站点设置」里改即可，无需碰代码。
 * 域名、语言等技术固定项仍在这里维护。
 */
import siteData from "./data/site.json";

const data = siteData as {
  site: {
    name: string;
    navName: string;
    heroTitle: string;
    tagline: string;
    description: string;
    title: string;
    homeDescription: string;
  };
  about: { intro: string; emphasis: string };
  contact: Record<string, string>;
  social: Record<string, string>;
  services: { title: string; description: string; scope: string }[];
};

export const SITE = {
  /** 站点名称（仅用于浏览器 title / OG / JSON-LD 等给搜索引擎看的位置） */
  name: data.site.name,
  /** 英文名（必要位置使用） */
  nameEn: "Ziyouxing Studio",
  /** 顶栏导航 Logo 只显示这几个字 */
  navName: data.site.navName,
  /** 首页 Hero 大标题（不要放站名） */
  heroTitle: data.site.heroTitle,
  /** 副标题 */
  tagline: data.site.tagline,
  /** 首页简介 */
  description: data.site.description,
  /** 部署域名，末尾不带斜杠 */
  url: "https://z8en.com",
  /** 首页 title（SEO） */
  title: data.site.title,
  /** 首页 description（SEO） */
  homeDescription: data.site.homeDescription,
  /** 默认 OG 图片路径（放 public/ 下） */
  ogImage: "/og.png",
  /** 语言 */
  locale: "zh-CN",
};

export const ABOUT = {
  title: "关于",
  intro: data.about.intro,
  emphasis: data.about.emphasis,
};

/** 联系方式：暂时为空字符串的项不会在页面上显示，后台「站点设置」里填即可 */
export interface ContactInfo {
  email: string;
  wechat: string;
  telegram: string;
  whatsapp: string;
  x: string;
  youtube: string;
}

export const CONTACT: ContactInfo = {
  email: data.contact.email ?? "",
  wechat: data.contact.wechat ?? "",
  telegram: data.contact.telegram ?? "",
  whatsapp: data.contact.whatsapp ?? "",
  x: data.contact.x ?? "",
  youtube: data.contact.youtube ?? "",
};

/** 社交链接（页脚等位置），为空则不显示 */
export interface SocialLinks {
  x: string;
  youtube: string;
  telegram: string;
}

export const SOCIAL: SocialLinks = {
  x: data.social.x ?? "",
  youtube: data.social.youtube ?? "",
  telegram: data.social.telegram ?? "",
};

/** 内容分类（key 为 URL slug，不要用中文改 key，只改 label） */
export const CATEGORIES: { key: string; label: string; description: string }[] = [
  { key: "ai", label: "AI 实战", description: "AI 工具的真实使用与落地" },
  { key: "website-seo", label: "网站与 SEO", description: "建站、SEO 与 GEO 实践" },
  { key: "overseas-tools", label: "海外工具", description: "海外互联网工具的使用与折腾" },
  { key: "gadgets", label: "数码折腾", description: "数码设备与软件的折腾记录" },
  { key: "startup", label: "创业笔记", description: "个人创业过程中的真实记录" },
];

/** 文章 frontmatter 的 category 值 -> 分类 slug 映射 */
export const CATEGORY_LABEL_TO_KEY: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.label, c.key]),
);

export const SERVICES = data.services;

/** 导航六项（联系页为空状态时也保留入口） */
export const NAV = [
  { text: "首页", href: "/" },
  { text: "博客", href: "/blog/" },
  { text: "分类", href: "/categories/" },
  { text: "关于", href: "/about/" },
  { text: "服务", href: "/services/" },
  { text: "联系", href: "/contact/" },
];
