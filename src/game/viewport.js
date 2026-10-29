/**
 * Canvas sizing: a whole-number pixel size keeps pixels square on any
 * viewport. `hudInset` (CSS px) is the part of the bottom edge covered by
 * the desktop HUD; `groundBottom` is the lowest internal row still visible.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function canvasLayout({ cssWidth, cssHeight, hudInset = 0 }) {
  const px = clamp(Math.round(Math.min(cssWidth, cssHeight) / 180), 2, 6)
  const width = Math.ceil(cssWidth / px)
  const height = Math.ceil(cssHeight / px)
  const groundBottom = Math.max(1, Math.floor((cssHeight - hudInset) / px))
  return { px, width, height, groundBottom: Math.min(height, groundBottom) }
}

// Narrow or short (landscape phone) screens get the slim top HUD. Keep in sync
// with the matching @media rules in global.css, Hud.module.css and StartLine.module.css.
export const COMPACT_HUD_QUERY = '(max-width: 720px), (max-height: 500px)'
