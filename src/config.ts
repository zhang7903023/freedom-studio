/**
 * 站点统一配置文件
 * 修改网站名称、介绍、联系方式、社交账号，只需要改这里。
 */

export const SITE = {
  /** 站点名称（仅用于浏览器 title / OG / JSON-LD 等给搜索引擎看的位置） */
  name: "自由行Studio",
  /** 英文名（必要位置使用） */
  nameEn: "Ziyouxing Studio",
  /** 顶栏导航 Logo 只显示这几个字 */
  navName: "自由行",
  /** 首页 Hero 大标题（不要放站名） */
  heroTitle: "做过的，才写。",
  /** 副标题 */
  tagline: "AI、互联网工具与实战经验",
  /** 首页简介 */
  description:
    "记录 AI、网站、SEO、海外工具、数码设备与个人创业过程中真实踩过的坑和解决方法。",
  /** 部署后改成你自己的域名，末尾不带斜杠。本地开发可保持不变 */
  url: "https://z8en.com",
  /** 首页 title（SEO） */
  title: "自由行Studio｜AI、互联网工具与实战经验",
  /** 首页 description（SEO） */
  homeDescription:
    "自由行Studio 分享 AI、网站建设、SEO、海外互联网工具、数码设备与个人创业中的真实实践、踩坑经验和解决方法。",
  /** 默认 OG 图片路径（放 public/ 下） */
  ogImage: "/og.png",
  /** 语言 */
  locale: "zh-CN",
} as const;

export const ABOUT = {
  title: "关于",
  intro:
    "记录真实的互联网实践：AI 工具、网站建设、SEO、海外互联网工具、数码设备和个人创业。不是教程合集，是用过、错过、解决过之后留下的笔记。",
  emphasis:
    "不是理论教程堆砌，而是真实使用、真实踩坑和真实解决问题的记录。",
} as const;

/** 联系方式：暂时为空字符串的项不会在页面上显示，填上即可 */
export interface ContactInfo {
  email: string;
  wechat: string;
  telegram: string;
  whatsapp: string;
  x: string;
  youtube: string;
}

export const CONTACT: ContactInfo = {
  email: "",
  wechat: "",
  telegram: "",
  whatsapp: "",
  x: "",
  youtube: "",
};

/** 社交链接（页脚等位置），为空则不显示 */
export interface SocialLinks {
  x: string;
  youtube: string;
  telegram: string;
}

export const SOCIAL: SocialLinks = {
  x: "",
  youtube: "",
  telegram: "",
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

export const SERVICES = [
  {
    title: "网站搭建",
    description:
      "个人博客、作品集、小型业务网站的搭建与部署，静态优先，注重速度与可维护性。",
    scope: "目前提供：静态网站的搭建与部署上线，不含代运营和长期维护。",
  },
  {
    title: "AI 工具应用",
    description:
      "根据实际需求选择和配置 AI 工具，把 AI 融入写作、开发与日常工作流。",
    scope: "目前提供：工具选型建议与基础配置演示，均为我自己真实用过的方案。",
  },
  {
    title: "SEO / GEO 基础优化",
    description:
      "面向搜索引擎与 AI 搜索的基础优化：结构、元信息、结构化数据、内容架构。",
    scope: "目前提供：基础层面的优化实施，不承诺排名效果。",
  },
  {
    title: "海外互联网工具相关技术支持",
    description:
      "海外常用互联网工具的选型、配置与使用问题排查。",
    scope: "目前提供：以咨询和问题排查为主，复杂项目先沟通评估。",
  },
  {
    title: "设备和软件相关技术服务",
    description:
      "数码设备与常用软件的使用、配置和故障排查支持。",
    scope: "目前提供：远程协助与经验指导，不涉及硬件维修。",
  },
] as const;

/** 导航六项（联系页为空状态时也保留入口） */
export const NAV = [
  { text: "首页", href: "/" },
  { text: "博客", href: "/blog/" },
  { text: "分类", href: "/categories/" },
  { text: "关于", href: "/about/" },
  { text: "服务", href: "/services/" },
  { text: "联系", href: "/contact/" },
];
