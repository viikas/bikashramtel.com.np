/**
 * Where a roadside billboard sits on the canvas, and whether its text shows.
 *
 * Text is drawn in whole-pixel cells and only when the entire board fits on
 * the canvas — a readable board is nudged fully on-screen so a stat is never
 * shown truncated ("100,00"). Distant boards keep their perspective size and
 * show placeholder bars instead of text.
 */

import { textWidth } from './pixelFont.js'

const TEXT_MIN_SCALE = 0.55

export const boardWidthFor = lines => Math.max(...lines.map(textWidth)) + 6

export function billboardBox({ anchorX, side, scale, boardW, canvasWidth }) {
  let cell = scale >= TEXT_MIN_SCALE ? Math.max(1, Math.floor(scale)) : 0
  while (cell >= 1 && boardW * cell > canvasWidth - 2) cell--

  if (cell >= 1) {
    const widthPx = boardW * cell
    const raw = side > 0 ? anchorX : anchorX - widthPx
    const left = Math.round(Math.min(canvasWidth - 1 - widthPx, Math.max(1, raw)))
    return { showText: true, cell, unit: cell, left, widthPx }
  }

  const widthPx = boardW * scale
  return { showText: false, cell: 0, unit: scale, left: side > 0 ? anchorX : anchorX - widthPx, widthPx }
}
