import { tsParticles } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import * as S from "./svgs.js";
import { CANVAS_FX, createCanvasFx } from "./canvasFx.js";

let engineReady = null;
export const initEngine = () => (engineReady ??= loadFull(tsParticles));

const imgs = (fn, colors) => colors.map((c) => fn(c));
const range = (min, max, k = 1) => ({ min: min * k, max: max * k });

// 每种粒子叠加层的配置。ctx: { colors:[c1,c2,c3], density, speed, size }
const PARTICLES = {
  stars: {
    name: "闪烁星点",
    icon: "✦",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 160 * density },
        color: { value: ["#ffffff", "#ffffff", colors[0], colors[2]] },
        shape: { type: "circle" },
        size: { value: range(0.5, 2.2, size) },
        opacity: { value: range(0.1, 1), animation: { enable: true, speed: 0.8, sync: false } },
        twinkle: { particles: { enable: true, frequency: 0.03, opacity: 1, color: { value: "#ffffff" } } },
        move: { enable: true, speed: 0.15 * speed, direction: "none", random: true, outModes: "out" },
      },
    }),
  },
  sparkle: {
    name: "十字星芒",
    icon: "✧",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 28 * density },
        shape: { type: "image", options: { image: imgs(S.sparkle, ["#ffffff", ...colors]) } },
        size: { value: range(6, 18, size), animation: { enable: true, speed: 6, sync: false } },
        opacity: { value: range(0, 1), animation: { enable: true, speed: 0.9, sync: false } },
        rotate: { value: range(0, 45), animation: { enable: true, speed: 4 }, direction: "random" },
        move: { enable: true, speed: 0.25 * speed, random: true, outModes: "out" },
      },
    }),
  },
  feathers: {
    name: "飘落羽毛",
    icon: "🪶",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 20 * density },
        shape: { type: "image", options: { image: imgs(S.feather, ["#ffffff", "#ffffff", ...colors]) } },
        size: { value: range(18, 36, size) },
        opacity: { value: range(0.75, 1) },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 3 }, direction: "random" },
        wobble: { enable: true, distance: 30, speed: range(-6, 6) },
        tilt: { enable: true, value: range(0, 60), animation: { enable: true, speed: 4 }, direction: "random" },
        move: {
          enable: true,
          speed: range(0.6, 1.4, speed),
          direction: "bottom",
          drift: range(-0.4, 0.4),
          outModes: "out",
        },
      },
    }),
  },
  petals: {
    name: "樱花花瓣",
    icon: "🌸",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 45 * density },
        shape: { type: "image", options: { image: imgs(S.petal, ["#ffb7cf", "#ffc8dc", colors[0], colors[2]]) } },
        size: { value: range(6, 12, size) },
        opacity: { value: range(0.7, 1) },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 10 }, direction: "random" },
        roll: { enable: true, darken: { enable: true, value: 15 }, speed: range(4, 12) },
        wobble: { enable: true, distance: 20, speed: range(-10, 10) },
        move: { enable: true, speed: range(1, 2.2, speed), direction: "bottom-right", outModes: "out" },
      },
    }),
  },
  snow: {
    name: "雪花",
    icon: "❄",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 140 * density },
        shape: {
          type: "image",
          options: {
            image: [
              ...imgs(S.glowDot, ["#ffffff", "#ffffff", "#ffffff", colors[2]]),
              S.snowflake("#ffffff"),
              S.snowflake(colors[2]),
            ],
          },
        },
        size: { value: range(2, 7, size) },
        opacity: { value: range(0.5, 1) },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 3 } },
        wobble: { enable: true, distance: 12, speed: range(-6, 6) },
        move: { enable: true, speed: range(0.5, 1.5, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  bokeh: {
    name: "梦幻光斑",
    icon: "◯",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 24 * density },
        shape: { type: "image", options: { image: imgs(S.bokeh, colors) } },
        size: { value: range(20, 70, size) },
        opacity: { value: range(0.12, 0.45), animation: { enable: true, speed: 0.4, sync: false } },
        move: { enable: true, speed: 0.4 * speed, random: true, outModes: "out" },
      },
    }),
  },
  hearts: {
    name: "爱心上升",
    icon: "♥",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 22 * density },
        shape: { type: "image", options: { image: imgs(S.heart, [...colors, "#ff7aa8"]) } },
        size: { value: range(7, 16, size) },
        opacity: { value: range(0.4, 0.95), animation: { enable: true, speed: 0.6, sync: false } },
        rotate: { value: range(-20, 20), direction: "random" },
        wobble: { enable: true, distance: 18, speed: range(-8, 8) },
        move: { enable: true, speed: range(0.6, 1.5, speed), direction: "top", outModes: "out" },
      },
    }),
  },
  bubbles: {
    name: "泡泡",
    icon: "○",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 28 * density },
        shape: { type: "image", options: { image: imgs(S.bubble, ["#ffffff", ...colors]) } },
        size: { value: range(8, 32, size) },
        opacity: { value: range(0.6, 1) },
        wobble: { enable: true, distance: 15, speed: range(-6, 6) },
        move: { enable: true, speed: range(0.5, 1.4, speed), direction: "top", outModes: "out" },
      },
    }),
  },
  fireflies: {
    name: "萤火虫",
    icon: "✺",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 40 * density },
        shape: { type: "image", options: { image: imgs(S.glowDot, [colors[2], colors[0], "#fff7b0"]) } },
        size: { value: range(5, 12, size) },
        opacity: { value: range(0.05, 1), animation: { enable: true, speed: 1.2, sync: false } },
        move: {
          enable: true,
          speed: range(0.3, 1, speed),
          random: true,
          outModes: "bounce",
        },
        wobble: { enable: true, distance: 6, speed: range(-4, 4) },
      },
    }),
  },
  confetti: {
    name: "彩纸亮片",
    icon: "▧",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 90 * density },
        color: { value: [...colors, "#ffffff", "#ffd56b"] },
        shape: { type: ["square", "circle"] },
        size: { value: range(3, 6, size) },
        opacity: { value: 1 },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 30 }, direction: "random" },
        tilt: { enable: true, value: range(0, 360), animation: { enable: true, speed: 30 }, direction: "random" },
        roll: { enable: true, darken: { enable: true, value: 30 }, enlighten: { enable: true, value: 30 }, speed: range(15, 25) },
        wobble: { enable: true, distance: 25, speed: range(-15, 15) },
        move: { enable: true, speed: range(1.2, 2.5, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  glitter: {
    name: "闪粉飘落",
    icon: "⁂",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 200 * density },
        color: { value: ["#ffe9a8", "#ffffff", colors[2], colors[0]] },
        shape: { type: "circle" },
        size: { value: range(0.5, 1.8, size) },
        opacity: { value: range(0.3, 1) },
        twinkle: { particles: { enable: true, frequency: 0.08, opacity: 1, color: { value: "#ffffff" } } },
        move: { enable: true, speed: range(0.3, 0.8, speed), direction: "bottom", drift: range(-0.2, 0.2), outModes: "out" },
      },
    }),
  },
  starShapes: {
    name: "星星飘落",
    icon: "★",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 30 * density },
        color: { value: [...colors, "#ffffff", "#ffe27a"] },
        shape: { type: "star", options: { star: { sides: 5, inset: 2.2 } } },
        size: { value: range(4, 10, size) },
        opacity: { value: range(0.5, 1), animation: { enable: true, speed: 0.8, sync: false } },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 6 }, direction: "random" },
        shadow: { enable: true, color: colors[2], blur: 8 },
        move: { enable: true, speed: range(0.5, 1.2, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  notes: {
    name: "音符",
    icon: "♪",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 18 * density },
        color: { value: [...colors, "#ffffff"] },
        shape: {
          type: "character",
          options: { character: { value: ["♪", "♫", "♬", "♩"], font: "Segoe UI Symbol, Noto Sans Symbols, sans-serif", weight: "400" } },
        },
        size: { value: range(10, 18, size) },
        opacity: { value: range(0.4, 0.95), animation: { enable: true, speed: 0.6, sync: false } },
        rotate: { value: range(-25, 25), animation: { enable: true, speed: 3 }, direction: "random" },
        wobble: { enable: true, distance: 15, speed: range(-6, 6) },
        move: { enable: true, speed: range(0.5, 1.2, speed), direction: "top", outModes: "out" },
      },
    }),
  },
  butterflies: {
    name: "蝴蝶",
    icon: "🦋",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 12 * density },
        shape: { type: "image", options: { image: imgs(S.butterfly, [...colors, "#ffffff"]) } },
        size: { value: range(10, 18, size) },
        opacity: { value: range(0.8, 1) },
        roll: { enable: true, speed: range(10, 20) },
        rotate: { value: range(-30, 30), animation: { enable: true, speed: 5 }, direction: "random" },
        wobble: { enable: true, distance: 20, speed: range(-10, 10) },
        move: { enable: true, speed: range(0.6, 1.4, speed), direction: "top-right", random: true, outModes: "out" },
      },
    }),
  },
  balloons: {
    name: "气球",
    icon: "🎈",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 14 * density },
        shape: { type: "image", options: { image: imgs(S.balloon, [...colors, "#ffffff", "#ffd56b"]) } },
        size: { value: range(16, 30, size) },
        opacity: { value: range(0.85, 1) },
        rotate: { value: range(-12, 12), animation: { enable: true, speed: 2 }, direction: "random" },
        wobble: { enable: true, distance: 12, speed: range(-4, 4) },
        move: { enable: true, speed: range(0.6, 1.4, speed), direction: "top", outModes: "out" },
      },
    }),
  },
  embers: {
    name: "火花余烬",
    icon: "✹",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 70 * density },
        shape: { type: "image", options: { image: imgs(S.glowDot, ["#ffb347", "#ff7a3d", "#ffe08a", colors[0]]) } },
        size: { value: range(2, 6, size) },
        opacity: { value: range(0.1, 1), animation: { enable: true, speed: 1.5, sync: false } },
        wobble: { enable: true, distance: 10, speed: range(-8, 8) },
        move: { enable: true, speed: range(0.8, 2, speed), direction: "top", drift: range(-0.6, 0.6), outModes: "out" },
      },
    }),
  },
  diamonds: {
    name: "钻石水晶",
    icon: "💎",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 18 * density },
        shape: { type: "image", options: { image: imgs(S.diamond, ["#ffffff", "#bfe9ff", ...colors]) } },
        size: { value: range(8, 18, size) },
        opacity: { value: range(0.6, 1), animation: { enable: true, speed: 0.7, sync: false } },
        rotate: { value: range(-20, 20), animation: { enable: true, speed: 3 }, direction: "random" },
        roll: { enable: true, enlighten: { enable: true, value: 30 }, speed: range(3, 8) },
        move: { enable: true, speed: range(0.3, 0.8, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  maple: {
    name: "秋叶",
    icon: "🍁",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 26 * density },
        shape: { type: "image", options: { image: imgs(S.maple, ["#e8562a", "#f39c32", "#d93a3a", "#f6c344", colors[0]]) } },
        size: { value: range(9, 18, size) },
        opacity: { value: range(0.85, 1) },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 8 }, direction: "random" },
        roll: { enable: true, darken: { enable: true, value: 25 }, speed: range(4, 10) },
        wobble: { enable: true, distance: 30, speed: range(-8, 8) },
        move: { enable: true, speed: range(0.8, 1.8, speed), direction: "bottom-left", outModes: "out" },
      },
    }),
  },
  dandelion: {
    name: "蒲公英",
    icon: "✲",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 16 * density },
        shape: { type: "image", options: { image: imgs(S.dandelion, ["#ffffff", "#ffffff", colors[2]]) } },
        size: { value: range(10, 20, size) },
        opacity: { value: range(0.7, 1) },
        rotate: { value: range(-30, 30), animation: { enable: true, speed: 4 }, direction: "random" },
        wobble: { enable: true, distance: 25, speed: range(-4, 4) },
        move: { enable: true, speed: range(0.4, 1, speed), direction: "top-right", outModes: "out" },
      },
    }),
  },
  clover: {
    name: "四叶草",
    icon: "🍀",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 18 * density },
        shape: { type: "image", options: { image: imgs(S.clover, ["#5fd068", "#8be38f", colors[0]]) } },
        size: { value: range(8, 15, size) },
        opacity: { value: range(0.8, 1) },
        rotate: { value: range(0, 360), animation: { enable: true, speed: 5 }, direction: "random" },
        roll: { enable: true, darken: { enable: true, value: 20 }, speed: range(3, 8) },
        wobble: { enable: true, distance: 20, speed: range(-6, 6) },
        move: { enable: true, speed: range(0.6, 1.3, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  bows: {
    name: "蝴蝶结",
    icon: "🎀",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 16 * density },
        shape: { type: "image", options: { image: imgs(S.bow, [...colors, "#ff8fb8"]) } },
        size: { value: range(10, 18, size) },
        opacity: { value: range(0.85, 1) },
        rotate: { value: range(-30, 30), animation: { enable: true, speed: 4 }, direction: "random" },
        wobble: { enable: true, distance: 20, speed: range(-6, 6) },
        move: { enable: true, speed: range(0.5, 1.2, speed), direction: "bottom", outModes: "out" },
      },
    }),
  },
  crowns: {
    name: "王冠",
    icon: "👑",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 12 * density },
        shape: { type: "image", options: { image: imgs(S.crown, ["#ffd56b", "#ffe9a8", colors[0]]) } },
        size: { value: range(10, 18, size) },
        opacity: { value: range(0.5, 1), animation: { enable: true, speed: 0.6, sync: false } },
        rotate: { value: range(-20, 20), animation: { enable: true, speed: 3 }, direction: "random" },
        move: { enable: true, speed: range(0.3, 0.8, speed), direction: "top", outModes: "out" },
      },
    }),
  },
  moons: {
    name: "月亮星辰",
    icon: "☾",
    build: ({ colors, density, speed, size }) => ({
      particles: {
        number: { value: 14 * density },
        shape: { type: "image", options: { image: imgs(S.moon, ["#fff3c4", "#ffffff", colors[2], colors[0]]) } },
        size: { value: range(10, 20, size) },
        opacity: { value: range(0.4, 1), animation: { enable: true, speed: 0.5, sync: false } },
        rotate: { value: range(-30, 30), animation: { enable: true, speed: 2 }, direction: "random" },
        wobble: { enable: true, distance: 10, speed: range(-3, 3) },
        move: { enable: true, speed: range(0.2, 0.6, speed), random: true, outModes: "out" },
      },
    }),
  },
};

export const OVERLAYS = {
  ...CANVAS_FX,
  ...PARTICLES,
};

let seq = 0;

/** 创建一个叠加层，返回带 pause/play/destroy 的对象 */
export async function createOverlay(type, el, ctx) {
  const def = OVERLAYS[type];
  if (!def) return null;
  if (def.custom) return createCanvasFx(type, el, ctx);
  await initEngine();
  const opts = def.build(ctx);
  opts.particles.number.density = { enable: true, width: 1920, height: 1080 };
  const container = await tsParticles.load({
    id: `ov-${type}-${seq++}`,
    element: el,
    options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { opacity: 0 },
      interactivity: { events: { onHover: { enable: false }, onClick: { enable: false }, resize: { enable: true } } },
      ...opts,
    },
  });
  return container;
}
