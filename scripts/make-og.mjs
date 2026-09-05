// 生成 1200x630 的 OG 分享图（一次性脚本）
import sharp from "sharp";

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f5f5f7"/>
  <rect x="0" y="0" width="1200" height="8" fill="#0071e3"/>
  <text x="120" y="300" font-family="-apple-system, PingFang SC, Helvetica Neue, sans-serif" font-size="96" font-weight="700" fill="#1d1d1f">自由行Studio</text>
  <text x="122" y="380" font-family="-apple-system, PingFang SC, Helvetica Neue, sans-serif" font-size="40" fill="#6e6e73">AI、互联网工具与实战经验</text>
  <circle cx="1010" cy="180" r="120" fill="#0071e3"/>
  <path d="M 950 180 L 1010 245 L 1070 180" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("og.png generated");
