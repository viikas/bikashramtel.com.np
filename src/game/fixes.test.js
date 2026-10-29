import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveActive } from './activeStage.js'
import { canvasLayout } from './viewport.js'
import { countdownValue } from './countdown.js'
import { hashTarget } from './hash.js'

const STAGES = ['ascend', 'wisdom-mirror', 'kodknackare', 'portpro']

test('small back-scroll: when the next section leaves the band, the previous one is active again', () => {
  const visible = new Set(['stage-ascend', 'stage-wisdom-mirror'])
  assert.equal(resolveActive(visible, STAGES).stageId, 'wisdom-mirror')
  visible.delete('stage-wisdom-mirror')
  assert.deepEqual(resolveActive(visible, STAGES), { phase: 'stage', stageId: 'ascend', index: 0 })
})

test('resolveActive maps start, finish sections and an empty band', () => {
  assert.equal(resolveActive(new Set(['start']), STAGES).phase, 'start')
  assert.equal(resolveActive(new Set(['stage-portpro', 'loadout']), STAGES).phase, 'finish')
  assert.equal(resolveActive(new Set(), STAGES), null)
})

test('desktop: the bike sits above the 88px HUD bar', () => {
  const l = canvasLayout({ cssWidth: 1440, cssHeight: 900, hudInset: 88 })
  assert.ok(l.groundBottom * l.px <= 900 - 88, JSON.stringify(l))
  assert.equal(l.width, Math.ceil(1440 / l.px))
})

test('phone (HUD on top): the ground reaches the bottom', () => {
  const l = canvasLayout({ cssWidth: 360, cssHeight: 740, hudInset: 0 })
  assert.equal(l.px, 2)
  assert.equal(l.groundBottom, l.height)
})

test('countdown waits at 9 until the finish is reached, then ticks and loops', () => {
  assert.equal(countdownValue(null, 5000), 9)
  assert.equal(countdownValue(1000, 4200), 6)
  assert.equal(countdownValue(1000, 10500), 0)
  assert.equal(countdownValue(1000, 11100), 9)
})

test('hashTarget survives malformed percent-encoding', () => {
  assert.equal(hashTarget('#stage-portpro'), 'stage-portpro')
  assert.equal(hashTarget('#%'), '%')
  assert.equal(hashTarget('#%E0'), '%E0')
  assert.equal(hashTarget(''), null)
  assert.equal(hashTarget('#'), null)
})
