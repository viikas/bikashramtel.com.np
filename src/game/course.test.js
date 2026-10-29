import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkpointPercents, markerPercent, hudLabel } from './course.js'

test('four checkpoints evenly spaced inside the track', () => {
  assert.deepEqual(checkpointPercents(4), [12.5, 37.5, 62.5, 87.5])
})

test('marker sits on its checkpoint during a stage', () => {
  assert.equal(markerPercent(2, 4, 'stage'), 62.5)
})

test('marker is 0 at start and 100 at finish, never outside 0-100', () => {
  assert.equal(markerPercent(-1, 4, 'start'), 0)
  assert.equal(markerPercent(-1, 4, 'finish'), 100)
  assert.equal(markerPercent(99, 4, 'stage'), 100)
})

test('hud label reads START / STAGE n · COMPANY / FINISH', () => {
  assert.equal(hudLabel('start', null), 'START')
  assert.equal(hudLabel('stage', { number: 4, company: 'PortPro' }), 'STAGE 4 · PORTPRO')
  assert.equal(hudLabel('finish', null), 'FINISH')
})
