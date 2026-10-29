import { test } from 'node:test'
import assert from 'node:assert/strict'
import { projectRoad, curveAt } from './road.js'
import { toMph, normalizedDelta, MAX, IDLE } from './speed.js'
import { stepRivals, spawnRivals, RIVAL_SPEED } from './rivals.js'
import { GLYPHS, textWidth } from './pixelFont.js'
import { publishMph, subscribeMph, currentMph } from './telemetry.js'
import { billboardsFor } from '../data/billboards.js'

// ── Curves ───────────────────────────────────────────────────────────────
test('curveAt is 0 at the start line and stays within ±1', () => {
  assert.equal(curveAt(0), 0)
  for (let o = -50000; o <= 50000; o += 777) assert.ok(Math.abs(curveAt(o)) <= 1)
})

test('a curve bends the far road but keeps the bike row centred', () => {
  const rows = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0, curve: 1 })
  assert.equal(rows.at(-1).center, 160)
  assert.ok(rows[0].center > 160 + 320 * 0.4)
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].center <= rows[i - 1].center)
  const left = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0, curve: -1 })
  assert.ok(Math.abs((left[0].center - 160) + (rows[0].center - 160)) < 1e-9)
})

test('no curve keeps the road straight', () => {
  const rows = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0, curve: 0 })
  assert.ok(rows.every(r => r.center === 160))
})

// ── Speedometer & frame-rate independence ───────────────────────────────
test('toMph maps idle and max speed onto a 0-180 dial', () => {
  assert.equal(toMph(0), 0)
  assert.equal(toMph(IDLE), 12)
  assert.equal(toMph(MAX), 180)
})

test('the same scroll velocity reads the same at 60Hz and 120Hz', () => {
  assert.equal(normalizedDelta(10, 1 / 60), 10)
  assert.equal(normalizedDelta(5, 1 / 120), 10)
  assert.equal(normalizedDelta(7, 0), 7)
})

test('telemetry notifies only on change', () => {
  const seen = []
  const off = subscribeMph(v => seen.push(v))
  publishMph(42); publishMph(42); publishMph(43)
  off(); publishMph(44)
  assert.deepEqual(seen, [42, 43])
  assert.equal(currentMph(), 44)
})

// ── Rivals ───────────────────────────────────────────────────────────────
const FAR = 90000
const NEAR = 550

test('a faster player closes on rivals', () => {
  const [r] = stepRivals({ rivals: [{ z: 20000, lane: 0.4, jacket: 'blue' }], playerSpeed: 600, dt: 1 / 60, farZ: FAR, nearZ: NEAR })
  assert.ok(r.z < 20000)
})

test('a passed rival respawns far ahead', () => {
  const [r] = stepRivals({ rivals: [{ z: NEAR + 1, lane: 0.4, jacket: 'blue' }], playerSpeed: 600, dt: 1 / 60, farZ: FAR, nearZ: NEAR, rand: () => 0.5 })
  assert.ok(r.z > FAR * 0.8 && r.z <= FAR)
})

test('when idling, rivals pull away but never beyond the horizon', () => {
  const [r] = stepRivals({ rivals: [{ z: FAR - 1, lane: 0.4, jacket: 'blue' }], playerSpeed: IDLE, dt: 1 / 60, farZ: FAR, nearZ: NEAR })
  assert.ok(r.z <= FAR && r.z > FAR - 2)
  assert.ok(RIVAL_SPEED > IDLE && RIVAL_SPEED < MAX)
})

test('a huge dt (tab returning) moves rivals at most 0.1s worth', () => {
  const a = stepRivals({ rivals: [{ z: 20000, lane: 0, jacket: 'blue' }], playerSpeed: 600, dt: 30, farZ: FAR, nearZ: NEAR })[0]
  const b = stepRivals({ rivals: [{ z: 20000, lane: 0, jacket: 'blue' }], playerSpeed: 600, dt: 0.1, farZ: FAR, nearZ: NEAR })[0]
  assert.equal(a.z, b.z)
})

test('spawnRivals places two rivals between near and far', () => {
  const rivals = spawnRivals(FAR)
  assert.equal(rivals.length, 2)
  assert.ok(rivals.every(r => r.z > NEAR && r.z < FAR))
})

// ── Billboards ───────────────────────────────────────────────────────────
test('every stage (and start/finish) has billboard messages', () => {
  for (const id of [null, 'portpro', 'kodknackare', 'wisdom-mirror', 'ascend']) assert.ok(billboardsFor(id).length >= 2, String(id))
  assert.deepEqual(billboardsFor('portpro')[0], ['100,000+', 'CONTAINERS'])
})

test('billboard lines are short and drawable with the pixel font', () => {
  for (const id of [null, 'portpro', 'kodknackare', 'wisdom-mirror', 'ascend']) {
    for (const lines of billboardsFor(id)) {
      for (const line of lines) {
        assert.ok(line.length <= 13, line)
        for (const ch of line) assert.ok(GLYPHS[ch], `missing glyph "${ch}" in "${line}"`)
      }
    }
  }
})

test('textWidth counts 3px glyphs plus 1px gaps', () => {
  assert.equal(textWidth('A'), 3)
  assert.equal(textWidth('AB'), 7)
})
