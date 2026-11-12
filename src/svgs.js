// 生成带颜色的 SVG 图片（data URI），供 tsParticles 的 image 形状使用

const uri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
let gid = 0;
const id = () => "g" + gid++;

export function feather(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 120">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${color}" stop-opacity=".55"/>
<stop offset=".5" stop-color="#fff" stop-opacity=".95"/>
<stop offset="1" stop-color="${color}" stop-opacity=".6"/></linearGradient></defs>
<path d="M20 4 C36 18 40 54 29 92 L21 104 L19 104 L11 92 C1 60 4 22 20 4Z" fill="url(#${g})"/>
<path d="M27 60 L35 56 M28 72 L34 70 M10 48 L5 44 M11 66 L4 64 M25 84 L31 86" stroke="${color}" stroke-opacity=".35" stroke-width="1.2"/>
<path d="M20 6 Q21 60 20 117" stroke="#fff" stroke-opacity=".9" stroke-width="1.4" fill="none"/>
</svg>`),
    width: 40,
    height: 120,
  };
}

export function petal(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50">
<defs><radialGradient id="${g}" cx=".5" cy=".95" r=".9">
<stop offset="0" stop-color="#fff"/><stop offset=".85" stop-color="${color}"/></radialGradient></defs>
<path d="M20 48 C6 36 2 18 12 4 L20 11 L28 4 C38 18 34 36 20 48Z" fill="url(#${g})" fill-opacity=".95"/>
</svg>`),
    width: 40,
    height: 50,
  };
}

export function heart(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8">
<stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="${color}"/></radialGradient></defs>
<path d="M50 86 C20 64 2 46 2 26 C2 12 13 2 27 2 C37 2 45 8 50 16 C55 8 63 2 73 2 C87 2 98 12 98 26 C98 46 80 64 50 86Z" fill="url(#${g})"/>
</svg>`),
    width: 100,
    height: 90,
  };
}

export function bubble(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="${g}" cx=".5" cy=".5" r=".5">
<stop offset=".6" stop-color="${color}" stop-opacity=".05"/>
<stop offset=".92" stop-color="${color}" stop-opacity=".55"/>
<stop offset="1" stop-color="#fff" stop-opacity=".8"/></radialGradient></defs>
<circle cx="50" cy="50" r="48" fill="url(#${g})"/>
<ellipse cx="34" cy="30" rx="12" ry="7" transform="rotate(-35 34 30)" fill="#fff" fill-opacity=".75"/>
<circle cx="70" cy="72" r="4" fill="#fff" fill-opacity=".4"/>
</svg>`),
    width: 100,
    height: 100,
  };
}

export function bokeh(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="${g}" cx=".5" cy=".5" r=".5">
<stop offset="0" stop-color="${color}" stop-opacity=".55"/>
<stop offset=".8" stop-color="${color}" stop-opacity=".75"/>
<stop offset=".93" stop-color="${color}" stop-opacity=".9"/>
<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="50" fill="url(#${g})"/>
</svg>`),
    width: 100,
    height: 100,
  };
}

export function glowDot(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="${g}" cx=".5" cy=".5" r=".5">
<stop offset="0" stop-color="#fff"/>
<stop offset=".15" stop-color="${color}"/>
<stop offset=".45" stop-color="${color}" stop-opacity=".25"/>
<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="50" fill="url(#${g})"/>
</svg>`),
    width: 100,
    height: 100,
  };
}

export function sparkle(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="${g}" cx=".5" cy=".5" r=".5">
<stop offset="0" stop-color="${color}" stop-opacity=".6"/>
<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="30" fill="url(#${g})"/>
<path d="M50 0 C53 40 60 47 100 50 C60 53 53 60 50 100 C47 60 40 53 0 50 C40 47 47 40 50 0Z" fill="${color}"/>
<path d="M50 22 C51.5 45 55 48.5 78 50 C55 51.5 51.5 55 50 78 C48.5 55 45 51.5 22 50 C45 48.5 48.5 45 50 22Z" fill="#fff"/>
</svg>`),
    width: 100,
    height: 100,
  };
}

export function butterfly(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient></defs>
<g fill="url(#${g})" fill-opacity=".92">
<path d="M48 38 C36 6 8 0 4 12 C0 26 22 38 48 40Z"/>
<path d="M52 38 C64 6 92 0 96 12 C100 26 78 38 52 40Z"/>
<path d="M48 42 C30 44 14 56 22 68 C30 78 44 62 48 44Z"/>
<path d="M52 42 C70 44 86 56 78 68 C70 78 56 62 52 44Z"/></g>
<rect x="48.5" y="28" width="3" height="32" rx="1.5" fill="${color}" fill-opacity=".9"/>
<path d="M50 30 Q44 16 40 14 M50 30 Q56 16 60 14" stroke="${color}" fill="none" stroke-width="1.2"/>
</svg>`),
    width: 100,
    height: 80,
  };
}

export function snowflake(color) {
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100">
<g stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none">
${[0, 60, 120]
  .map(
    (r) => `<g transform="rotate(${r})"><path d="M0 -46 V46"/><path d="M-10 -36 L0 -26 L10 -36 M-10 36 L0 26 L10 36"/></g>`
  )
  .join("")}
</g></svg>`),
    width: 100,
    height: 100,
  };
}
