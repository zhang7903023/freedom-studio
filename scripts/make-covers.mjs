// 生成 5 张 1200x675 (16:9) 极简封面图（一次性脚本）
// 设计：浅灰底 + 科技蓝几何构图，与站点视觉一致；不放文字
import sharp from "sharp";

const W = 1200;
const H = 675;
const BG = "#f5f5f7";
const BLUE = "#0071e3";
const BLUE_SOFT = "#cfe3f9";
const INK = "#1d1d1f";

const covers = {
  "cover-why-blog.svg": `
  <circle cx="600" cy="338" r="150" fill="none" stroke="${BLUE}" stroke-width="10"/>
  <circle cx="600" cy="338" r="60" fill="${BLUE}"/>
  <line x1="600" y1="80" x2="600" y2="188" stroke="${INK}" stroke-width="6"/>
  <line x1="600" y1="488" x2="600" y2="596" stroke="${INK}" stroke-width="6"/>
  <line x1="342" y1="338" x2="450" y2="338" stroke="${INK}" stroke-width="6"/>
  <line x1="750" y1="338" x2="858" y2="338" stroke="${INK}" stroke-width="6"/>`,

  "cover-ai-website.svg": `
  <rect x="300" y="200" width="600" height="375" rx="24" fill="none" stroke="${INK}" stroke-width="8"/>
  <line x1="300" y1="270" x2="900" y2="270" stroke="${INK}" stroke-width="8"/>
  <circle cx="350" cy="235" r="12" fill="${BLUE}"/>
  <circle cx="395" cy="235" r="12" fill="${BLUE_SOFT}"/>
  <path d="M 360 340 L 430 410 L 360 480" stroke="${BLUE}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="490" y1="480" x2="640" y2="480" stroke="${BLUE}" stroke-width="16" stroke-linecap="round"/>`,

  "cover-codex-pitfalls.svg": `
  <path d="M 340 420 L 500 220 L 700 460 L 860 260" stroke="${BLUE}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="500" cy="220" r="22" fill="${BG}" stroke="${INK}" stroke-width="8"/>
  <circle cx="700" cy="460" r="22" fill="${BG}" stroke="${INK}" stroke-width="8"/>
  <line x1="300" y1="520" x2="900" y2="520" stroke="${BLUE_SOFT}" stroke-width="12" stroke-linecap="round"/>`,

  "cover-github-pages.svg": `
  <rect x="380" y="180" width="440" height="315" rx="24" fill="${BLUE_SOFT}"/>
  <path d="M 560 340 a 40 40 0 0 1 80 0 a 40 40 0 0 1 -80 0 M 600 300 v -60 M 640 380 v 40" stroke="${BLUE}" stroke-width="14" stroke-linecap="round" fill="none"/>
  <line x1="380" y1="540" x2="820" y2="540" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,

  "cover-own-site.svg": `
  <circle cx="600" cy="300" r="120" fill="${BLUE}"/>
  <path d="M 600 180 A 120 120 0 0 1 600 420" fill="#ffffff" opacity="0.35"/>
  <line x1="600" y1="60" x2="600" y2="120" stroke="${INK}" stroke-width="6"/>
  <line x1="600" y1="480" x2="600" y2="540" stroke="${INK}" stroke-width="6"/>
  <line x1="360" y1="300" x2="420" y2="300" stroke="${INK}" stroke-width="6"/>
  <line x1="780" y1="300" x2="840" y2="300" stroke="${INK}" stroke-width="6"/>`,
};

for (const [name, body] of Object.entries(covers)) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="8" fill="${BLUE}"/>
  ${body}
</svg>`;
  const out = `src/assets/covers/${name.replace(".svg", ".png")}`;
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log("generated", out);
}
