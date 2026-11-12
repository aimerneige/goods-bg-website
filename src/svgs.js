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

export function balloon(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 104">
<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".75">
<stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".3" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".85"/></radialGradient></defs>
<path d="M30 4 C48 4 56 20 56 34 C56 52 42 66 30 70 C18 66 4 52 4 34 C4 20 12 4 30 4Z" fill="url(#${g})"/>
<path d="M26.5 74 L33.5 74 L30 69Z" fill="${color}"/>
<path d="M30 74 Q24 84 30 92 T30 104" stroke="#fff" stroke-opacity=".7" stroke-width="1" fill="none"/>
<ellipse cx="19" cy="20" rx="5" ry="9" transform="rotate(25 19 20)" fill="#fff" fill-opacity=".45"/>
</svg>`),
    width: 60,
    height: 104,
  };
}

export function diamond(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="${color}"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient></defs>
<path d="M20 5 L80 5 L98 28 L50 78 L2 28Z" fill="url(#${g})" fill-opacity=".9"/>
<path d="M35 28 L50 5 L65 28Z" fill="#fff" fill-opacity=".55"/>
<path d="M2 28 L35 28 L50 78Z" fill="${color}" fill-opacity=".45"/>
<path d="M65 28 L98 28 L50 78Z" fill="#fff" fill-opacity=".3"/>
<path d="M2 28 H98 M20 5 L35 28 L50 5 L65 28 L80 5 M35 28 L50 78 L65 28" stroke="#fff" stroke-opacity=".85" stroke-width="1.5" fill="none"/>
</svg>`),
    width: 100,
    height: 80,
  };
}

export function maple(color) {
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100">
<path d="M0 -46 L8 -26 L20 -32 L16 -12 L36 -20 L30 -6 L44 0 L22 10 L26 22 L6 16 L4 38 L-4 38 L-6 16 L-26 22 L-22 10 L-44 0 L-30 -6 L-36 -20 L-16 -12 L-20 -32 L-8 -26Z" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>
<path d="M0 46 L0 -30 M0 0 L-26 -14 M0 0 L26 -14 M0 10 L-20 14 M0 10 L20 14" stroke="#000" stroke-opacity=".18" stroke-width="1.5" fill="none"/>
</svg>`),
    width: 100,
    height: 100,
  };
}

export function dandelion(color) {
  const rays = [];
  for (let a = -170; a <= -10; a += 10) {
    const r = (a * Math.PI) / 180, x = Math.cos(r) * 36, y = Math.sin(r) * 36;
    rays.push(`<path d="M0 0 L${x.toFixed(1)} ${y.toFixed(1)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6"/>`);
  }
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 100">
<g stroke="${color}" stroke-opacity=".85" stroke-width="0.9" fill="${color}">${rays.join("")}</g>
<path d="M0 0 L0 50" stroke="${color}" stroke-width="1.2"/>
<ellipse cx="0" cy="54" rx="1.8" ry="5" fill="${color}" fill-opacity=".9"/>
</svg>`),
    width: 80,
    height: 100,
  };
}

export function clover(color) {
  const g = id();
  const leaf = "M0 0 C-4 -8 -18 -10 -18 -22 C-18 -30 -8 -34 0 -26 C8 -34 18 -30 18 -22 C18 -10 4 -8 0 0Z";
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 90">
<defs><radialGradient id="${g}" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".6" stop-color="${color}"/></radialGradient></defs>
<path d="M0 0 Q4 24 -2 46" stroke="${color}" stroke-width="2.5" fill="none"/>
${[45, 135, 225, 315].map((r) => `<path d="${leaf}" transform="rotate(${r})" fill="url(#${g})"/>`).join("")}
</svg>`),
    width: 80,
    height: 90,
  };
}

export function bow(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 72">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".4" stop-color="${color}"/></linearGradient></defs>
<g fill="url(#${g})" stroke="${color}" stroke-width="1.5">
<path d="M46 40 L32 68 L40 64 L46 70 L50 42Z"/><path d="M54 40 L68 68 L60 64 L54 70 L50 42Z"/>
<path d="M50 32 C36 10 8 4 5 18 C2 34 26 44 50 36Z"/><path d="M50 32 C64 10 92 4 95 18 C98 34 74 44 50 36Z"/></g>
<rect x="43" y="27" width="14" height="15" rx="5" fill="${color}" stroke="#fff" stroke-opacity=".5"/>
</svg>`),
    width: 100,
    height: 72,
  };
}

export function crown(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".8"/></linearGradient></defs>
<path d="M10 66 L6 22 L30 44 L50 10 L70 44 L94 22 L90 66Z" fill="url(#${g})" stroke="#fff" stroke-opacity=".6" stroke-width="1.5" stroke-linejoin="round"/>
<rect x="9" y="62" width="82" height="12" rx="3" fill="${color}" stroke="#fff" stroke-opacity=".6"/>
<circle cx="6" cy="20" r="5" fill="#fff"/><circle cx="50" cy="8" r="6" fill="#fff"/><circle cx="94" cy="20" r="5" fill="#fff"/>
<circle cx="30" cy="68" r="3.5" fill="#ff8fb8"/><circle cx="50" cy="68" r="3.5" fill="#8fd6ff"/><circle cx="70" cy="68" r="3.5" fill="#ff8fb8"/>
</svg>`),
    width: 100,
    height: 80,
  };
}

export function moon(color) {
  const g = id();
  return {
    src: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><radialGradient id="${g}" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="50" fill="url(#${g})"/>
<path d="M56 18 A32 32 0 1 0 82 66 A26 26 0 1 1 56 18Z" fill="${color}"/>
<path d="M76 22 L78 28 L84 30 L78 32 L76 38 L74 32 L68 30 L74 28Z" fill="#fff"/>
</svg>`),
    width: 100,
    height: 100,
  };
}
