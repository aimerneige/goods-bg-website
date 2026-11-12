import { ShaderBackground } from "./shaderBg.js";
import { OVERLAYS, createOverlay, initEngine } from "./overlays.js";
import { PALETTES, BG_MODES, SCENES } from "./presets.js";

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

function applyBg() {
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
  const bgIcons = { solid: "■", gradient: "◐", aurora: "〰", rays: "☀", lines: "≋", silk: "◠", nebula: "✺", bokeh: "◍", laser: "◈", caustics: "◌", spotlight: "▽", halo: "◎" };
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
  };
  for (const [id, [key, needsRebuild]] of Object.entries(sliders)) {
    const input = $("#" + id);
    input.addEventListener("input", () => {
      state[key] = +input.value;
      input.nextElementSibling.value = (+input.value).toFixed(2);
      applyBg();
      $("#overlays").style.opacity = state.pOpacity;
      save();
      if (needsRebuild) rebuildSoon(350);
    });
  }

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
  const vals = { sBright: state.bright, sBgSpeed: state.bgSpeed, sDensity: state.density, sSpeed: state.speed, sSize: state.size, sPOpacity: state.pOpacity, sQuality: state.quality };
  for (const [id, v] of Object.entries(vals)) {
    $("#" + id).value = v;
    $("#" + id).nextElementSibling.value = (+v).toFixed(2);
  }
  document.querySelector('meta[name="theme-color"]').content = state.palette.bg;
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
keepAwake();
