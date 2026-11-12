// 自定义图片背景：IndexedDB 持久化、显示方式、模糊/亮度、缓慢推拉动画、从图片取色
import { get, set, del } from "idb-keyval";
import { getSwatches, getPaletteSync } from "colorthief";

const KEY = "goods-photo-bg:image";

export class ImageBackground {
  constructor(layer) {
    this.layer = layer;
    this.url = null;
    this.blob = null;
  }

  get hasImage() {
    return !!this.url;
  }

  /** 读取上次保存的图片 */
  async restore() {
    try {
      const blob = await get(KEY);
      if (blob instanceof Blob) this._show(blob);
    } catch (e) {
      console.warn("读取已保存图片失败", e);
    }
    return this.hasImage;
  }

  /** 设置新图片（File/Blob），并保存到 IndexedDB */
  async setImage(blob) {
    if (!blob || !blob.type.startsWith("image/")) throw new Error("不是图片文件");
    this._show(blob);
    try {
      await set(KEY, blob);
    } catch (e) {
      console.warn("图片保存失败（可能是隐私模式），本次仍可使用", e);
    }
  }

  async clear() {
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = null;
    this.blob = null;
    this.layer.style.backgroundImage = "";
    this.layer.hidden = true;
    await del(KEY).catch(() => {});
  }

  _show(blob) {
    if (this.url) URL.revokeObjectURL(this.url);
    this.blob = blob;
    this.url = URL.createObjectURL(blob);
    this.layer.style.backgroundImage = `url("${this.url}")`;
    this.layer.hidden = false;
  }

  /** 应用显示参数 */
  apply({ fit, blur, brightness, motion, bgColor, paused }) {
    const s = this.layer.style;
    s.backgroundColor = bgColor;
    s.backgroundRepeat = fit === "tile" ? "repeat" : "no-repeat";
    s.backgroundSize = fit === "cover" ? "cover" : fit === "contain" ? "contain" : "min(40vw, 40vh) auto";
    s.backgroundPosition = "center";
    s.filter = `blur(${blur}px) brightness(${brightness})`;
    // 模糊时放大一点，避免边缘透出底色
    s.setProperty("--pad", blur > 0 ? `${-blur * 2}px` : "0px");
    this.layer.classList.toggle("motion", !!motion);
    s.animationPlayState = paused ? "paused" : "running";
  }

  /** 从当前图片提取配色：{ bg, c1, c2, c3 }（hex） */
  async extractPalette(lightBg) {
    if (!this.url) return null;
    const img = new Image();
    img.src = this.url;
    await img.decode();
    try {
      const sw = await getSwatches(img);
      const hex = (...names) => names.map((n) => sw[n]?.color?.hex()).find(Boolean);
      const c1 = hex("Vibrant", "LightVibrant", "Muted");
      const c2 = hex("LightVibrant", "Muted", "DarkVibrant");
      const c3 = hex("LightMuted", "LightVibrant");
      const bg = lightBg ? hex("LightMuted", "LightVibrant") : hex("DarkMuted", "DarkVibrant");
      if (c1 && c2 && c3 && bg) return { bg, c1, c2, c3 };
    } catch (e) {
      console.warn("getSwatches 失败，改用调色板", e);
    }
    const pal = getPaletteSync(img, { colorCount: 5 }).map((c) => c.hex());
    return pal.length >= 4 ? { bg: pal[0], c1: pal[1], c2: pal[2], c3: pal[3] } : null;
  }
}
