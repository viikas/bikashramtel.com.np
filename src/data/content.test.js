import { test } from 'node:test'
import assert from 'node:assert/strict'
import { career } from './career.js'
import { loadout } from './loadout.js'
import { pitStop } from './pitstop.js'

test('four stages, newest first: PortPro leads, stage numbers count down', () => {
  assert.deepEqual(career.stages.map(s => s.id), ['portpro', 'kodknackare', 'wisdom-mirror', 'ascend'])
  assert.deepEqual(career.stages.map(s => s.number), [4, 3, 2, 1])
})

test('PortPro carries all seven resume bullets', () => {
  const portpro = career.stages[0]
  assert.equal(portpro.bullets.length, 7)
  assert.equal(portpro.dates, 'Apr 2021 – Present')
  assert.deepEqual(portpro.loadout, ['NODE', 'MONGO', 'POSTGRES', 'RABBITMQ', 'TEMPORAL', 'LLM'])
})

test('every stage has a loadout and at least one bullet', () => {
  for (const s of career.stages) {
    assert.ok(s.loadout.length > 0, s.id)
    assert.ok(s.bullets.length > 0, s.id)
  }
})

test('headline stats match the resume', () => {
  assert.deepEqual(career.headline.stats.map(s => s.value), ['12+', '100,000+', '550+'])
})

test('loadout has the nine resume categories in order', () => {
  assert.deepEqual(loadout.map(r => r.category),
    ['Languages', 'Backend', 'Data', 'Integrations', 'AI', 'Frontend', 'Infrastructure', 'Leadership', 'Domain'])
})

test('pit stop covers five hobbies', () => {
  assert.deepEqual(pitStop.map(p => p.label), ['GAMING', 'ANIME', 'MOVIES & TV', 'DIY', 'PAINTING'])
})
