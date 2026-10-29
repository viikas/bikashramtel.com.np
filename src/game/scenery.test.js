import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sceneryFor } from './scenery.js'

test('PortPro roadside has containers and cranes', () => {
  assert.ok(sceneryFor('portpro').includes('container'))
  assert.ok(sceneryFor('portpro').includes('crane'))
})

test('Nepal stages have hills and prayer flags', () => {
  for (const id of ['ascend', 'wisdom-mirror']) assert.ok(sceneryFor(id).includes('prayer-flags'))
})

test('unknown or null stage falls back to the start scenery', () => {
  assert.deepEqual(sceneryFor(null), sceneryFor('nope'))
  assert.ok(sceneryFor(null).length > 0)
})
