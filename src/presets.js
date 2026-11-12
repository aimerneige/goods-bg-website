// 配色方案：bg 背景 / c1 主色 / c2 辅色 / c3 点缀
export const PALETTES = [
  { name: "梦幻粉", bg: "#1c0f22", c1: "#ff8fc8", c2: "#b38cff", c3: "#ffe3f1" },
  { name: "星空蓝紫", bg: "#060a1e", c1: "#6aa8ff", c2: "#a77bff", c3: "#ffffff" },
  { name: "香槟金", bg: "#140e06", c1: "#f5c46b", c2: "#ffdca0", c3: "#fff6e0" },
  { name: "薄荷海", bg: "#05171b", c1: "#5ee6c8", c2: "#7fc4ff", c3: "#eafff9" },
  { name: "暗夜紫", bg: "#0b0614", c1: "#c77dff", c2: "#7b2cbf", c3: "#f0d0ff" },
  { name: "玫瑰红", bg: "#1a0508", c1: "#ff4d6d", c2: "#ff9a8b", c3: "#ffd6a5" },
  { name: "森林", bg: "#06120a", c1: "#a8e063", c2: "#3fae6a", c3: "#fffbd1" },
  { name: "日落", bg: "#1b0b14", c1: "#ff8a5c", c2: "#ff5e9c", c3: "#ffd36e" },
  { name: "冰雪", bg: "#0a1424", c1: "#9fd3ff", c2: "#d6e8ff", c3: "#ffffff" },
  { name: "彩虹糖", bg: "#0c0b16", c1: "#ff6b9a", c2: "#4ecdc4", c3: "#ffe66d" },
  { name: "樱花白", bg: "#fff1f5", c1: "#ffb3cf", c2: "#ffd9e6", c3: "#ffffff" },
  { name: "天空白", bg: "#e3f2ff", c1: "#8fcbff", c2: "#ffffff", c3: "#ffd6f0" },
  { name: "奶油", bg: "#fff7e8", c1: "#ffd59e", c2: "#ffc2c2", c3: "#ffffff" },
  { name: "纯黑", bg: "#000000", c1: "#ffffff", c2: "#9a9a9a", c3: "#ffffff" },
];

export const BG_MODES = {
  solid: "纯色",
  gradient: "流体渐变",
  aurora: "极光",
  rays: "圣光光束",
  lines: "流动光线",
  silk: "丝绸流光",
  nebula: "星云",
  bokeh: "光斑散景",
  laser: "镭射幻彩",
  caustics: "水波光影",
  spotlight: "舞台聚光",
  halo: "光环",
};

// 一键场景
export const SCENES = [
  { name: "梦幻星空", palette: "星空蓝紫", bg: "nebula", overlays: ["stars", "meteors", "sparkle"] },
  { name: "天使羽毛", palette: "香槟金", bg: "rays", overlays: ["feathers", "sparkle", "glitter"] },
  { name: "樱花物语", palette: "梦幻粉", bg: "gradient", overlays: ["petals", "bokeh"] },
  { name: "圣光降临", palette: "香槟金", bg: "rays", overlays: ["glitter", "sparkle", "sweep"] },
  { name: "镭射幻彩", palette: "暗夜紫", bg: "laser", overlays: ["sparkle"] },
  { name: "极光之夜", palette: "薄荷海", bg: "aurora", overlays: ["stars", "snow"] },
  { name: "冬日雪景", palette: "冰雪", bg: "spotlight", overlays: ["snow", "bokeh"] },
  { name: "心动告白", palette: "玫瑰红", bg: "bokeh", overlays: ["hearts", "sparkle"] },
  { name: "萤火森林", palette: "森林", bg: "gradient", overlays: ["fireflies", "bokeh"] },
  { name: "海底泡泡", palette: "薄荷海", bg: "caustics", overlays: ["bubbles"] },
  { name: "生日派对", palette: "彩虹糖", bg: "spotlight", overlays: ["confetti", "starShapes"] },
  { name: "流光溢彩", palette: "星空蓝紫", bg: "lines", overlays: ["sweep", "stars"] },
  { name: "丝绸质感", palette: "香槟金", bg: "silk", overlays: ["glitter"] },
  { name: "偶像舞台", palette: "梦幻粉", bg: "spotlight", overlays: ["glitter", "notes", "sparkle"] },
  { name: "蝶舞花园", palette: "日落", bg: "gradient", overlays: ["butterflies", "petals"] },
  { name: "神圣光环", palette: "暗夜紫", bg: "halo", overlays: ["feathers", "sparkle"] },
  { name: "白色羽毛", palette: "天空白", bg: "gradient", overlays: ["feathers", "sparkle"] },
  { name: "奶油甜心", palette: "奶油", bg: "bokeh", overlays: ["hearts", "starShapes"] },
];
