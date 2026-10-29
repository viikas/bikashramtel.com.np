import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextSpeed, IDLE, MAX } from './speed.js'

test('no scrolling eases toward IDLE', () => {
  let s = 300
  for (let i = 0; i < 300; i++) s = nextSpeed({ current: s, scrollDelta: 0, dt: 1 / 60, reducedMotion: false })
  assert.ok(Math.abs(s - IDLE) < 1)
})

test('scrolling raises speed', () => {
  const s = nextSpeed({ current: IDLE, scrollDelta: 40, dt: 1 / 60, reducedMotion: false })
  assert.ok(s > IDLE)
})

test('huge jump (checkpoint click / End key) is capped at MAX', () => {
  const s = nextSpeed({ current: IDLE, scrollDelta: 50000, dt: 1 / 60, reducedMotion: false })
  assert.ok(s <= MAX && Number.isFinite(s))
})

test('scrolling up still moves forward (speed never negative)', () => {
  assert.ok(nextSpeed({ current: IDLE, scrollDelta: -400, dt: 1 / 60, reducedMotion: false }) >= 0)
})

test('dt of 0 or a huge dt after the tab returns stays finite and capped', () => {
  for (const dt of [0, 30]) {
    const s = nextSpeed({ current: 200, scrollDelta: 100, dt, reducedMotion: false })
    assert.ok(Number.isFinite(s) && s >= 0 && s <= MAX)
  }
})

test('reduced motion is always 0', () => {
  assert.equal(nextSpeed({ current: 300, scrollDelta: 500, dt: 1 / 60, reducedMotion: true }), 0)
})
