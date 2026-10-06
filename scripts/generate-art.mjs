/**
 * MOTZA — gerador de imagens editoriais (placeholders de campanha).
 *
 * Enquanto as fotografias reais do DROP 01 não existem, este script produz um
 * conjunto coeso de imagens (montanha / cidade / concreto, contraste alto,
 * granulação, modelo em silhueta usando camiseta oversized) em /public/images.
 * Para trocar por fotos reais basta substituir os arquivos mantendo os nomes
 * (ou editar src/data/images.ts).
 *
 * Uso: npm run gen:art
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/images");
fs.mkdirSync(path.join(OUT, "products"), { recursive: true });

/* ------------------------------------------------------------------ utils */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
const shade = (c, t) => mix(c, "#000000", t);
const lift = (c, t) => mix(c, "#ffffff", t);

const INK = "#0B0B0B";
const BONE = "#E9E3D6";
const RED = "#B51E27";
const BROWN = "#5A4030";

/* ------------------------------------------------------------- finishing */
async function save(svg, W, H, file, { mono = false, grain = 26, q = 78 } = {}) {
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const noise = await sharp({
    create: { width: W, height: H, channels: 3, noise: { type: "gaussian", mean: 128, sigma: grain } },
  }).png().toBuffer();
  let p = sharp(base).composite([{ input: noise, blend: "soft-light" }]);
  if (mono) p = sharp(await p.png().toBuffer()).grayscale().linear(1.2, -14);
  await p.jpeg({ quality: q, mozjpeg: true }).toFile(path.join(OUT, file));
  console.log("✓", file);
}

const svgWrap = (W, H, body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
${defs}
<filter id="dist" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -4.3" result="m"/>
  <feComposite in="SourceGraphic" in2="m" operator="in"/>
</filter>
<filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur30"><feGaussianBlur stdDeviation="30"/></filter>
<radialGradient id="vig" cx="50%" cy="48%" r="75%">
  <stop offset="55%" stop-color="#000" stop-opacity="0"/>
  <stop offset="100%" stop-color="#000" stop-opacity=".62"/>
</radialGradient>
</defs>
${body}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;

/* --------------------------------------------------------------- tee shape */
const teePath = (back) =>
  `M-62 146 Q0 ${back ? 162 : 208} 62 146 L178 176 L246 318 L170 350 L156 322 L166 520 Q0 534 -166 520 L-156 322 L-170 350 L-246 318 L-178 176 Z`;

/** Print graphics in tee-local coordinates (x centred, y ≈ 200–480). */
const wm = (x, y, size, fill, { ls = 2, anchor = "middle", txt = "MOTZA", extra = "" } = {}) =>
  `<text x="${x}" y="${y}" font-family="Anton" font-size="${size}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}" ${extra}>${txt}</text>`;
const small = (x, y, size, fill, txt, ls = 4, anchor = "middle") =>
  `<text x="${x}" y="${y}" font-family="Inter" font-weight="700" font-size="${size}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}">${txt}</text>`;

function mountainGlyph(cx, cy, w, h, fill) {
  const x0 = cx - w / 2;
  return `<path d="M${x0} ${cy} L${cx - w * 0.18} ${cy - h * 0.7} L${cx - w * 0.05} ${cy - h * 0.45} L${cx + w * 0.12} ${cy - h} L${cx + w / 2} ${cy} Z" fill="${fill}"/>`;
}

function vine(cx, y0, y1, color, r) {
  const n = 70, pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([cx + 34 * Math.sin(t * Math.PI * 3.2) + 10 * Math.sin(t * 17), y0 + (y1 - y0) * t]);
  }
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  pts.forEach((p, i) => i && (d += ` L${p[0].toFixed(1)} ${p[1].toFixed(1)}`));
  let thorns = "";
  for (let i = 3; i < n - 1; i += 3) {
    const [x, y] = pts[i], [x2, y2] = pts[i + 1];
    const dx = x2 - x, dy = y2 - y, len = Math.hypot(dx, dy) || 1;
    const side = (i / 3) % 2 ? 1 : -1;
    const nx = (-dy / len) * side, ny = (dx / len) * side;
    const L = 12 + r() * 14;
    thorns += `<path d="M${x - dx * 0.4} ${y - dy * 0.4} L${x + nx * L + dx * 0.8} ${y + ny * L + dy * 0.8} L${x + dx * 1.6} ${y + dy * 1.6} Z" fill="${color}"/>`;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round"/>${thorns}`;
}

const PRODUCTS = {
  "motza-clean": {
    tee: "#141414", bg: "warm", scene: "mountain-dawn",
    front: () => wm(-84, 226, 22, BONE, { ls: 3, anchor: "middle" }),
    back: () => wm(0, 192, 18, BONE, { ls: 4 }),
    detail: () => wm(0, 330, 70, BONE, { ls: 8 }),
  },
  "motza-bold": {
    tee: "#101010", bg: "warm", scene: "city-dusk",
    front: () => wm(-84, 226, 22, BONE, { ls: 3 }),
    back: () => `<g filter="url(#dist)">${wm(0, 366, 156, BONE, { ls: 4, extra: 'textLength="272" lengthAdjust="spacingAndGlyphs"' })}</g>
      ${small(0, 404, 9, BONE, "DISCIPLINA CONSTRÓI LIBERDADE.", 2)}`,
    detail: () => `<g filter="url(#dist)">${wm(0, 366, 156, BONE, { ls: 4, extra: 'textLength="272" lengthAdjust="spacingAndGlyphs"' })}</g>`,
  },
  "arte-vintage": {
    tee: BONE, bg: "dark", scene: "wall",
    front: () => small(-84, 226, 11, INK, "ARTE VINTAGE", 3),
    back: () => `<g filter="url(#dist)">
        <circle cx="0" cy="285" r="86" fill="${RED}" opacity=".9"/>
        ${mountainGlyph(0, 345, 250, 130, INK)}
        <rect x="-122" y="212" width="244" height="168" fill="none" stroke="${INK}" stroke-width="4"/>
        ${wm(0, 420, 38, INK, { ls: 10, txt: "ARTE VINTAGE" })}
        ${small(0, 444, 10, INK, "EST. 2024 — MOTZA — BRASIL", 5)}
      </g>`,
    detail: () => `<g filter="url(#dist)">
        <circle cx="0" cy="285" r="86" fill="${RED}" opacity=".9"/>
        ${mountainGlyph(0, 345, 250, 130, INK)}
        <rect x="-122" y="212" width="244" height="168" fill="none" stroke="${INK}" stroke-width="4"/></g>`,
  },
  "motza-red": {
    tee: "#0f0f0f", bg: "warm", scene: "mountain-dusk",
    front: () => `<circle cx="-84" cy="232" r="14" fill="${RED}"/>`,
    back: () => `<circle cx="0" cy="300" r="112" fill="${RED}"/>
        ${wm(0, 360, 150, BONE, { ls: 2, extra: 'textLength="270" lengthAdjust="spacingAndGlyphs"' })}
        <rect x="-124" y="428" width="248" height="3" fill="${RED}"/>
        ${small(0, 452, 8.5, RED, "DISCIPLINA · MOVIMENTO · LIBERDADE", 2)}`,
    detail: () => `<circle cx="0" cy="300" r="112" fill="${RED}"/>
        ${wm(0, 360, 150, BONE, { ls: 2, extra: 'textLength="270" lengthAdjust="spacingAndGlyphs"' })}`,
  },
  montanha: {
    tee: "#E3DCCB", bg: "dark", scene: "mountain-mist",
    front: () => mountainGlyph(-84, 238, 40, 22, INK),
    back: () => `<g>
        <circle cx="52" cy="238" r="26" fill="none" stroke="${INK}" stroke-width="3"/>
        <path d="M-130 400 L-70 270 L-44 320 L10 230 L130 400 Z" fill="${INK}"/>
        <path d="M-130 400 L-100 330 L-70 270 L-40 340 L10 230 L50 300 L90 340 L130 400" fill="none" stroke="${BONE}" stroke-width="2" opacity=".5"/>
        ${wm(0, 450, 44, INK, { ls: 14, txt: "LIBERDADE" })}</g>`,
    detail: () => `<g><circle cx="52" cy="238" r="26" fill="none" stroke="${INK}" stroke-width="3"/>
        <path d="M-130 400 L-70 270 L-44 320 L10 230 L130 400 Z" fill="${INK}"/></g>`,
  },
  "motza-heritage": {
    tee: BROWN, bg: "warm", scene: "wall",
    front: () => wm(-84, 226, 20, BONE, { ls: 3 }),
    back: () => `<path id="arcH" d="M-104 330 A104 104 0 0 1 104 330" fill="none"/>
        <text font-family="Anton" font-size="40" letter-spacing="9" fill="${BONE}" text-anchor="middle"><textPath href="#arcH" startOffset="50%">MOTZA HERITAGE</textPath></text>
        <circle cx="0" cy="330" r="60" fill="none" stroke="${BONE}" stroke-width="3"/>
        ${mountainGlyph(0, 352, 80, 50, BONE)}
        ${small(0, 430, 12, BONE, "EST. 2024 · BRASIL", 6)}`,
    detail: () => `<path id="arcH2" d="M-104 330 A104 104 0 0 1 104 330" fill="none"/>
        <text font-family="Anton" font-size="40" letter-spacing="9" fill="${BONE}" text-anchor="middle"><textPath href="#arcH2" startOffset="50%">MOTZA HERITAGE</textPath></text>
        <circle cx="0" cy="330" r="60" fill="none" stroke="${BONE}" stroke-width="3"/>
        ${mountainGlyph(0, 352, 80, 50, BONE)}`,
  },
  thorn: {
    tee: "#121212", bg: "warm", scene: "mountain-mist",
    front: () => vine(-84, 214, 262, BONE, rng(4)),
    back: () => `${vine(0, 196, 480, BONE, rng(5))}<g transform="translate(0 330)">${vine(-60, -120, 120, RED, rng(9))}</g>
        ${wm(78, 330, 30, BONE, { ls: 8, txt: "THORN", extra: 'transform="rotate(90 78 330)"' })}`,
    detail: () => `${vine(0, 196, 480, BONE, rng(5))}<g transform="translate(0 330)">${vine(-60, -120, 120, RED, rng(9))}</g>`,
  },
  disciplina: {
    tee: "#E7E0CF", bg: "dark", scene: "city-dusk",
    front: () => wm(-84, 226, 20, INK, { ls: 3 }),
    back: () => `${wm(0, 262, 70, INK, { ls: 4, txt: "DISCIPLINA", extra: 'textLength="250" lengthAdjust="spacingAndGlyphs"' })}
        ${wm(0, 334, 70, INK, { ls: 4, txt: "CONSTRÓI", extra: 'textLength="250" lengthAdjust="spacingAndGlyphs"' })}
        ${wm(0, 406, 70, RED, { ls: 4, txt: "LIBERDADE.", extra: 'textLength="250" lengthAdjust="spacingAndGlyphs"' })}
        ${small(0, 440, 8, INK, "FAZER MESMO QUANDO NINGUÉM ESTÁ OLHANDO.", 1.4)}`,
    detail: () => `${wm(0, 300, 90, INK, { ls: 4, txt: "DISCIPLINA", extra: 'textLength="260" lengthAdjust="spacingAndGlyphs"' })}
        ${wm(0, 390, 90, RED, { ls: 4, txt: "CONSTRÓI", extra: 'textLength="260" lengthAdjust="spacingAndGlyphs"' })}`,
  },
};

/* ------------------------------------------------------------------ figure */
let figId = 0;
function figure({ x, baseY, h, tee, graphic = "", back = true, flip = false, pants = "#151618", skin = "#24171a", lightDir = 1 }) {
  const id = ++figId;
  const s = h / 1000;
  const teeHi = lift(tee, 0.18), teeLo = shade(tee, 0.35);
  const lx = lightDir > 0 ? 0 : 1, rx = lightDir > 0 ? 1 : 0;
  const leg = (sign) => `<path d="M${sign * 150} 480 L${sign * 8} 480 L${sign * 30} 958 L${sign * 172} 958 Z" fill="url(#pg${id})"/>`;
  const arm = (sign) => `<path d="M${sign * 236} 322 L${sign * 170} 350 L${sign * 188} 565 Q${sign * 206} 585 ${sign * 232} 565 Z" fill="${skin}"/>`;
  return `<g transform="translate(${x} ${baseY - h}) scale(${flip ? -s : s} ${s})">
  <defs>
    <linearGradient id="tg${id}" x1="${lx}" x2="${rx}" y1="0" y2=".3"><stop offset="0" stop-color="${teeHi}"/><stop offset=".55" stop-color="${tee}"/><stop offset="1" stop-color="${teeLo}"/></linearGradient>
    <linearGradient id="pg${id}" x1="${lx}" x2="${rx}"><stop offset="0" stop-color="${lift(pants, 0.1)}"/><stop offset="1" stop-color="${shade(pants, 0.5)}"/></linearGradient>
    <clipPath id="tc${id}"><path d="${teePath(back)}"/></clipPath>
  </defs>
  <ellipse cx="0" cy="982" rx="230" ry="26" fill="#000" opacity=".5" filter="url(#blur8)"/>
  ${leg(-1)}${leg(1)}
  <path d="M-172 940 L-30 940 L-26 998 Q-100 1006 -176 998 Z" fill="${BONE}"/>
  <path d="M172 940 L30 940 L26 998 Q100 1006 176 998 Z" fill="${BONE}"/>
  <path d="M-176 984 L-26 984 L-26 998 Q-100 1006 -176 998Z M176 984 L26 984 L26 998 Q100 1006 176 998Z" fill="#000" opacity=".35"/>
  ${arm(-1)}${arm(1)}
  <rect x="-20" y="118" width="40" height="52" fill="${skin}"/>
  <ellipse cx="0" cy="68" rx="46" ry="58" fill="${skin}"/>
  <path d="M-48 62 Q-46 6 0 6 Q46 6 48 62 Q30 30 0 32 Q-30 30 -48 62Z" fill="#0c0908"/>
  <path d="${teePath(back)}" fill="url(#tg${id})"/>
  <g clip-path="url(#tc${id})">
    <path d="M-120 330 Q-60 380 -150 470 M110 300 Q60 380 130 480 M-30 290 Q10 400 -20 520" stroke="#000" stroke-width="10" fill="none" opacity=".16" filter="url(#blur8)"/>
    ${graphic}
  </g>
  <path d="M-62 146 Q0 ${back ? 162 : 208} 62 146" fill="none" stroke="${shade(tee, 0.45)}" stroke-width="12" stroke-linecap="round"/>
  </g>`;
}

/* ------------------------------------------------------------------ scenes */
const PAL = {
  dawn: { sky: [["0", "#090b0e"], [".38", "#1b2229"], [".64", "#7c7d7a"], [".8", "#e9e3d6"]], glow: "#f3d9a8", ridges: ["#77807f", "#55605f", "#38413f", "#222927", "#101413"], fog: "#d8d3c6" },
  dusk: { sky: [["0", "#0a0a0b"], [".4", "#1f1415"], [".68", "#7b2c27"], [".86", "#e3965f"]], glow: "#ffb070", ridges: ["#6c4a43", "#4a312e", "#2f1f1e", "#1a1112", "#0b0809"], fog: "#c9805a" },
  mist: { sky: [["0", "#101418"], [".4", "#313a41"], [".7", "#a4abab"], [".88", "#e9e3d6"]], glow: "#ffffff", ridges: ["#8d9696", "#667070", "#434d4f", "#2a3234", "#12171a"], fog: "#dcdcd3" },
};

function skyDefs(p, id, W, H, sunX, sunY, glowR) {
  return `<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">${p.sky.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>
  <radialGradient id="sun${id}" cx="${sunX}" cy="${sunY}" r="${glowR}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${p.glow}" stop-opacity=".95"/><stop offset=".35" stop-color="${p.glow}" stop-opacity=".35"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="fog${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fog}" stop-opacity="0"/><stop offset="1" stop-color="${p.fog}" stop-opacity=".55"/></linearGradient>`;
}

function ridgePath(r, W, baseY, amp, freq) {
  const phases = [r() * 6, r() * 6, r() * 6, r() * 6];
  let d = `M0 ${baseY + amp * 2}`;
  for (let i = 0; i <= 160; i++) {
    const x = (W * i) / 160;
    let h = 0, a = 1, norm = 0;
    for (let k = 0; k < 4; k++) {
      h += a * (1 - Math.abs(Math.sin(x * freq * 2 ** k * 0.004 + phases[k])));
      norm += a; a *= 0.5;
    }
    d += ` L${x.toFixed(1)} ${(baseY - amp * (h / norm)).toFixed(1)}`;
  }
  return d + ` L${W} ${baseY + amp * 2} Z`;
}

function sceneMountain({ W, H, pal, seed, fig, sunX = 0.3, horizon = 0.62 }) {
  const r = rng(seed), p = PAL[pal];
  const id = seed;
  let body = `<rect width="${W}" height="${H}" fill="url(#sky${id})"/><rect width="${W}" height="${H}" fill="url(#sun${id})"/>`;
  p.ridges.forEach((c, i) => {
    const baseY = H * (horizon + i * 0.055), amp = H * (0.2 - i * 0.026);
    body += `<path d="${ridgePath(r, W, baseY, amp, 1.3 + i * 0.55)}" fill="${c}"/>`;
    if (i < 4) body += `<rect y="${baseY - amp * 0.35}" width="${W}" height="${amp * 1.1}" fill="url(#fog${id})"/>`;
  });
  body += `<path d="M0 ${H * 0.9} Q${W * 0.5} ${H * 0.86} ${W} ${H * 0.9} L${W} ${H} L0 ${H} Z" fill="#0a0c0d"/>`;
  if (fig) body += figure({ ...fig, x: W * fig.x, baseY: H * fig.baseY, h: H * fig.h });
  return svgWrap(W, H, body, skyDefs(p, id, W, H, W * sunX, H * (horizon + 0.02), W * 0.55));
}

function sceneCity({ W, H, pal, seed, fig, sunX = 0.35 }) {
  const r = rng(seed), p = PAL[pal];
  const id = seed;
  const horizon = H * 0.68;
  let body = `<rect width="${W}" height="${H}" fill="url(#sky${id})"/><rect width="${W}" height="${H}" fill="url(#sun${id})"/>`;
  const layer = (n, color, minH, maxH, y, windows) => {
    let x = -20, out = "";
    while (x < W) {
      const w = (W / n) * (0.7 + r() * 0.9), h = H * (minH + r() * (maxH - minH));
      out += `<rect x="${x.toFixed(0)}" y="${(y - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${color}"/>`;
      if (windows)
        for (let wy = y - h + 18; wy < y - 14; wy += 26)
          for (let wx = x + 10; wx < x + w - 14; wx += 18)
            if (r() > 0.86) out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="9" fill="${p.glow}" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
      x += w + (r() > 0.7 ? 6 : 0);
    }
    return out;
  };
  body += layer(16, shade(p.ridges[0], 0.1), 0.1, 0.34, horizon, false);
  body += `<rect y="${horizon - H * 0.3}" width="${W}" height="${H * 0.34}" fill="url(#fog${id})"/>`;
  body += layer(11, p.ridges[2], 0.12, 0.42, horizon + H * 0.02, true);
  body += layer(7, p.ridges[4], 0.08, 0.3, horizon + H * 0.06, true);
  // street
  body += `<rect y="${horizon + H * 0.06}" width="${W}" height="${H}" fill="#0b0c0d"/>`;
  body += `<path d="M${W * sunX - 60} ${horizon + H * 0.07} L${W * sunX + 60} ${horizon + H * 0.07} L${W * sunX + W * 0.35} ${H} L${W * sunX - W * 0.35} ${H} Z" fill="${p.glow}" opacity=".08"/>`;
  for (let i = 0; i < 6; i++) body += `<path d="M0 ${horizon + H * (0.1 + i * 0.07)} H${W}" stroke="#fff" stroke-width="1" opacity=".05"/>`;
  if (fig) body += figure({ ...fig, x: W * fig.x, baseY: H * fig.baseY, h: H * fig.h });
  return svgWrap(W, H, body, skyDefs(p, id, W, H, W * sunX, horizon, W * 0.5));
}

function sceneWall({ W, H, seed, fig, warm = "#f2d7aa", tone = "#2b2a28" }) {
  const id = seed, r = rng(seed);
  let body = `<rect width="${W}" height="${H}" fill="url(#wall${id})"/>`;
  // concrete slabs
  const cols = 3;
  for (let i = 1; i < cols; i++) body += `<rect x="${(W * i) / cols}" width="3" height="${H * 0.84}" fill="#000" opacity=".5"/>`;
  body += `<rect y="${H * 0.3}" width="${W}" height="3" fill="#000" opacity=".4"/>`;
  // light shaft
  body += `<path d="M${W * 0.62} 0 L${W * 0.95} 0 L${W * 0.55} ${H} L${W * 0.12} ${H} Z" fill="${warm}" opacity=".22" filter="url(#blur30)"/>`;
  body += `<path d="M${W * 0.7} 0 L${W * 0.8} 0 L${W * 0.42} ${H} L${W * 0.3} ${H} Z" fill="${warm}" opacity=".16"/>`;
  // floor
  body += `<rect y="${H * 0.84}" width="${W}" height="${H * 0.16}" fill="url(#floor${id})"/>`;
  for (let i = 0; i < 40; i++)
    body += `<rect x="${(r() * W).toFixed(0)}" y="${(r() * H * 0.84).toFixed(0)}" width="${(2 + r() * 60).toFixed(0)}" height="1.5" fill="#fff" opacity="${(0.03 + r() * 0.05).toFixed(2)}"/>`;
  if (fig) {
    const fx = W * fig.x, by = H * fig.baseY, fh = H * fig.h;
    body += `<path d="M${fx - fh * 0.1} ${by} L${fx + fh * 0.1} ${by} L${fx + fh * 0.75} ${H} L${fx + fh * 0.3} ${H} Z" fill="#000" opacity=".4" filter="url(#blur8)"/>`;
    body += figure({ ...fig, x: fx, baseY: by, h: fh });
  }
  const defs = `<linearGradient id="wall${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lift(tone, 0.25)}"/><stop offset=".5" stop-color="${tone}"/><stop offset="1" stop-color="${shade(tone, 0.7)}"/></linearGradient>
  <linearGradient id="floor${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3835"/><stop offset="1" stop-color="#0d0d0c"/></linearGradient>`;
  return svgWrap(W, H, body, defs);
}

/* ---------------------------------------------------------- flat-lay (peça) */
function flatLay({ slug, view, W = 1200, H = 1500 }) {
  const P = PRODUCTS[slug];
  const back = view !== "front";
  const detail = view === "detail";
  const warm = P.bg === "warm";
  const bgA = warm ? "#8c857a" : "#2b2b2b", bgB = warm ? "#26241f" : "#080808";
  const k = detail ? 5.2 : 2.05;
  const tx = detail ? 600 : 600;
  const ty = detail ? 780 - 330 * k : 70;
  const tee = P.tee;
  const id = `${slug}${view}`.replace(/[^a-z0-9]/g, "");
  const r = rng(slug.length * 31 + view.length * 7);
  let wr = "";
  for (let i = 0; i < 9; i++) {
    const x1 = -150 + r() * 300, y1 = 190 + r() * 300;
    wr += `<path d="M${x1.toFixed(0)} ${y1.toFixed(0)} q${(r() * 60 - 30).toFixed(0)} ${(30 + r() * 50).toFixed(0)} ${(r() * 80 - 40).toFixed(0)} ${(70 + r() * 80).toFixed(0)}" stroke="${r() > 0.5 ? "#000" : "#fff"}" stroke-opacity="${(0.07 + r() * 0.08).toFixed(2)}" stroke-width="${(5 + r() * 9).toFixed(1)}" fill="none" stroke-linecap="round" filter="url(#blur8)"/>`;
  }
  const gfx = view === "front" ? P.front() : view === "back" ? P.back() : P.detail();
  const weave = detail
    ? `<pattern id="wv${id}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="1" fill="#fff" opacity=".05"/><rect width="1" height="3" fill="#000" opacity=".06"/></pattern><rect x="-300" y="100" width="600" height="500" fill="url(#wv${id})"/>`
    : "";
  const defs = `<radialGradient id="bg${id}" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></radialGradient>
  <linearGradient id="tg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lift(tee, 0.14)}"/><stop offset=".5" stop-color="${tee}"/><stop offset="1" stop-color="${shade(tee, 0.3)}"/></linearGradient>
  <clipPath id="tc${id}"><path d="${teePath(back)}"/></clipPath>
  <filter id="sh${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000" flood-opacity=".55"/></filter>`;
  const body = `<rect width="${W}" height="${H}" fill="url(#bg${id})"/>
  <g transform="translate(${tx} ${ty}) scale(${k})">
    <path d="${teePath(back)}" fill="${tee}" filter="url(#sh${id})"/>
    <path d="${teePath(back)}" fill="url(#tg${id})"/>
    <g clip-path="url(#tc${id})">${wr}${weave}${gfx}
      <path d="M-170 350 L-156 322 M170 350 L156 322" stroke="#000" stroke-opacity=".3" stroke-width="3"/>
      <rect x="-170" y="500" width="340" height="3" fill="#000" opacity=".25"/>
    </g>
    <path d="M-62 146 Q0 ${back ? 162 : 208} 62 146" fill="none" stroke="${shade(tee, 0.4)}" stroke-width="13" stroke-linecap="round"/>
    <path d="M-62 146 Q0 ${back ? 162 : 208} 62 146" fill="none" stroke="${lift(tee, 0.12)}" stroke-width="2" transform="translate(0 7)" opacity=".5"/>
  </g>`;
  return svgWrap(W, H, body, defs);
}

/* --------------------------------------------------------------- the shots */
const FIG = (tee, graphic, extra = {}) => ({ tee, graphic, ...extra });

async function modelShot(slug, W = 1200, H = 1500) {
  const P = PRODUCTS[slug];
  const fig = { ...FIG(P.tee, P.back(), { back: true }), x: 0.5, baseY: 0.95, h: 0.72, lightDir: 1 };
  const [kind, pal] = P.scene.split("-");
  const seed = slug.length * 97 + 11;
  const svg =
    kind === "mountain" ? sceneMountain({ W, H, pal, seed, fig, sunX: 0.28, horizon: 0.5 })
    : kind === "city" ? sceneCity({ W, H, pal, seed, fig, sunX: 0.7 })
    : sceneWall({ W, H, seed, fig, tone: P.tee === BONE || P.tee === "#E3DCCB" ? "#34322f" : "#2d2a26" });
  await save(svg, W, H, `products/${slug}-1.jpg`);
}

async function main() {
  const only = process.argv[2];
  const want = (name) => !only || name.startsWith(only);

  /* products: 4 images each */
  for (const slug of Object.keys(PRODUCTS)) {
    if (!want("products")) break;
    await modelShot(slug);
    await save(flatLay({ slug, view: "front" }), 1200, 1500, `products/${slug}-2.jpg`, { grain: 18 });
    await save(flatLay({ slug, view: "back" }), 1200, 1500, `products/${slug}-3.jpg`, { grain: 18 });
    await save(flatLay({ slug, view: "detail" }), 1200, 1500, `products/${slug}-4.jpg`, { grain: 20 });
  }

  /* hero slides (landscape) */
  if (want("hero")) {
    const W = 2400, H = 1500;
    await save(sceneMountain({ W, H, pal: "dawn", seed: 101, sunX: 0.38, horizon: 0.46, fig: { ...FIG("#111111", wm(0, 366, 156, BONE, { extra: 'textLength="272" lengthAdjust="spacingAndGlyphs"' })), x: 0.69, baseY: 0.97, h: 0.78 } }), W, H, "hero-1.jpg", { q: 76 });
    await save(sceneCity({ W, H, pal: "dusk", seed: 102, sunX: 0.3, fig: { ...FIG("#0f0f0f", PRODUCTS["motza-red"].back()), x: 0.7, baseY: 0.97, h: 0.76 } }), W, H, "hero-2.jpg", { q: 76 });
    await save(sceneWall({ W, H, seed: 103, fig: { ...FIG(BONE, PRODUCTS.disciplina.back()), x: 0.7, baseY: 0.95, h: 0.78 } }), W, H, "hero-3.jpg", { q: 76 });
  }

  /* manifesto + about */
  if (want("manifesto")) {
    const W = 2400, H = 1600;
    await save(sceneMountain({ W, H, pal: "mist", seed: 201, sunX: 0.62, horizon: 0.42, fig: { ...FIG("#121212", PRODUCTS["motza-bold"].back()), x: 0.3, baseY: 0.98, h: 0.8 } }), W, H, "manifesto.jpg", { q: 76 });
    await save(sceneCity({ W, H, pal: "dawn", seed: 202, sunX: 0.5, fig: { ...FIG(BROWN, PRODUCTS["motza-heritage"].back()), x: 0.74, baseY: 0.98, h: 0.8 } }), W, H, "about.jpg", { q: 76 });
  }

  /* mindset (b/w, portrait) */
  if (want("mindset")) {
    const W = 1200, H = 1500;
    await save(sceneMountain({ W, H, pal: "mist", seed: 301, horizon: 0.5, fig: { ...FIG("#d9d3c4", "", { back: true }), x: 0.5, baseY: 0.97, h: 0.62 } }), W, H, "mindset-1.jpg", { mono: true });
    await save(sceneCity({ W, H, pal: "dawn", seed: 302, sunX: 0.5, fig: { ...FIG("#151515", "", { back: true }), x: 0.4, baseY: 0.97, h: 0.62 } }), W, H, "mindset-2.jpg", { mono: true });
    await save(sceneWall({ W, H, seed: 303, fig: { ...FIG("#d9d3c4", "", { back: true }), x: 0.58, baseY: 0.95, h: 0.64 } }), W, H, "mindset-3.jpg", { mono: true });
    await save(sceneMountain({ W, H, pal: "dusk", seed: 304, sunX: 0.7, horizon: 0.56, fig: { ...FIG("#181818", "", { back: true }), x: 0.35, baseY: 0.97, h: 0.6 } }), W, H, "mindset-4.jpg", { mono: true });
  }

  /* lookbook: mixed formats */
  if (want("look")) {
    const L = [
      // [name, W, H, builder]
      ["look-1", 1200, 1600, (W, H) => sceneMountain({ W, H, pal: "dawn", seed: 401, horizon: 0.5, sunX: 0.7, fig: { ...FIG("#111", PRODUCTS["motza-clean"].back()), x: 0.5, baseY: 0.97, h: 0.8 } })],
      ["look-2", 1800, 1200, (W, H) => sceneCity({ W, H, pal: "dusk", seed: 402, sunX: 0.25, fig: { ...FIG(BONE, PRODUCTS.montanha.back()), x: 0.72, baseY: 0.97, h: 0.8 } })],
      // close-up torso (figure is much larger than the frame)
      ["look-3", 1200, 1500, (W, H) => sceneWall({ W, H, seed: 403, tone: "#33302c", fig: { ...FIG("#101010", PRODUCTS["motza-bold"].back()), x: 0.5, baseY: 1.92, h: 2.4 } })],
      ["look-4", 1200, 1600, (W, H) => sceneMountain({ W, H, pal: "mist", seed: 404, horizon: 0.55, fig: { ...FIG(BROWN, PRODUCTS["motza-heritage"].back()), x: 0.42, baseY: 0.97, h: 0.78 } })],
      ["look-5", 1800, 1200, (W, H) => sceneWall({ W, H, seed: 405, fig: { ...FIG("#121212", PRODUCTS.thorn.back()), x: 0.35, baseY: 0.95, h: 0.82 } })],
      ["look-6", 1200, 1200, (W, H) => sceneCity({ W, H, pal: "dawn", seed: 406, sunX: 0.5, fig: { ...FIG("#0f0f0f", PRODUCTS["motza-red"].back()), x: 0.5, baseY: 1.5, h: 1.8 } })],
      ["look-7", 1200, 1600, (W, H) => sceneMountain({ W, H, pal: "dusk", seed: 407, horizon: 0.5, sunX: 0.3, fig: { ...FIG("#E3DCCB", PRODUCTS.montanha.back()), x: 0.55, baseY: 0.97, h: 0.78 } })],
      ["look-8", 1800, 1200, (W, H) => sceneCity({ W, H, pal: "dusk", seed: 408, sunX: 0.6, fig: { ...FIG("#E7E0CF", PRODUCTS.disciplina.back()), x: 0.3, baseY: 0.97, h: 0.82 } })],
    ];
    for (const [name, W, H, f] of L) await save(f(W, H), W, H, `${name}.jpg`, { mono: name === "look-5" || name === "look-8" ? false : false, q: 76 });
  }

  /* instagram (square) */
  if (want("ig")) {
    const W = 1000, H = 1000;
    const s = [
      sceneMountain({ W, H, pal: "dawn", seed: 501, horizon: 0.5, fig: { ...FIG("#111", PRODUCTS["motza-clean"].back()), x: 0.5, baseY: 0.98, h: 0.85 } }),
      sceneWall({ W, H, seed: 502, fig: { ...FIG(BROWN, PRODUCTS["motza-heritage"].back()), x: 0.5, baseY: 1.5, h: 1.8 } }),
      sceneCity({ W, H, pal: "dusk", seed: 503, fig: { ...FIG("#0f0f0f", PRODUCTS["motza-red"].back()), x: 0.35, baseY: 0.98, h: 0.85 } }),
      sceneMountain({ W, H, pal: "mist", seed: 504, horizon: 0.52, fig: { ...FIG("#E3DCCB", PRODUCTS.montanha.back()), x: 0.6, baseY: 0.98, h: 0.85 } }),
      sceneWall({ W, H, seed: 505, fig: { ...FIG("#121212", PRODUCTS.thorn.back()), x: 0.4, baseY: 0.96, h: 0.86 } }),
      sceneCity({ W, H, pal: "dawn", seed: 506, sunX: 0.7, fig: { ...FIG("#E7E0CF", PRODUCTS.disciplina.back()), x: 0.5, baseY: 1.5, h: 1.8 } }),
    ];
    for (let i = 0; i < s.length; i++) await save(s[i], W, H, `ig-${i + 1}.jpg`, { q: 74 });
  }

  /* Open Graph */
  if (want("og")) {
    const W = 1200, H = 630;
    const base = sceneMountain({ W: 2400, H: 1260, pal: "dawn", seed: 101, sunX: 0.38, horizon: 0.46, fig: { ...FIG("#111111", wm(0, 366, 156, BONE, { extra: 'textLength="272" lengthAdjust="spacingAndGlyphs"' })), x: 0.78, baseY: 0.97, h: 0.82 } });
    const png = await sharp(Buffer.from(base)).resize(W, H).png().toBuffer();
    const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000" opacity=".25"/>
      <text x="64" y="150" font-family="Anton" font-size="120" fill="${BONE}" letter-spacing="6">MOTZA</text>
      <text x="66" y="530" font-family="Anton" font-size="52" fill="${BONE}" letter-spacing="3">DISCIPLINA CONSTRÓI</text>
      <text x="66" y="590" font-family="Anton" font-size="52" fill="${RED}" letter-spacing="3">LIBERDADE.</text></svg>`;
    await sharp(png).composite([{ input: Buffer.from(text) }]).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, "og.jpg"));
    console.log("✓ og.jpg");
  }
}

main();
