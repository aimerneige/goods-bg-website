import { tsParticles } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import * as S from "./svgs.js";

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
};

// ---------- 自定义 Canvas 特效：流星、扫光 ----------

class CanvasEffect {
  constructor(el, ctx, kind) {
    this.kind = kind;
    this.ctx = ctx;
    this.canvas = document.createElement("canvas");
    el.appendChild(this.canvas);
    this.g = this.canvas.getContext("2d");
    this.items = [];
    this.paused = false;
    this.alive = true;
    this.spawnTimer = 0;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.alive) return;
      requestAnimationFrame(loop);
      const dt = Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      if (!this.paused) this.step(dt);
    };
    requestAnimationFrame(loop);
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.dpr = dpr;
  }
  pick() {
    const c = ["#ffffff", ...this.ctx.colors];
    return c[(Math.random() * c.length) | 0];
  }
  step(dt) {
    this.resize();
    const { g, canvas } = this;
    const W = canvas.width, H = canvas.height, { density, speed, size } = this.ctx;
    g.clearRect(0, 0, W, H);
    this.spawnTimer -= dt;
    if (this.kind === "meteors") {
      if (this.spawnTimer <= 0) {
        this.spawnTimer = (0.4 + Math.random() * 1.6) / Math.max(density, 0.1);
        const ang = (Math.PI * (200 + Math.random() * 25)) / 180; // 往左下
        this.items.push({
          x: W * (0.2 + Math.random() * 0.9),
          y: -H * 0.05 + Math.random() * H * 0.4,
          vx: Math.cos(ang),
          vy: -Math.sin(ang),
          v: (600 + Math.random() * 700) * this.dpr * speed,
          len: (120 + Math.random() * 200) * this.dpr * size,
          w: (1 + Math.random() * 1.6) * this.dpr * size,
          life: 0,
          max: 0.8 + Math.random() * 0.8,
          color: this.pick(),
        });
      }
      g.globalCompositeOperation = "lighter";
      for (const m of this.items) {
        m.life += dt;
        m.x += m.vx * m.v * dt;
        m.y += m.vy * m.v * dt;
        const a = Math.sin(Math.min(m.life / m.max, 1) * Math.PI);
        const tx = m.x - m.vx * m.len, ty = m.y - m.vy * m.len;
        const grad = g.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, m.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.globalAlpha = a;
        g.strokeStyle = grad;
        g.lineWidth = m.w;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(m.x, m.y);
        g.lineTo(tx, ty);
        g.stroke();
        const r = m.w * 5;
        const glow = g.createRadialGradient(m.x, m.y, 0, m.x, m.y, r);
        glow.addColorStop(0, "rgba(255,255,255,0.95)");
        glow.addColorStop(0.3, m.color);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = glow;
        g.beginPath();
        g.arc(m.x, m.y, r, 0, Math.PI * 2);
        g.fill();
      }
      this.items = this.items.filter((m) => m.life < m.max);
    } else if (this.kind === "sweep") {
      // 斜向柔光带缓慢扫过画面
      if (this.spawnTimer <= 0) {
        this.spawnTimer = (2.5 + Math.random() * 3) / Math.max(density, 0.1);
        this.items.push({ p: -0.3, v: (0.08 + Math.random() * 0.08) * speed, w: (0.06 + Math.random() * 0.12) * size, color: this.pick(), a: 0.18 + Math.random() * 0.2 });
      }
      g.globalCompositeOperation = "lighter";
      const diag = W + H;
      for (const s of this.items) {
        s.p += s.v * dt;
        const x = s.p * diag;
        g.save();
        g.translate(x, 0);
        g.rotate(-0.5);
        const bw = s.w * diag;
        const grad = g.createLinearGradient(-bw, 0, bw, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.5, s.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.globalAlpha = s.a;
        g.fillStyle = grad;
        g.fillRect(-bw, -diag, bw * 2, diag * 3);
        g.restore();
      }
      this.items = this.items.filter((s) => s.p < 1.4);
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }
  pause() { this.paused = true; }
  play() { this.paused = false; this.last = performance.now(); }
  destroy() { this.alive = false; this.canvas.remove(); }
}

const CUSTOM = {
  meteors: { name: "流星划过", icon: "☄" },
  sweep: { name: "扫光流动", icon: "⟋" },
};

export const OVERLAYS = {
  ...Object.fromEntries(Object.entries(CUSTOM).map(([k, v]) => [k, { ...v, custom: true }])),
  ...PARTICLES,
};

let seq = 0;

/** 创建一个叠加层，返回带 pause/play/destroy 的对象 */
export async function createOverlay(type, el, ctx) {
  const def = OVERLAYS[type];
  if (!def) return null;
  if (def.custom) return new CanvasEffect(el, ctx, type);
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
