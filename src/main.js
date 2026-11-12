import { ShaderBackground } from "./shaderBg.js";
import { OVERLAYS, createOverlay, initEngine } from "./overlays.js";
import { PALETTES, BG_MODES, SCENES } from "./presets.js";
import { ImageBackground } from "./imageBg.js";
import * as UP from "./userPresets.js";

const $ = (s) => document.querySelector(s);
const STORE_KEY = "goods-photo-bg:v1";

const DEFAULT = {
  scene: 0,
  palette: { ...PALETTES[1] },
  paletteName: PALETTES[1].name,
  bg: "nebula",
  overlays: ["stars", "meteors", "sparkle"],
  bright: 1,
  bgSpeed: 1,
  density: 1,
  speed: 1,
  size: 1,
  pOpacity: 1,
  quality: 0.75,
  // 自定义图片
  imgOn: true,
  imgFit: "cover",
  imgBlur: 0,
  imgBright: 1,
  imgFx: 0.5,
  imgBlend: "screen",
  imgMotion: false,
};

let state;
try {
  state = { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
} catch {
  state = { ...DEFAULT };
}
const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));

// ---------- 背景 ----------
let bg;
try {
  bg = new ShaderBackground($("#bg"));
} catch (e) {
  console.error(e);
  toast("当前设备不支持 WebGL，背景特效不可用");
}

const imgBg = new ImageBackground($("#imgLayer"));

function applyImage() {
  const show = imgBg.hasImage && state.imgOn;
  document.body.classList.toggle("has-img", imgBg.hasImage);
  $("#imgLayer").hidden = !show;
  const canvas = $("#bg");
  if (show) {
    imgBg.apply({ fit: state.imgFit, blur: state.imgBlur, brightness: state.imgBright, motion: state.imgMotion, bgColor: state.palette.bg, paused });
    canvas.style.opacity = state.imgFx;
    canvas.style.mixBlendMode = state.imgBlend;
  } else {
    canvas.style.opacity = "";
    canvas.style.mixBlendMode = "";
  }
  // 特效透明度为 0 时不渲染着色器，省电
  if (bg) bg.skip = show && state.imgFx <= 0;
  canvas.style.visibility = show && state.imgFx <= 0 ? "hidden" : "";
}

async function useImage(file) {
  try {
    await imgBg.setImage(file);
    state.imgOn = true;
    commit(false);
    toast("已设置背景图片，可在面板里调整显示方式");
  } catch (e) {
    toast(e.message || "图片加载失败");
  }
}

function applyBg() {
  applyImage();
  if (!bg) {
    document.body.style.background = state.palette.bg;
    return;
  }
  bg.setMode(state.bg);
  bg.colors = { ...state.palette };
  bg.intensity = state.bright;
  bg.speed = state.bgSpeed;
  bg.quality = state.quality;
}

// ---------- 粒子叠加层 ----------
let layers = [];
let gen = 0;
let paused = false;

async function rebuildOverlays() {
  const my = ++gen;
  layers.forEach((l) => l.inst?.destroy());
  layers = [];
  $("#overlays").innerHTML = "";
  $("#overlays").style.opacity = state.pOpacity;
  const ctx = {
    colors: [state.palette.c1, state.palette.c2, state.palette.c3],
    density: state.density,
    speed: state.speed,
    size: state.size,
  };
  for (const type of state.overlays) {
    const el = document.createElement("div");
    $("#overlays").appendChild(el);
    const layer = { type, el, inst: null };
    layers.push(layer);
    createOverlay(type, el, ctx)
      .then((inst) => {
        if (my !== gen) return inst?.destroy();
        layer.inst = inst;
        if (paused) inst?.pause();
      })
      .catch((e) => console.error(type, e));
  }
}

let rebuildTimer;
const rebuildSoon = (ms = 200) => {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuildOverlays, ms);
};

// ---------- UI 构建 ----------
function buildUI() {
  // 场景
  $("#scenes").innerHTML = SCENES.map((s, i) => `<button data-i="${i}">${s.name}</button>`).join("");
  $("#scenes").onclick = (e) => {
    const b = e.target.closest("button");
    if (b) applyScene(+b.dataset.i);
  };

  // 配色
  $("#palettes").innerHTML = PALETTES.map(
    (p, i) =>
      `<button class="swatch" data-i="${i}" title="${p.name}" style="background:
        radial-gradient(circle at 30% 30%, ${p.c1} 0 22%, transparent 23%),
        radial-gradient(circle at 70% 40%, ${p.c2} 0 18%, transparent 19%),
        radial-gradient(circle at 45% 62%, ${p.c3} 0 12%, transparent 13%), ${p.bg}"><span>${p.name}</span></button>`
  ).join("");
  $("#palettes").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const p = PALETTES[+b.dataset.i];
    state.palette = { bg: p.bg, c1: p.c1, c2: p.c2, c3: p.c3 };
    state.paletteName = p.name;
    commit(true);
  };
  const colorMap = { cBg: "bg", c1: "c1", c2: "c2", c3: "c3" };
  for (const [id, key] of Object.entries(colorMap)) {
    $("#" + id).addEventListener("input", (e) => {
      state.palette[key] = e.target.value;
      state.paletteName = null;
      commit(false);
      rebuildSoon(300);
    });
  }
  $("#btnFromMain").onclick = () => {
    state.palette = paletteFromMain(state.palette.c1, isLight(state.palette.bg));
    state.paletteName = null;
    commit(true);
    toast("已根据主色生成配色");
  };
  $("#btnLightDark").onclick = () => {
    const light = !isLight(state.palette.bg);
    state.palette = paletteFromMain(state.palette.c1, light, state.palette);
    state.paletteName = null;
    commit(true);
  };

  // 背景模式
  const bgIcons = { solid: "■", gradient: "◐", aurora: "〰", rays: "☀", lines: "≋", silk: "◠", nebula: "✺", bokeh: "◍", laser: "◈", caustics: "◌", spotlight: "▽", halo: "◎", lightleak: "◑", galaxy: "🌀", clouds: "☁", neon: "▦", watercolor: "🖌", polka: "⁘", heartgrid: "♡" };
  $("#bgModes").innerHTML = Object.entries(BG_MODES)
    .map(([k, n]) => `<button data-k="${k}"><i>${bgIcons[k] || "•"}</i>${n}</button>`)
    .join("");
  $("#bgModes").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.bg = b.dataset.k;
    commit(false);
  };

  // 粒子
  $("#overlayList").innerHTML = Object.entries(OVERLAYS)
    .map(([k, o]) => `<button data-k="${k}"><i>${o.icon}</i>${o.name}</button>`)
    .join("");
  $("#overlayList").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const k = b.dataset.k;
    state.overlays = state.overlays.includes(k) ? state.overlays.filter((x) => x !== k) : [...state.overlays, k];
    commit(true);
  };

  // 滑块
  const sliders = {
    sBright: ["bright", false],
    sBgSpeed: ["bgSpeed", false],
    sDensity: ["density", true],
    sSpeed: ["speed", true],
    sSize: ["size", true],
    sPOpacity: ["pOpacity", false],
    sQuality: ["quality", false],
    sImgBlur: ["imgBlur", false],
    sImgBright: ["imgBright", false],
    sImgFx: ["imgFx", false],
  };
  for (const [id, [key, needsRebuild]] of Object.entries(sliders)) {
    const input = $("#" + id);
    input.addEventListener("input", () => {
      state[key] = +input.value;
      input.nextElementSibling.value = (+input.value).toFixed(+input.step >= 1 ? 0 : 2);
      applyBg();
      $("#overlays").style.opacity = state.pOpacity;
      save();
      if (needsRebuild) rebuildSoon(350);
    });
  }

  // 我的预设
  renderPresets();
  $("#btnSavePreset").onclick = savePreset;
  $("#presetName").addEventListener("keydown", (e) => e.key === "Enter" && savePreset());
  $("#myPresets").onclick = async (e) => {
    const b = e.target.closest("button");
    const item = e.target.closest(".preset");
    if (!b || !item) return;
    const p = UP.loadList().find((x) => x.id === item.dataset.id);
    if (!p) return;
    if (b.classList.contains("apply")) {
      const img = p.hasImg ? await UP.loadPresetImage(p.id) : null;
      await applyPreset(p.data, { image: img, hideImage: !p.hasImg });
      toast(`已应用「${p.name}」`);
    } else if (b.classList.contains("share")) {
      sharePreset(p.name, p.data, p.hasImg);
    } else if (b.classList.contains("del")) {
      if (!confirm(`删除预设「${p.name}」？`)) return;
      await UP.removePreset(p.id);
      renderPresets();
    }
  };
  $("#myPresets").ondblclick = (e) => {
    const item = e.target.closest(".preset");
    const p = item && UP.loadList().find((x) => x.id === item.dataset.id);
    if (!p) return;
    const name = prompt("重命名预设", p.name)?.trim();
    if (name) { UP.renamePreset(p.id, name.slice(0, 30)); renderPresets(); }
  };
  $("#btnImportCode").onclick = () => {
    $("#importBox").hidden = !$("#importBox").hidden;
    if (!$("#importBox").hidden) $("#importCode").focus();
  };
  const doImport = async () => {
    try {
      const { name, data } = UP.decodeShare($("#importCode").value);
      await UP.addPreset(name, data);
      await applyPreset(data);
      renderPresets();
      $("#importCode").value = "";
      $("#importBox").hidden = true;
      toast(`已导入并应用「${name}」`);
    } catch (e) {
      toast(e.message || "导入失败");
    }
  };
  $("#btnImportOk").onclick = doImport;
  $("#importCode").addEventListener("keydown", (e) => e.key === "Enter" && doImport());
  $("#btnExport").onclick = () => {
    if (!UP.loadList().length) return toast("还没有可导出的预设");
    const blob = new Blob([UP.exportJSON()], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "拍谷背景-我的预设.json" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $("#importFile").addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const n = UP.importJSON(await f.text());
      renderPresets();
      toast(`已导入 ${n} 个预设`);
    } catch (err) {
      toast(err.message || "导入失败");
    }
  });

  // 自定义图片
  $("#imgFile").addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) useImage(f);
    e.target.value = "";
  });
  $("#btnImgClear").onclick = async () => {
    await imgBg.clear();
    commit(false);
    toast("已移除图片");
  };
  $("#btnImgPalette").onclick = async () => {
    try {
      const p = await imgBg.extractPalette(isLight(state.palette.bg));
      if (!p) return toast("没能从图片里取到颜色");
      state.palette = p;
      state.paletteName = null;
      commit(true);
      toast("已用图片颜色生成配色");
    } catch (e) {
      console.error(e);
      toast("取色失败");
    }
  };
  $("#imgOn").onchange = (e) => { state.imgOn = e.target.checked; commit(false); };
  $("#imgMotion").onchange = (e) => { state.imgMotion = e.target.checked; commit(false); };
  for (const [id, key] of [["#imgFit", "imgFit"], ["#imgBlend", "imgBlend"]]) {
    $(id).onclick = (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      state[key] = b.dataset.v;
      commit(false);
    };
  }
  // 拖入 / 粘贴图片
  let dragDepth = 0;
  addEventListener("dragenter", (e) => {
    if (![...(e.dataTransfer?.types || [])].includes("Files")) return;
    dragDepth++;
    document.body.classList.add("drag-over");
  });
  addEventListener("dragleave", () => {
    if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove("drag-over"); }
  });
  addEventListener("dragover", (e) => e.preventDefault());
  addEventListener("drop", (e) => {
    e.preventDefault();
    dragDepth = 0;
    document.body.classList.remove("drag-over");
    const f = [...(e.dataTransfer?.files || [])].find((x) => x.type.startsWith("image/"));
    if (f) useImage(f);
  });
  addEventListener("paste", (e) => {
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
    if (f) useImage(f);
  });

  // 按钮
  $("#toggle").onclick = () => togglePanel(true);
  $("#btnHide").onclick = () => togglePanel(false);
  $("#btnFull").onclick = toggleFull;
  $("#btnPause").onclick = togglePause;
  $("#btnRandom").onclick = randomize;
  // 点击背景关闭面板
  $("#stage").addEventListener("click", () => togglePanel(false));
}

function syncUI() {
  $("#cBg").value = state.palette.bg;
  $("#c1").value = state.palette.c1;
  $("#c2").value = state.palette.c2;
  $("#c3").value = state.palette.c3;
  document.querySelectorAll("#palettes .swatch").forEach((b) => {
    b.classList.toggle("active", PALETTES[+b.dataset.i].name === state.paletteName);
  });
  document.querySelectorAll("#bgModes button").forEach((b) => b.classList.toggle("active", b.dataset.k === state.bg));
  document.querySelectorAll("#overlayList button").forEach((b) => b.classList.toggle("active", state.overlays.includes(b.dataset.k)));
  document.querySelectorAll("#scenes button").forEach((b) => b.classList.toggle("active", +b.dataset.i === state.scene));
  const vals = { sImgBlur: state.imgBlur, sImgBright: state.imgBright, sImgFx: state.imgFx, sBright: state.bright, sBgSpeed: state.bgSpeed, sDensity: state.density, sSpeed: state.speed, sSize: state.size, sPOpacity: state.pOpacity, sQuality: state.quality };
  for (const [id, v] of Object.entries(vals)) {
    $("#" + id).value = v;
    $("#" + id).nextElementSibling.value = (+v).toFixed(+$("#" + id).step >= 1 ? 0 : 2);
  }
  document.querySelector('meta[name="theme-color"]').content = state.palette.bg;
  $("#imgOn").checked = state.imgOn;
  $("#imgMotion").checked = state.imgMotion;
  document.querySelectorAll("#imgFit button").forEach((b) => b.classList.toggle("active", b.dataset.v === state.imgFit));
  document.querySelectorAll("#imgBlend button").forEach((b) => b.classList.toggle("active", b.dataset.v === state.imgBlend));
}

function commit(rebuild) {
  applyBg();
  syncUI();
  save();
  if (rebuild) rebuildSoon(60);
}

function applyScene(i) {
  const s = SCENES[(i + SCENES.length) % SCENES.length];
  state.scene = SCENES.indexOf(s);
  const p = PALETTES.find((x) => x.name === s.palette) || PALETTES[0];
  state.palette = { bg: p.bg, c1: p.c1, c2: p.c2, c3: p.c3 };
  state.paletteName = p.name;
  state.bg = s.bg;
  state.overlays = [...s.overlays];
  commit(true);
  toast(s.name);
}

// ---------- 我的预设 ----------
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function renderPresets() {
  $("#myPresets").innerHTML = UP.loadList()
    .map((p) => {
      const c = p.data.palette || state.palette;
      const sw = `linear-gradient(90deg, ${c.bg} 0 25%, ${c.c1} 25% 50%, ${c.c2} 50% 75%, ${c.c3} 75%)`;
      const desc = [BG_MODES[p.data.bg], ...(p.data.overlays || []).map((k) => OVERLAYS[k]?.name)].filter(Boolean).join(" · ");
      return `<div class="preset" data-id="${esc(p.id)}">
        <button class="apply" title="${esc(desc)}（双击重命名）"><i class="sw" style="--sw:${sw}"></i><span>${esc(p.name)}</span>${p.hasImg ? "🖼" : ""}</button>
        <button class="share" title="复制分享码">🔗</button>
        <button class="del" title="删除">✕</button>
      </div>`;
    })
    .join("");
}

async function savePreset() {
  const input = $("#presetName");
  const name = input.value.trim().slice(0, 30) || `我的预设 ${UP.loadList().length + 1}`;
  const image = imgBg.hasImage && state.imgOn ? imgBg.blob : null;
  await UP.addPreset(name, UP.snapshot(state), image);
  input.value = "";
  renderPresets();
  toast(`已保存「${name}」${image ? "（含图片）" : ""}`);
}

/** 应用预设数据。image: 预设自带图片；hideImage: 预设不含图片时隐藏当前图片 */
async function applyPreset(data, { image = null, hideImage = false } = {}) {
  Object.assign(state, data);
  if (data.palette) {
    const hit = PALETTES.find((x) => ["bg", "c1", "c2", "c3"].every((k) => x[k].toLowerCase() === data.palette[k].toLowerCase()));
    state.paletteName = hit ? hit.name : null;
  }
  state.scene = -1;
  if (image) {
    await imgBg.setImage(image);
    state.imgOn = true;
  } else if (hideImage) {
    state.imgOn = false;
  }
  commit(true);
}

async function sharePreset(name, data, hasImg) {
  const code = UP.encodeShare(name, data);
  const link = UP.shareLink(code);
  const text = link || code;
  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    prompt("复制下面的内容发给朋友：", text);
  }
  if (copied) {
    toast((link ? "分享链接已复制" : "分享码已复制，对方在「导入分享码」里粘贴即可") + (hasImg ? "（图片不会被分享）" : ""));
  }
}

/** 打开带 #p=分享码 的链接时自动加载 */
async function loadFromHash() {
  if (!/[#&]p=/.test(location.hash)) return;
  try {
    const { name, data } = UP.decodeShare(location.hash);
    await applyPreset(data);
    $("#presetName").value = name;
    toast(`已加载分享的「${name}」，点「保存当前」可存到我的预设`);
  } catch (e) {
    toast(e.message || "分享链接无效");
  }
  history.replaceState(null, "", location.pathname + location.search);
}

function randomize() {
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const p = pick(PALETTES);
  state.palette = { bg: p.bg, c1: p.c1, c2: p.c2, c3: p.c3 };
  state.paletteName = p.name;
  state.bg = pick(Object.keys(BG_MODES).filter((k) => k !== "solid"));
  const keys = Object.keys(OVERLAYS).sort(() => Math.random() - 0.5);
  state.overlays = keys.slice(0, 1 + ((Math.random() * 2.5) | 0));
  state.scene = -1;
  commit(true);
  toast(`${p.name} · ${BG_MODES[state.bg]} · ${state.overlays.map((k) => OVERLAYS[k].name).join(" + ")}`);
}

// ---------- 颜色工具 ----------
function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return "#" + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const isLight = (hex) => hexToHsl(hex)[2] > 55;
function paletteFromMain(main, light, keep) {
  const [h, s] = hexToHsl(main);
  const sat = Math.max(s, 35);
  return {
    c1: main,
    c2: keep?.c2 ?? hsl(h + 35, sat, 70),
    c3: keep?.c3 ?? hsl(h - 10, Math.min(sat, 60), 92),
    bg: light ? hsl(h, Math.min(sat, 70), 94) : hsl(h, Math.min(sat, 55), 7),
  };
}

// ---------- 交互：面板、全屏、暂停、闲置隐藏、常亮 ----------
function togglePanel(open = !$("#panel").classList.contains("open")) {
  $("#panel").classList.toggle("open", open);
  document.body.classList.toggle("panel-open", open);
}

async function toggleFull() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    else await document.exitFullscreen();
  } catch {
    toast("浏览器不支持全屏，可用浏览器自身的全屏/添加到主屏幕");
  }
}

function togglePause() {
  paused = !paused;
  if (bg) bg.paused = paused;
  layers.forEach((l) => (paused ? l.inst?.pause() : l.inst?.play()));
  $("#imgLayer").style.animationPlayState = paused ? "paused" : "running";
  $("#btnPause").textContent = paused ? "▶ 继续" : "⏸ 暂停";
  toast(paused ? "已暂停（定格画面）" : "继续播放");
}

let idleTimer;
function bumpIdle() {
  document.body.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => document.body.classList.add("idle"), 3000);
}
["mousemove", "touchstart", "keydown", "wheel"].forEach((ev) => addEventListener(ev, bumpIdle, { passive: true }));

let wakeLock = null;
async function keepAwake() {
  try {
    if ("wakeLock" in navigator && document.visibilityState === "visible") {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch {
    /* 不支持时忽略 */
  }
}
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && keepAwake());
addEventListener("click", () => !wakeLock && keepAwake(), { once: true });

addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  switch (e.key.toLowerCase()) {
    case "h": togglePanel(); break;
    case "f": toggleFull(); break;
    case " ": e.preventDefault(); togglePause(); break;
    case "r": randomize(); break;
    case "arrowright": applyScene((state.scene ?? -1) + 1); break;
    case "arrowleft": applyScene((state.scene ?? 1) - 1); break;
    case "escape": togglePanel(false); break;
  }
});

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

// ---------- 启动 ----------
buildUI();
applyBg();
syncUI();
document.body.classList.add("panel-open");
bumpIdle();
initEngine().then(rebuildOverlays);
imgBg.restore().then(() => applyImage());
loadFromHash();
addEventListener("hashchange", loadFromHash);
keepAwake();
