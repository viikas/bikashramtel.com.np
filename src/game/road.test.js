import { test } from 'node:test'
import assert from 'node:assert/strict'
import { projectRoad } from './road.js'

test('one row per scanline below the horizon', () => {
  const rows = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0 })
  assert.equal(rows.length, 90)
  assert.equal(rows[0].y, 90)
})

test('road widens toward the bottom', () => {
  const rows = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0 })
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].halfWidth >= rows[i - 1].halfWidth)
  assert.ok(rows.at(-1).halfWidth > 120 && rows.at(-1).halfWidth <= 160)
})

test('stripes move when offset changes', () => {
  const a = projectRoad({ width: 320, height: 180, horizon: 90, offset: 0 }).map(r => r.stripe)
  const b = projectRoad({ width: 320, height: 180, horizon: 90, offset: 100 }).map(r => r.stripe)
  assert.notDeepEqual(a, b)
})

test('negative offset (scrolling back up) still alternates 0/1 with no NaN', () => {
  const rows = projectRoad({ width: 320, height: 180, horizon: 90, offset: -12345 })
  assert.ok(rows.every(r => r.stripe === 0 || r.stripe === 1))
  assert.ok(new Set(rows.map(r => r.stripe)).size === 2)
})

test('horizon at or below the bottom returns no rows', () => {
  assert.deepEqual(projectRoad({ width: 320, height: 180, horizon: 180, offset: 0 }), [])
})
