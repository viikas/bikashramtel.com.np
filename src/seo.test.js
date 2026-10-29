import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const meta = (attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1]

test('title fits a search result (≤ 60 chars) and leads with name and role', () => {
  const title = html.match(/<title>([^<]*)<\/title>/)[1]
  assert.ok(title.length <= 60, `${title.length}: ${title}`)
  assert.match(title, /^Bikash Ramtel — Lead Software Engineer/)
})

test('meta description fits a search result (≤ 160 chars)', () => {
  const d = meta('name', 'description')
  assert.ok(d && d.length >= 70 && d.length <= 160, `${d?.length}: ${d}`)
})

test('link previews carry title, description, image and alt text', () => {
  for (const [attr, name] of [['property', 'og:title'], ['property', 'og:description'], ['property', 'og:image'],
    ['property', 'og:image:alt'], ['name', 'twitter:title'], ['name', 'twitter:description'], ['name', 'twitter:image:alt']]) {
    assert.ok(meta(attr, name), `missing ${name}`)
  }
})

test('favicon and preview image exist in public/', () => {
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/favicon.svg"/)
  for (const f of ['../public/favicon.svg', '../public/og-image.png']) assert.ok(existsSync(new URL(f, import.meta.url)), f)
})

test('structured data is valid JSON describing the person', () => {
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const person = json['@graph'].find(n => n['@type'] === 'Person')
  assert.equal(person.jobTitle, 'Lead Software Engineer')
  assert.equal(person.alumniOf.name, 'Purbanchal University')
  assert.ok(json['@graph'].some(n => n['@type'] === 'WebSite'))
})
