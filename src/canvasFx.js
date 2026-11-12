// 自定义 Canvas 2D 特效：流星、扫光、烟花、雨丝、光圈涟漪
// 每种特效 = { name, icon, step(fx, dt, g, W, H) }，fx.items 存放活动元素

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const KINDS = {
  meteors: {
    name: "流星划过",
    icon: "☄",
    step(fx, dt, g) {
      const { W, H, dpr } = fx, { density, speed, size } = fx.ctx;
      if ((fx.timer -= dt) <= 0) {
        fx.timer = rand(0.4, 2) / density;
        const ang = (Math.PI * rand(200, 225)) / 180;
        fx.items.push({
          x: W * rand(0.2, 1.1), y: H * rand(-0.05, 0.35),
          vx: Math.cos(ang), vy: -Math.sin(ang),
          v: rand(600, 1300) * dpr * speed, len: rand(120, 320) * dpr * size,
          w: rand(1, 2.6) * dpr * size, life: 0, max: rand(0.8, 1.6), color: fx.pick(),
        });
      }
      g.globalCompositeOperation = "lighter";
      for (const m of fx.items) {
        m.life += dt;
        m.x += m.vx * m.v * dt;
        m.y += m.vy * m.v * dt;
        g.globalAlpha = Math.sin(Math.min(m.life / m.max, 1) * Math.PI);
        const tx = m.x - m.vx * m.len, ty = m.y - m.vy * m.len;
        const grad = g.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, m.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.strokeStyle = grad;
        g.lineWidth = m.w;
        g.lineCap = "round";
        g.beginPath(); g.moveTo(m.x, m.y); g.lineTo(tx, ty); g.stroke();
        fx.glow(m.x, m.y, m.w * 5, m.color);
      }
      fx.items = fx.items.filter((m) => m.life < m.max);
    },
  },

  sweep: {
    name: "扫光流动",
    icon: "⟋",
    step(fx, dt, g) {
      const { W, H } = fx, { density, speed, size } = fx.ctx;
      if ((fx.timer -= dt) <= 0) {
        fx.timer = rand(2.5, 5.5) / density;
        fx.items.push({ p: -0.3, v: rand(0.08, 0.16) * speed, w: rand(0.06, 0.18) * size, color: fx.pick(), a: rand(0.18, 0.38) });
      }
      g.globalCompositeOperation = "lighter";
      const diag = W + H;
      for (const s of fx.items) {
        s.p += s.v * dt;
        g.save();
        g.translate(s.p * diag, 0);
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
      fx.items = fx.items.filter((s) => s.p < 1.4);
    },
  },

  fireworks: {
    name: "烟花",
    icon: "🎆",
    step(fx, dt, g) {
      const { W, H, dpr } = fx, { density, speed, size } = fx.ctx;
      const sdt = dt * speed;
      if ((fx.timer -= dt) <= 0) {
        fx.timer = rand(0.5, 1.8) / density;
        const tx = W * rand(0.1, 0.9);
        fx.items.push({ type: "rocket", x: tx + rand(-60, 60) * dpr, y: H + 10, tx, ty: H * rand(0.12, 0.45), color: fx.pick(), t: 0 });
      }
      g.globalCompositeOperation = "lighter";
      const next = [];
      for (const p of fx.items) {
        if (p.type === "rocket") {
          p.t += sdt;
          const k = Math.min(p.t / 1.1, 1), e = 1 - (1 - k) ** 3;
          const px = p.x0 ?? (p.x0 = p.x), py = H + 10;
          p.cx = px + (p.tx - px) * e;
          p.cy = py + (p.ty - py) * e;
          g.globalAlpha = 0.9;
          fx.glow(p.cx, p.cy, 4 * dpr * size, p.color);
          if (k >= 1) {
            const n = Math.round(rand(60, 110));
            const style = Math.random();
            const color2 = fx.pick();
            for (let i = 0; i < n; i++) {
              const a = (i / n) * TAU + rand(-0.05, 0.05);
              const v = (style < 0.3 ? 1 : rand(0.35, 1)) * rand(220, 340) * dpr * size;
              next.push({
                type: "spark", x: p.cx, y: p.cy, px: p.cx, py: p.cy,
                vx: Math.cos(a) * v, vy: Math.sin(a) * v,
                life: 0, max: rand(1.2, 2.2), color: i % 3 === 0 ? color2 : p.color,
                w: rand(1.8, 3.2) * dpr * size,
              });
            }
            next.push({ type: "flash", x: p.cx, y: p.cy, life: 0, max: 0.25, color: p.color });
            continue;
          }
          next.push(p);
        } else if (p.type === "spark") {
          p.life += sdt;
          p.px = p.x; p.py = p.y;
          const drag = Math.pow(0.25, sdt);
          p.vx *= drag; p.vy = p.vy * drag + 70 * dpr * sdt;
          p.x += p.vx * sdt; p.y += p.vy * sdt;
          const a = 1 - p.life / p.max;
          g.globalAlpha = Math.max(a, 0) * (a < 0.35 ? 0.4 + 0.6 * Math.random() : 1);
          g.strokeStyle = p.color;
          g.lineWidth = p.w;
          g.lineCap = "round";
          g.beginPath();
          g.moveTo(p.x - (p.x - p.px) * 4, p.y - (p.y - p.py) * 4);
          g.lineTo(p.x, p.y);
          g.stroke();
          if (a > 0.25) fx.glow(p.x, p.y, p.w * 3, p.color);
          if (p.life < p.max) next.push(p);
        } else if (p.type === "flash") {
          p.life += sdt;
          g.globalAlpha = 0.5 * (1 - p.life / p.max);
          fx.glow(p.x, p.y, 60 * dpr * size, p.color);
          if (p.life < p.max) next.push(p);
        }
      }
      fx.items = next;
    },
  },

  rain: {
    name: "雨丝",
    icon: "☂",
    step(fx, dt, g) {
      const { W, H, dpr } = fx, { density, speed, size } = fx.ctx;
      const want = Math.round(160 * density);
      while (fx.items.length < want) {
        fx.items.push({ x: rand(-0.1, 1.1) * W, y: rand(-1, 1) * H, z: rand(0.3, 1), c: fx.pick() });
      }
      if (fx.items.length > want) fx.items.length = want;
      g.lineCap = "round";
      const slant = 0.18;
      for (const r of fx.items) {
        const v = (900 + 900 * r.z) * dpr * speed;
        r.y += v * dt;
        r.x += v * slant * dt;
        const len = (14 + 26 * r.z) * dpr * size;
        g.globalAlpha = 0.12 + 0.35 * r.z;
        g.strokeStyle = r.c;
        g.lineWidth = (0.6 + 1.2 * r.z) * dpr * size;
        g.beginPath();
        g.moveTo(r.x, r.y);
        g.lineTo(r.x - len * slant, r.y - len);
        g.stroke();
        if (r.y - len > H) { r.y = rand(-0.3, 0) * H; r.x = rand(-0.2, 1) * W; }
      }
    },
  },

  ripples: {
    name: "光圈涟漪",
    icon: "◎",
    step(fx, dt, g) {
      const { W, H, dpr } = fx, { density, speed, size } = fx.ctx;
      if ((fx.timer -= dt) <= 0) {
        fx.timer = rand(0.4, 1.4) / density;
        fx.items.push({ x: rand(0, W), y: rand(0, H), r: 0, max: rand(80, 220) * dpr * size, v: rand(40, 90) * dpr * speed, c: fx.pick() });
      }
      g.globalCompositeOperation = "lighter";
      for (const p of fx.items) {
        p.r += p.v * dt;
        const k = p.r / p.max;
        for (let i = 0; i < 3; i++) {
          const rr = p.r - i * 14 * dpr * size;
          if (rr <= 0) continue;
          g.globalAlpha = Math.max(0, (1 - k) * (0.55 - i * 0.15));
          g.strokeStyle = p.c;
          g.lineWidth = (2 - i * 0.5) * dpr * size;
          g.beginPath();
          g.arc(p.x, p.y, rr, 0, TAU);
          g.stroke();
        }
      }
      fx.items = fx.items.filter((p) => p.r < p.max);
    },
  },
};

class CanvasEffect {
  constructor(el, ctx, kind) {
    this.kind = KINDS[kind];
    this.ctx = { ...ctx, density: Math.max(ctx.density, 0.05) };
    this.canvas = document.createElement("canvas");
    el.appendChild(this.canvas);
    this.g = this.canvas.getContext("2d");
    this.items = [];
    this.timer = 0;
    this.paused = false;
    this.alive = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.alive) return;
      requestAnimationFrame(loop);
      const dt = Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      if (this.paused) return;
      this.resize();
      this.g.clearRect(0, 0, this.W, this.H);
      this.kind.step(this, dt, this.g);
      this.g.globalAlpha = 1;
      this.g.globalCompositeOperation = "source-over";
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
    this.W = w; this.H = h; this.dpr = dpr;
  }
  pick() {
    const c = ["#ffffff", ...this.ctx.colors];
    return c[(Math.random() * c.length) | 0];
  }
  glow(x, y, r, color) {
    const g = this.g;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.3, rgba(color, 0.9));
    grad.addColorStop(1, rgba(color, 0));
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }
  pause() { this.paused = true; }
  play() { this.paused = false; this.last = performance.now(); }
  destroy() { this.alive = false; this.canvas.remove(); }
}

export const CANVAS_FX = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, { name: v.name, icon: v.icon, custom: true }]));
export const createCanvasFx = (type, el, ctx) => new CanvasEffect(el, ctx, type);
