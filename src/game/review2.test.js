import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isRiderOnScreen, rescaleRivals, spawnRivals } from './rivals.js'
import { billboardBox } from './billboardLayout.js'
import { textWidth } from './pixelFont.js'
import { COMPACT_HUD_QUERY } from './viewport.js'

// ── Rivals slide off-screen instead of blinking out ─────────────────────
test('a rival whose tyre is below the ground line but whose body still shows stays drawn', () => {
  assert.equal(isRiderOnScreen(170, 1, 160), true)   // top at 135 < 160
  assert.equal(isRiderOnScreen(200, 1, 160), false)  // top at 165 > 160
})

// ── Resizes (mobile URL bar) keep rivals where they are ─────────────────
test('rescaleRivals keeps relative positions instead of respawning', () => {
  const rivals = [{ z: 30000, lane: 0.45, jacket: 'blue' }]
  assert.deepEqual(rescaleRivals(rivals, 90000, 90000), rivals)
  assert.equal(rescaleRivals(rivals, 90000, 45000)[0].z, 15000)
  assert.deepEqual(rescaleRivals([], 0, 90000), spawnRivals(90000))
})

// ── Billboards: text only when the whole board fits on the canvas ───────
const BOARD_W = textWidth('550+ TRUCKING') + 6

test('narrow phone canvas: a readable board is pulled fully on-screen', () => {
  const box = billboardBox({ anchorX: 160, side: 1, scale: 0.8, boardW: BOARD_W, canvasWidth: 180 })
  assert.equal(box.showText, true)
  assert.ok(box.left >= 1 && box.left + box.widthPx <= 179, JSON.stringify(box))
})

test('left-side boards are pulled on-screen too', () => {
  const box = billboardBox({ anchorX: 10, side: -1, scale: 1.2, boardW: BOARD_W, canvasWidth: 320 })
  assert.ok(box.left >= 1, JSON.stringify(box))
})

test('distant boards show placeholder bars and are not moved', () => {
  const box = billboardBox({ anchorX: 200, side: 1, scale: 0.3, boardW: BOARD_W, canvasWidth: 320 })
  assert.equal(box.showText, false)
  assert.equal(box.left, 200)
})

test('text cells are whole pixels and the board is sized from them', () => {
  const box = billboardBox({ anchorX: 200, side: 1, scale: 2.4, boardW: BOARD_W, canvasWidth: 640 })
  assert.equal(box.cell, 2)
  assert.equal(box.widthPx, BOARD_W * 2)
})

test('a board too wide for the canvas never shows clipped text', () => {
  const box = billboardBox({ anchorX: 150, side: 1, scale: 5, boardW: BOARD_W, canvasWidth: 180 })
  assert.ok(!box.showText || box.widthPx <= 178, JSON.stringify(box))
})

// ── The compact-HUD breakpoint is the same in JS and every stylesheet ───
test('COMPACT_HUD_QUERY matches the CSS media queries', () => {
  for (const f of ['../styles/global.css', '../components/Hud/Hud.module.css', '../components/StartLine/StartLine.module.css']) {
    const css = readFileSync(new URL(f, import.meta.url), 'utf8')
    assert.ok(css.includes(`@media ${COMPACT_HUD_QUERY}`), f)
  }
})
