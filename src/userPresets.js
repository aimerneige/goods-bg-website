// 「我的预设」：保存 / 应用 / 分享当前组合
import LZString from "lz-string";
import { get, set, del } from "idb-keyval";
import { BG_MODES } from "./presets.js";
import { OVERLAYS } from "./overlays.js";

const LIST_KEY = "goods-photo-bg:presets";
const IMG_PREFIX = "goods-photo-bg:preset-img:";
const SHARE_PREFIX = "PGBG1:"; // 分享码前缀，便于识别和以后升级格式

// 预设里保存的字段及合法范围（不含渲染精度——那是设备相关的）
const NUM = {
  bright: [0.2, 1.8], bgSpeed: [0, 3], density: [0.1, 3], speed: [0.1, 3], size: [0.3, 3], pOpacity: [0, 1],
  imgBlur: [0, 30], imgBright: [0.3, 1.5], imgFx: [0, 1],
};
const ENUM = {
  imgFit: ["cover", "contain", "tile"],
  imgBlend: ["screen", "normal", "overlay", "soft-light"],
};
const BOOL = ["imgOn", "imgMotion"];
const isHex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

/** 从 state 中取出需要保存的部分 */
export function snapshot(state) {
  const d = { palette: { ...state.palette }, bg: state.bg, overlays: [...state.overlays] };
  for (const k of [...Object.keys(NUM), ...Object.keys(ENUM), ...BOOL]) d[k] = state[k];
  return d;
}

/** 校验并清洗外部数据（分享码 / 导入文件），返回可安全合并进 state 的对象 */
export function sanitize(raw) {
  if (!raw || typeof raw !== "object") throw new Error("预设数据无效");
  const out = {};
  const p = raw.palette;
  if (p && ["bg", "c1", "c2", "c3"].every((k) => isHex(p[k]))) {
    out.palette = { bg: p.bg, c1: p.c1, c2: p.c2, c3: p.c3 };
  }
  if (typeof raw.bg === "string" && raw.bg in BG_MODES) out.bg = raw.bg;
  if (Array.isArray(raw.overlays)) out.overlays = [...new Set(raw.overlays.filter((o) => typeof o === "string" && o in OVERLAYS))];
  for (const [k, [lo, hi]] of Object.entries(NUM)) {
    const v = Number(raw[k]);
    if (raw[k] != null && Number.isFinite(v)) out[k] = Math.min(hi, Math.max(lo, v));
  }
  for (const [k, vals] of Object.entries(ENUM)) if (vals.includes(raw[k])) out[k] = raw[k];
  for (const k of BOOL) if (typeof raw[k] === "boolean") out[k] = raw[k];
  if (!out.palette && !out.bg && !out.overlays) throw new Error("预设里没有可用的内容");
  return out;
}

// ---------- 分享码 ----------
export function encodeShare(name, data) {
  return SHARE_PREFIX + LZString.compressToEncodedURIComponent(JSON.stringify({ n: name, d: data }));
}

/** 接受分享码或包含 #p=分享码 的链接 */
export function decodeShare(text) {
  let code = String(text || "").trim();
  const m = code.match(/[#&?]p=([^&\s]+)/);
  if (m) code = decodeURIComponent(m[1]);
  if (!code.startsWith(SHARE_PREFIX)) throw new Error("不是有效的分享码");
  const json = LZString.decompressFromEncodedURIComponent(code.slice(SHARE_PREFIX.length));
  if (!json) throw new Error("分享码已损坏");
  const obj = JSON.parse(json);
  return { name: typeof obj.n === "string" ? obj.n.slice(0, 30) : "分享的预设", data: sanitize(obj.d) };
}

export function shareLink(code) {
  if (!/^https?:$/.test(location.protocol)) return null; // 本地文件打开时链接对别人无效
  return `${location.origin}${location.pathname}#p=${encodeURIComponent(code)}`;
}

// ---------- 本地列表 ----------
export function loadList() {
  try {
    const list = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
const saveList = (list) => localStorage.setItem(LIST_KEY, JSON.stringify(list));

export async function addPreset(name, data, imageBlob) {
  const list = loadList();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  let hasImg = false;
  if (imageBlob) {
    try {
      await set(IMG_PREFIX + id, imageBlob);
      hasImg = true;
    } catch (e) {
      console.warn("预设图片保存失败", e);
    }
  }
  list.push({ id, name, data, hasImg, created: Date.now() });
  saveList(list);
  return list;
}

export async function removePreset(id) {
  const list = loadList().filter((p) => p.id !== id);
  saveList(list);
  await del(IMG_PREFIX + id).catch(() => {});
  return list;
}

export function renamePreset(id, name) {
  const list = loadList();
  const p = list.find((x) => x.id === id);
  if (p) p.name = name;
  saveList(list);
  return list;
}

export const loadPresetImage = (id) => get(IMG_PREFIX + id).catch(() => null);

// ---------- 导出 / 导入文件（换设备时用，不含图片） ----------
export function exportJSON() {
  const list = loadList().map(({ name, data }) => ({ name, data }));
  return JSON.stringify({ app: "goods-photo-bg", version: 1, presets: list }, null, 2);
}

export function importJSON(text) {
  const obj = JSON.parse(text);
  const arr = Array.isArray(obj?.presets) ? obj.presets : [];
  const items = [];
  for (const p of arr) {
    try {
      items.push({ name: String(p.name || "导入的预设").slice(0, 30), data: sanitize(p.data) });
    } catch {
      /* 跳过无效项 */
    }
  }
  if (!items.length) throw new Error("文件里没有有效的预设");
  const list = loadList();
  for (const it of items) {
    list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ...it, hasImg: false, created: Date.now() });
  }
  saveList(list);
  return items.length;
}
