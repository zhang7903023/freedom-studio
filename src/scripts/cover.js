/**
 * Small, dependency-free article-cover editor.  The module deliberately only
 * accepts local image data URLs so drawing an upload can never taint the canvas.
 */
const WIDTH = 1200;
const HEIGHT = 900;
const DEFAULT_STATE = Object.freeze({
  title: "把真实的经历，写成值得收藏的内容。",
  subtitle: "自由行Studio",
  color: "#657553",
  layout: "editorial",
  image: "",
});
const IMAGE_DATA_URL = /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=\s]+$/i;

function text(value, limit) {
  return typeof value === "string" ? value.slice(0, limit) : "";
}

function colour(value) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value : DEFAULT_STATE.color;
}

function imageData(value) {
  return typeof value === "string" && value.length <= 12 * 1024 * 1024 && IMAGE_DATA_URL.test(value)
    ? value.replace(/\s/g, "")
    : "";
}

function normalise(value) {
  const next = value && typeof value === "object" ? value : {};
  return {
    title: text(next.title ?? DEFAULT_STATE.title, 180),
    subtitle: text(next.subtitle ?? DEFAULT_STATE.subtitle, 100),
    color: colour(next.color),
    layout: ["editorial", "photo", "minimal"].includes(next.layout) ? next.layout : DEFAULT_STATE.layout,
    image: imageData(next.image),
  };
}

function copy(state) {
  return { ...state };
}

function rgba(hex, alpha) {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawCoverImage(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  ctx.drawImage(
    image,
    (image.naturalWidth - sourceWidth) / 2,
    (image.naturalHeight - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function wrapLines(ctx, value, maxWidth, maxLines) {
  const result = [];
  let line = "";
  for (const paragraph of value.replace(/\r/g, "").split("\n")) {
    for (const character of Array.from(paragraph || " ")) {
      const candidate = line + character;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        result.push(line.trimEnd());
        line = character.trimStart();
        if (result.length === maxLines) return result;
      } else {
        line = candidate;
      }
    }
    if (line || !result.length) result.push(line.trimEnd());
    line = "";
    if (result.length === maxLines) return result;
  }
  return result.slice(0, maxLines);
}

function drawLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

function drawEditorial(ctx, state, image) {
  ctx.fillStyle = "#f7f5f0";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = state.color;
  ctx.fillRect(0, 0, 28, HEIGHT);
  ctx.fillStyle = rgba(state.color, 0.11);
  ctx.fillRect(772, 0, 428, HEIGHT);
  ctx.fillStyle = state.color;
  ctx.font = "600 25px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillText("FIELD NOTES / 2026", 96, 110);
  ctx.fillStyle = "#101114";
  ctx.font = "700 86px -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const lines = wrapLines(ctx, state.title || "未命名文章", 615, 4);
  drawLines(ctx, lines, 92, 270, 110);
  ctx.fillStyle = "#535761";
  ctx.font = "400 31px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  const subtitleY = 315 + lines.length * 110;
  drawLines(ctx, wrapLines(ctx, state.subtitle, 560, 2), 96, subtitleY, 43);
  ctx.fillStyle = "#101114";
  ctx.fillRect(96, 725, 620, 2);
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillText("ZIYOUXING.STUDIO", 96, 783);
  if (image) {
    ctx.save();
    roundedRect(ctx, 790, 100, 330, 610, 18);
    ctx.clip();
    drawCoverImage(ctx, image, 790, 100, 330, 610);
    ctx.restore();
  } else {
    ctx.fillStyle = rgba(state.color, 0.92);
    ctx.beginPath();
    ctx.arc(954, 349, 164, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7f5f0";
    ctx.font = "700 136px Georgia, 'Songti SC', serif";
    ctx.fillText("写", 878, 402);
  }
}

function drawPhoto(ctx, state, image) {
  ctx.fillStyle = "#131720";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (image) drawCoverImage(ctx, image, 0, 0, WIDTH, HEIGHT);
  const shade = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  shade.addColorStop(0, rgba("#10131b", image ? 0.22 : 0.05));
  shade.addColorStop(0.48, rgba("#10131b", image ? 0.12 : 0.33));
  shade.addColorStop(1, rgba("#10131b", 0.92));
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = state.color;
  ctx.fillRect(72, 84, 120, 10);
  ctx.font = "600 23px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.fillText("自由行Studio · 实践笔记", 72, 145);
  ctx.font = "700 88px -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillStyle = "#ffffff";
  const lines = wrapLines(ctx, state.title || "未命名文章", 960, 4);
  drawLines(ctx, lines, 72, 535 - (lines.length - 1) * 92, 108);
  ctx.font = "400 30px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.82)";
  drawLines(ctx, wrapLines(ctx, state.subtitle, 840, 2), 76, 700, 42);
  ctx.fillStyle = "rgba(255,255,255,.84)";
  ctx.fillRect(72, 788, 1056, 1);
  ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillText("ZIYOUXING.STUDIO", 72, 838);
  ctx.textAlign = "right";
  ctx.fillText("READ · MAKE · SHARE", 1128, 838);
  ctx.textAlign = "left";
}

function drawMinimal(ctx, state, image) {
  ctx.fillStyle = "#fcfcfa";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = rgba(state.color, 0.1);
  ctx.beginPath();
  ctx.arc(1052, 164, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(state.color, 0.07);
  ctx.beginPath();
  ctx.arc(142, 810, 225, 0, Math.PI * 2);
  ctx.fill();
  if (image) {
    ctx.save();
    roundedRect(ctx, 804, 177, 270, 420, 135);
    ctx.clip();
    drawCoverImage(ctx, image, 804, 177, 270, 420);
    ctx.restore();
  } else {
    ctx.strokeStyle = state.color;
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(940, 385, 164, 0.25, Math.PI * 1.82);
    ctx.stroke();
    ctx.fillStyle = rgba(state.color, 0.22);
    ctx.beginPath();
    ctx.arc(940, 385, 91, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = state.color;
  ctx.font = "600 25px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillText("自由行Studio / 保存每一段路", 105, 132);
  ctx.fillStyle = "#15161a";
  ctx.font = "700 84px -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const lines = wrapLines(ctx, state.title || "未命名文章", 650, 4);
  drawLines(ctx, lines, 100, 290, 107);
  ctx.fillStyle = "#60636b";
  ctx.font = "400 30px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  drawLines(ctx, wrapLines(ctx, state.subtitle, 590, 2), 105, 340 + lines.length * 108, 42);
  ctx.fillStyle = state.color;
  ctx.fillRect(105, 735, 75, 8);
  ctx.font = "500 21px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
  ctx.fillText("ZIYOUXING.STUDIO", 105, 797);
}

function canvasStyle(canvas) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.setAttribute("aria-label", "文章封面预览，尺寸 1200 × 900");
  canvas.style.cssText = "display:block;width:100%;height:auto;border-radius:6px;background:#f7f7f7;touch-action:manipulation;";
}

function makeField(doc, label, control) {
  const wrapper = doc.createElement("label");
  wrapper.className = "field studio-cover-field";
  const title = doc.createElement("span");
  title.textContent = label;
  wrapper.append(title, control);
  return wrapper;
}

/** Mount an editable cover into host. */
export function mountCover(host, { onChange } = {}) {
  if (!host || typeof host.append !== "function") throw new TypeError("mountCover requires a host element");
  const doc = host.ownerDocument || document;
  const root = doc.createElement("section");
  root.className = "studio-cover";
  const canvas = doc.createElement("canvas");
  canvasStyle(canvas);
  const ctx = canvas.getContext("2d");
  const panel = doc.createElement("div");
  panel.className = "studio-cover-controls";
  const titleInput = doc.createElement("textarea");
  titleInput.rows = 3;
  titleInput.maxLength = 180;
  titleInput.placeholder = "文章标题";
  const subtitleInput = doc.createElement("input");
  subtitleInput.type = "text";
  subtitleInput.maxLength = 100;
  subtitleInput.placeholder = "副标题或署名";
  const colorInput = doc.createElement("input");
  colorInput.type = "color";
  const layoutSelect = doc.createElement("select");
  [["editorial", "编辑排版"], ["photo", "摄影标题"], ["minimal", "极简留白"]].forEach(([value, label]) => {
    const option = doc.createElement("option");
    option.value = value;
    option.textContent = label;
    layoutSelect.append(option);
  });
  const imageInput = doc.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/jpeg,image/png,image/webp";
  const exportButton = doc.createElement("button");
  exportButton.type = "button";
  exportButton.className = "button studio-cover-export";
  exportButton.textContent = "导出 PNG";
  const status = doc.createElement("p");
  status.className = "studio-cover-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  panel.append(
    makeField(doc, "标题", titleInput),
    makeField(doc, "副标题", subtitleInput),
    makeField(doc, "主色", colorInput),
    makeField(doc, "版式", layoutSelect),
    makeField(doc, "替换封面照片", imageInput),
    exportButton,
    status,
  );
  root.append(canvas, panel);
  host.replaceChildren(root);

  let state = copy(DEFAULT_STATE);
  let loadedImage = null;
  let imageToken = 0;
  function setStatus(message) {
    status.textContent = message || "";
    status.hidden = !message;
  }
  function updateInputs() {
    titleInput.value = state.title;
    subtitleInput.value = state.subtitle;
    colorInput.value = state.color;
    layoutSelect.value = state.layout;
  }
  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (state.layout === "photo") drawPhoto(ctx, state, loadedImage);
    else if (state.layout === "minimal") drawMinimal(ctx, state, loadedImage);
    else drawEditorial(ctx, state, loadedImage);
  }
  function loadStateImage() {
    const token = ++imageToken;
    if (!state.image) {
      loadedImage = null;
      render();
      return;
    }
    const image = new Image();
    image.onload = () => {
      if (token !== imageToken) return;
      loadedImage = image;
      setStatus("");
      render();
    };
    image.onerror = () => {
      if (token !== imageToken) return;
      loadedImage = null;
      setStatus("图片无法读取，请选择 JPEG、PNG 或 WebP 文件。");
      render();
    };
    image.src = state.image;
  }
  function edit(patch) {
    state = normalise({ ...state, ...patch });
    updateInputs();
    if (Object.prototype.hasOwnProperty.call(patch, "image")) loadStateImage();
    else render();
    if (typeof onChange === "function") onChange(copy(state));
  }
  function compress(file) {
    if (file?.size > 30 * 1024 * 1024) { setStatus("请选择小于 30 MB 的照片。"); return; }
    if (!file || !/^image\/(?:jpeg|png|webp)$/.test(file.type)) {
      setStatus("请选择 JPEG、PNG 或 WebP 图片。");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setStatus("读取图片失败，请重试。");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setStatus("图片无法解码，请换一张图片。");
      image.onload = () => {
        const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
        const scale = Math.min(1, 1400 / maxSide);
        const surface = doc.createElement("canvas");
        surface.width = Math.max(1, Math.round(image.naturalWidth * scale));
        surface.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const surfaceCtx = surface.getContext("2d");
        surfaceCtx.fillStyle = "#ffffff";
        surfaceCtx.fillRect(0, 0, surface.width, surface.height);
        surfaceCtx.drawImage(image, 0, 0, surface.width, surface.height);
        edit({ image: surface.toDataURL("image/jpeg", 0.86) });
      };
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  }
  function exportPng() {
    render();
    return canvas.toDataURL("image/png");
  }

  titleInput.addEventListener("input", () => edit({ title: titleInput.value }));
  subtitleInput.addEventListener("input", () => edit({ subtitle: subtitleInput.value }));
  colorInput.addEventListener("input", () => edit({ color: colorInput.value }));
  layoutSelect.addEventListener("change", () => edit({ layout: layoutSelect.value }));
  imageInput.addEventListener("change", () => compress(imageInput.files && imageInput.files[0]));
  exportButton.addEventListener("click", () => {
    const link = doc.createElement("a");
    link.href = exportPng();
    link.download = "ziyouxing-studio-cover.png";
    link.click();
  });

  updateInputs();
  setStatus("");
  render();
  return {
    setState(nextState) {
      state = normalise({ ...state, ...(nextState && typeof nextState === "object" ? nextState : {}) });
      updateInputs();
      loadStateImage();
    },
    getState() {
      return copy(state);
    },
    exportPng,
  };
}

export default mountCover;
