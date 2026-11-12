// WebGL 全屏片元着色器背景。每种背景模式是一段 effect() 函数体。

const HEADER = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC1, uC2, uC3, uBg;
uniform float uInt;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}
// 闪烁星点
vec3 stars(vec2 uv, float t, float amount){
  vec3 col = vec3(0.0);
  float asp = uRes.x/uRes.y;
  for (int i = 0; i < 2; i++){
    float fi = float(i);
    float sc = 90.0 + fi*140.0;
    vec2 g = uv*vec2(asp,1.0)*sc + fi*31.7;
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float h = hash(id + fi*17.0);
    float th = 1.0 - amount;
    if (h > th){
      vec2 o = vec2(hash(id+3.1), hash(id+7.7)) - 0.5;
      float d = length(f - o*0.6);
      float tw = 0.35 + 0.65*(0.5+0.5*sin(t*(1.0+h*3.0) + h*60.0));
      col += vec3(1.0) * smoothstep(0.14, 0.0, d) * tw;
    }
  }
  return col;
}
`;

const MODES = {
  solid: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){ return uBg; }`,

  gradient: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec2 q = p;
  q += 0.35*vec2(fbm(q*1.8 + t*0.07), fbm(q*1.8 - t*0.06 + 4.0)) - 0.17;
  vec3 col = uBg;
  vec2 a = vec2(sin(t*0.13)*0.6, cos(t*0.11)*0.32);
  vec2 b = vec2(cos(t*0.09+2.0)*0.65, sin(t*0.12+1.0)*0.32);
  vec2 c = vec2(sin(t*0.07+4.0)*0.5, cos(t*0.10+3.0)*0.38);
  col = mix(col, uC1, exp(-dot(q-a,q-a)*3.2)*0.9);
  col = mix(col, uC2, exp(-dot(q-b,q-b)*3.2)*0.9);
  col = mix(col, uC3, exp(-dot(q-c,q-c)*5.0)*0.55);
  return col;
}`,

  aurora: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec3 col = uBg * (1.15 - uv.y*0.4);
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float x = p.x*(1.1 + fi*0.3) + fi*1.7;
    float center = 0.02 + fi*0.09 + 0.22*(fbm(vec2(x*1.1 + t*0.07, fi*3.0)) - 0.5) + 0.05*sin(x*2.0 + t*0.3 + fi);
    float d = p.y - center;
    float curtain = exp(-max(d,0.0)*(4.0 + fi*2.0)) * smoothstep(-0.03, 0.05, d);
    float streak = 0.35 + 0.65*fbm(vec2(x*9.0 + t*0.25, fi*5.0));
    vec3 ac = mix(uC1, uC2, smoothstep(0.0, 0.3, d));
    ac = mix(ac, uC3, 0.25*(1.0-streak));
    col += ac * curtain * streak * (0.85 - fi*0.2);
  }
  col += stars(uv, t, 0.04) * smoothstep(0.2, 0.9, uv.y) * 0.8;
  return col;
}`,

  rays: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec2 src = vec2(0.08*sin(t*0.1), 0.72);
  vec2 d = p - src;
  float ang = atan(d.x, -d.y);
  float dist = length(d);
  float r = 0.0;
  r += pow(0.5+0.5*sin(ang*13.0 + t*0.35), 3.0)*0.5;
  r += pow(0.5+0.5*sin(ang*21.0 - t*0.27 + 1.0), 4.0)*0.4;
  r += pow(0.5+0.5*sin(ang*7.0 + t*0.18 + 2.0), 2.0)*0.45;
  r *= 0.6 + 0.4*fbm(vec2(ang*6.0, t*0.15));
  r *= smoothstep(1.3, 0.1, abs(ang));
  float fall = exp(-dist*1.2);
  vec3 col = uBg + mix(uC1, uC3, fall) * r * fall * 1.1;
  col += uC3 * exp(-dist*5.0) * 0.9;
  col += uC2 * 0.18 * fbm(p*3.0 + t*0.05) * fall;
  return col;
}`,

  lines: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec3 col = uBg;
  for (int i = 0; i < 8; i++){
    float fi = float(i);
    float y = 0.24*sin(p.x*(1.4 + fi*0.22) + t*(0.35 + fi*0.06) + fi*1.3) * (0.6 + 0.4*sin(t*0.2 + fi))
            + 0.07*sin(p.x*4.0 - t*0.55 + fi*2.0) + (fi - 3.5)*0.025;
    float dd = abs(p.y - y);
    vec3 lc = mix(uC1, uC2, fract(fi*0.37)*1.6);
    lc = mix(lc, uC3, step(6.5, fi));
    float fade = smoothstep(1.0, 0.2, abs(p.x)/(uRes.x/uRes.y));
    col += lc * (0.0022/(dd + 0.0018)) * 0.32 * (0.5 + 0.5*fade);
    col += lc * exp(-dd*25.0) * 0.06;
  }
  return col;
}`,

  silk: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec3 col = uBg * (0.85 + 0.3*uv.y);
  for (int i = 0; i < 5; i++){
    float fi = float(i);
    float y = 0.28*sin(p.x*1.1 + t*0.15 + fi*0.9) + 0.09*sin(p.x*2.6 - t*0.2 + fi*2.0) + (fi - 2.0)*0.13;
    float d = p.y - y;
    float band = smoothstep(0.2, 0.0, abs(d));
    float fold = 0.5 + 0.5*cos(d*16.0 + sin(p.x*2.0 + t*0.25 + fi)*2.0);
    float spec = pow(smoothstep(0.07, 0.0, abs(d - 0.04*sin(p.x*3.0 + t*0.3 + fi))), 2.0);
    vec3 c = mix(uC1, uC2, fi/4.0);
    col = mix(col, c*(0.45 + 0.55*fold), band*0.6);
    col += uC3 * spec * band * 0.3;
  }
  return col;
}`,

  nebula: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec2 q = p*1.6;
  vec2 w = vec2(fbm(q + t*0.02), fbm(q + vec2(5.2,1.3) - t*0.015));
  float n = fbm(q + 2.0*w + t*0.01);
  vec3 col = uBg;
  col = mix(col, uC2*0.75, smoothstep(0.35, 0.8, n));
  col = mix(col, uC1, smoothstep(0.55, 0.95, n)*0.85*w.x);
  col += uC3 * pow(smoothstep(0.6, 1.0, n), 3.0) * 0.45;
  col += stars(uv, t, 0.035);
  return col;
}`,

  bokeh: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec3 col = mix(uBg, uBg*0.7 + uC2*0.12, uv.y);
  for (int L = 0; L < 3; L++){
    float fl = float(L);
    float sc = 2.5 + fl*2.0;
    vec2 g = p*sc + vec2(sin(t*0.1 + fl)*0.3, -t*(0.04 + fl*0.025)*sc) + fl*7.3;
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float h = hash(id + fl*13.0);
    vec2 o = vec2(hash(id+1.3), hash(id+2.9)) - 0.5;
    float r = 0.12 + 0.2*h;
    float d = length(f - o*0.3);
    float blur = 0.015 + (2.0 - fl)*0.06;
    float a = smoothstep(r, r - blur, d) * (0.3 + 0.4*hash(id+5.0));
    a *= step(0.3, h);
    a *= 0.75 + 0.5*smoothstep(r - 0.05, r, d);
    vec3 bc = mix(uC1, uC2, hash(id+9.0));
    bc = mix(bc, uC3, step(0.8, hash(id+11.0)));
    float tw = 0.7 + 0.3*sin(t*0.5 + h*40.0);
    col = mix(col, bc*1.15, clamp(a * tw * (0.55 + fl*0.1), 0.0, 1.0));
  }
  return col;
}`,

  laser: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec2 q = p*1.2;
  float n = fbm(q*1.5 + vec2(t*0.04, t*0.03));
  float n2 = fbm(q*3.0 - t*0.05 + n);
  float h = n*1.8 + n2*0.8 + (q.x + q.y)*0.4 + t*0.05;
  vec3 rb = 0.5 + 0.5*cos(6.28318*(h + vec3(0.0, 0.33, 0.67)));
  vec3 tint = mix(uC1, uC2, n2);
  vec3 col = mix(rb, tint, 0.45);
  col = mix(uBg, col, 0.85);
  col += pow(max(0.0, sin(h*12.0)), 12.0) * 0.25 * uC3;
  vec2 g = gl_FragCoord.xy/2.5;
  float s = hash(floor(g));
  float tw = pow(max(0.0, sin(t*3.0 + s*80.0)), 20.0);
  col += step(0.985, s) * tw * 0.9;
  return col;
}`,

  caustics: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  float time = t*0.5 + 23.0;
  vec2 pp = uv*vec2(uRes.x/uRes.y, 1.0)*6.28318*0.9 - 250.0;
  vec2 i = pp;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 5; n++){
    float tt = time * (1.0 - (3.5/float(n+1)));
    i = pp + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0/length(vec2(pp.x/(sin(i.x+tt)/inten), pp.y/(cos(i.y+tt)/inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  float v = pow(abs(c), 8.0);
  vec3 base = mix(uBg, uBg*0.5 + uC1*0.35, uv.y);
  vec3 col = base + v*mix(uC3, uC2, 0.3)*0.9;
  return col;
}`,

  spotlight: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec3 col = uBg*0.8;
  vec2 fc = p - vec2(0.0, -0.42);
  col += uC1 * exp(-dot(fc*vec2(1.0,3.0), fc*vec2(1.0,3.0))*5.0) * 0.9;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    vec2 src = vec2((fi-1.0)*0.6, 0.62);
    float sw = 0.28*sin(t*0.35 + fi*2.1);
    vec2 dir = normalize(vec2(-(fi-1.0)*0.5 + sw, -1.0));
    vec2 d = p - src;
    float along = dot(d, dir);
    float perp = abs(dir.x*d.y - dir.y*d.x);
    float w = 0.03 + along*0.2;
    float b = smoothstep(w, w*0.15, perp) * step(0.0, along) * exp(-along*0.8);
    vec3 bc = uC1;
    if (i == 1) bc = uC3;
    if (i == 2) bc = uC2;
    col += bc * b * 0.5 * (0.85 + 0.15*fbm(p*8.0 + t*0.2));
  }
  col += uC2 * exp(-length(p)*3.0) * 0.22;
  return col;
}`,

  halo: /* glsl */ `
vec3 effect(vec2 uv, vec2 p, float t){
  vec2 c = p - vec2(0.0, -0.03);
  float r = length(c);
  vec3 col = uBg;
  col += uC1 * exp(-r*2.6) * 0.65;
  float rings = 0.5 + 0.5*sin(r*16.0 - t*0.9);
  col += mix(uC2, uC3, 0.5 + 0.5*sin(r*6.0 - t*0.3)) * pow(rings, 3.0) * exp(-r*2.6) * 0.3;
  float a = atan(c.y, c.x);
  float rays = pow(0.5 + 0.5*sin(a*9.0 + t*0.15), 4.0) * (0.6 + 0.4*fbm(vec2(a*3.0, t*0.2)));
  col += uC3 * rays * exp(-r*3.0) * 0.22;
  col += uC3 * exp(-r*12.0) * 0.5;
  return col;
}`,
};

const FOOTER = /* glsl */ `
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec3 col = effect(uv, p, uTime) * uInt;
  // 轻微抖动，避免渐变色带
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export class ShaderBackground {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error("WebGL 不可用");
    this.gl = gl;
    this.programs = {};
    this.mode = "gradient";
    this.colors = { bg: "#000000", c1: "#ffffff", c2: "#ffffff", c3: "#ffffff" };
    this.speed = 1;
    this.intensity = 1;
    this.quality = 0.75;
    this.time = Math.random() * 100;
    this.paused = false;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    this._last = performance.now();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  static get modes() {
    return Object.keys(MODES);
  }

  _program(mode) {
    if (this.programs[mode]) return this.programs[mode];
    const gl = this.gl;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(`Shader(${mode}) 编译失败: ${gl.getShaderInfoLog(s)}`);
      }
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, HEADER + MODES[mode] + FOOTER));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    const u = {};
    for (const n of ["uRes", "uTime", "uC1", "uC2", "uC3", "uBg", "uInt"]) u[n] = gl.getUniformLocation(prog, n);
    const entry = { prog, u, a: gl.getAttribLocation(prog, "a") };
    this.programs[mode] = entry;
    return entry;
  }

  setMode(mode) {
    if (MODES[mode]) this.mode = mode;
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(window.innerWidth * dpr * this.quality));
    const h = Math.max(1, Math.round(window.innerHeight * dpr * this.quality));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  _loop(now) {
    requestAnimationFrame(this._loop);
    const dt = Math.min((now - this._last) / 1000, 0.1);
    this._last = now;
    if (this.paused) return;
    this.time += dt * this.speed;
    this.render();
  }

  render() {
    this._resize();
    const gl = this.gl;
    const { prog, u, a } = this._program(this.mode);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(prog);
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform3fv(u.uC1, hexToRgb(this.colors.c1));
    gl.uniform3fv(u.uC2, hexToRgb(this.colors.c2));
    gl.uniform3fv(u.uC3, hexToRgb(this.colors.c3));
    gl.uniform3fv(u.uBg, hexToRgb(this.colors.bg));
    gl.uniform1f(u.uInt, this.intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
