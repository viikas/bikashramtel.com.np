/**
 * 16-bit sprites drawn with fillRect only, so every edge lands on a whole pixel.
 *
 * Roadside sprites are defined as rect lists in local units, origin at the
 * bottom-centre, y going up (negative). drawSprite scales them by depth.
 */

import { GLYPHS, GLYPH_HEIGHT, textWidth } from '../../game/pixelFont'

const C = {
  sky1: '#7ec8f5', sky2: '#a6dcfa', sky3: '#cdeefe',
  grass1: '#8fd16a', grass2: '#7cc35a', grass3: '#3d8f3a', grassLight: '#4fa34a',
  rumble: '#e83b3b', white: '#ffffff', sun: '#ffd93b', sunGlow: '#fff2a8',
  ink: '#1b1b2f', bark: '#5a3b1f', steel: '#9a9aa6', denim: '#2f4f8f',
  mountain: '#8aa6c8', mountainShade: '#7894ba', blue: '#2f6fe0', orange: '#f0a020',
}

export const PALETTE = C

// [x, y, w, h, color] — local units, y negative is up
const SPRITES = {
  tree: [
    [-2, -10, 4, 10, C.bark],
    [-10, -30, 20, 20, C.grass3],
    [-7, -38, 14, 8, C.grass3],
    [-6, -28, 6, 6, C.grassLight],
  ],
  hill: [
    [-22, -8, 44, 8, C.grass3],
    [-15, -14, 30, 6, C.grass3],
    [-8, -18, 16, 4, C.grass3],
    [-12, -12, 8, 3, C.grassLight],
  ],
  'prayer-flags': [
    [-1, -42, 2, 42, C.bark],
    [1, -40, 30, 1, C.ink],
    [3, -39, 5, 6, C.blue],
    [9, -38, 5, 6, C.white],
    [15, -37, 5, 6, C.rumble],
    [21, -38, 5, 6, C.grass3],
    [27, -39, 5, 6, C.sun],
  ],
  billboard: [
    [-13, -16, 3, 16, C.bark],
    [10, -16, 3, 16, C.bark],
    [-20, -38, 40, 23, C.ink],
    [-18, -36, 36, 19, C.white],
    [-15, -33, 18, 3, C.rumble],
    [-15, -28, 28, 2, C.ink],
    [-15, -24, 20, 2, C.ink],
  ],
  container: [
    [-17, -13, 34, 13, C.rumble],
    [-17, -26, 34, 13, C.blue],
    [-13, -12, 1, 11, C.ink], [-7, -12, 1, 11, C.ink], [-1, -12, 1, 11, C.ink], [5, -12, 1, 11, C.ink], [11, -12, 1, 11, C.ink],
    [-13, -25, 1, 11, C.ink], [-7, -25, 1, 11, C.ink], [-1, -25, 1, 11, C.ink], [5, -25, 1, 11, C.ink], [11, -25, 1, 11, C.ink],
    [-17, -14, 34, 1, C.ink],
  ],
  crane: [
    [-15, -64, 3, 64, C.sun],
    [12, -64, 3, 64, C.sun],
    [-28, -68, 58, 4, C.sun],
    [-15, -36, 30, 2, C.sun],
    [4, -64, 9, 7, C.ink],
    [-21, -64, 1, 22, C.ink],
    [-26, -42, 11, 7, C.orange],
  ],
}

export function drawSprite(ctx, kind, x, y, scale) {
  const rects = SPRITES[kind]
  if (!rects) return
  for (const [rx, ry, rw, rh, color] of rects) {
    const w = Math.max(1, Math.round(rw * scale))
    const h = Math.max(1, Math.round(rh * scale))
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x + rx * scale), Math.round(y + ry * scale), w, h)
  }
}

/** Banded daytime sky, a blocky sun and a few pixel clouds. */
export function drawSky(ctx, width, horizon) {
  const b1 = Math.round(horizon * 0.4)
  const b2 = Math.round(horizon * 0.7)
  ctx.fillStyle = C.sky1; ctx.fillRect(0, 0, width, b1)
  ctx.fillStyle = C.sky2; ctx.fillRect(0, b1, width, b2 - b1)
  ctx.fillStyle = C.sky3; ctx.fillRect(0, b2, width, horizon - b2)

  const sx = width - 44
  const sy = Math.max(10, Math.round(horizon * 0.18))
  ctx.fillStyle = C.sunGlow; ctx.fillRect(sx - 3, sy - 3, 20, 20)
  ctx.fillStyle = C.sun;     ctx.fillRect(sx, sy, 14, 14)

  ctx.fillStyle = C.white
  for (const [cx, cy, cw] of [[0.12, 0.22, 26], [0.42, 0.12, 18], [0.66, 0.34, 22]]) {
    const x = Math.round(width * cx)
    const y = Math.round(horizon * cy)
    ctx.fillRect(x, y, cw, 4)
    ctx.fillRect(x + 4, y - 3, cw - 10, 3)
  }
}

/**
 * Horizon silhouette. `mountains` adds snow-capped Himalayan peaks behind
 * the green hills (Nepal stages); otherwise just rolling hills. `shift`
 * slides the hills sideways as the road curves (mountains move at half speed).
 */
export function drawHills(ctx, width, horizon, mountains, shift = 0) {
  if (mountains) {
    for (let x = 0; x < width; x++) {
      const wx = x + shift * 0.5
      const h = Math.round(20 + 11 * Math.sin(wx * 0.045) + 7 * Math.sin(wx * 0.13 + 1))
      ctx.fillStyle = ((Math.floor(wx) % 40) + 40) % 40 < 20 ? C.mountain : C.mountainShade
      ctx.fillRect(x, horizon - h, 1, h)
      if (h > 28) {
        ctx.fillStyle = C.white
        ctx.fillRect(x, horizon - h, 1, Math.min(4, h - 28))
      }
    }
  }
  for (let x = 0; x < width; x++) {
    const wx = x + shift
    const h = Math.round(7 + 4 * Math.sin(wx * 0.06 + 2) + 2 * Math.sin(wx * 0.19))
    ctx.fillStyle = C.grass3
    ctx.fillRect(x, horizon - h, 1, h)
  }
}

/**
 * Roadside billboard with two lines of 3×5 pixel text. (x, y) is the base of
 * the board's inner edge post; `side` is -1 (left of road) or 1 (right) and the
 * board extends away from the road. Far boards show placeholder bars instead of text.
 */
export function drawBillboard(ctx, lines, x, y, scale, side) {
  const boardW = Math.max(...lines.map(textWidth)) + 6
  const boardH = 2 * GLYPH_HEIGHT + 2 + 6
  const postH = 14
  const left = side > 0 ? x : x - boardW * scale
  const top = y - (postH + boardH) * scale
  const fill = (rx, ry, rw, rh, color) => {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(left + rx * scale), Math.round(top + ry * scale), Math.max(1, Math.round(rw * scale)), Math.max(1, Math.round(rh * scale)))
  }
  fill(4, boardH, 2, postH, C.bark)
  fill(boardW - 6, boardH, 2, postH, C.bark)
  fill(0, 0, boardW, boardH, C.ink)
  fill(1, 1, boardW - 2, boardH - 2, C.white)
  // Text only when each font pixel gets at least one whole screen pixel; snap
  // to whole cells so glyphs stay crisp instead of drifting apart.
  const cell = Math.floor(scale)
  if (cell < 1) {
    fill(3, 4, boardW - 6, 2, C.rumble)
    fill(3, 10, boardW - 8, 2, C.ink)
    return
  }
  const boardLeft = Math.round(left)
  const boardWidthPx = Math.round(boardW * scale)
  const textTop = Math.round(top + 3 * scale)
  lines.forEach((line, row) => {
    const lineLeft = boardLeft + Math.round((boardWidthPx - textWidth(line) * cell) / 2)
    const lineTop = textTop + row * (GLYPH_HEIGHT + 2) * cell
    ctx.fillStyle = row === 0 ? C.rumble : C.ink
    ;[...line].forEach((ch, i) => {
      for (const [gx, gy] of GLYPHS[ch] ?? []) {
        ctx.fillRect(lineLeft + (i * 4 + gx) * cell, lineTop + gy * cell, cell, cell)
      }
    })
  })
}

// [x, y, w, h, color] relative to the rear tyre's contact point, y up negative.
const BIKE_BASE = [
  [-3, -8, 6, 8, C.ink],
  [-1, -7, 1, 5, '#4a4a5a'],
  [-8, -11, 2, 3, C.steel],
  [6, -11, 2, 3, C.steel],
  [-4, -11, 8, 2, C.rumble],
  [-6, -14, 12, 3, '#2a2a3a'],
]
// 'jacket' and 'helmet' are placeholders filled per rider.
const BIKE_RIDER = [
  [-8, -19, 3, 6, C.denim],
  [5, -19, 3, 6, C.denim],
  [-6, -28, 12, 10, 'jacket'],
  [-6, -23, 12, 2, C.white],
  [-9, -26, 3, 6, 'jacket'],
  [6, -26, 3, 6, 'jacket'],
  [-11, -21, 3, 2, C.ink],
  [8, -21, 3, 2, C.ink],
  [-4, -35, 8, 7, 'helmet'],
  [-1, -35, 2, 7, C.rumble],
]

export const RIDERS = {
  player: { jacket: C.rumble, helmet: C.sun },
  blue:   { jacket: C.blue, helmet: C.white },
  green:  { jacket: C.grass3, helmet: C.orange },
}

/**
 * Rider seen from behind. `lean` (-1…1) shifts the rider up to 2px sideways;
 * `scale` shrinks rivals with distance; `colors` picks the jacket and helmet.
 */
export function drawBike(ctx, x, y, lean, scale = 1, colors = RIDERS.player) {
  const shift = Math.round(lean * 2)
  const paint = (rects, dx) => {
    for (const [rx, ry, rw, rh, color] of rects) {
      ctx.fillStyle = colors[color] ?? color
      ctx.fillRect(Math.round(x + (rx + dx) * scale), Math.round(y + ry * scale), Math.max(1, Math.round(rw * scale)), Math.max(1, Math.round(rh * scale)))
    }
  }
  paint(BIKE_BASE, 0)
  paint(BIKE_RIDER, shift)
}
