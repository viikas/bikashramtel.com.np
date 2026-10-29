# Road Rash Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a light, daytime, 16-bit Road Rash–style racer. The road scrolls as you scroll, and a cockpit HUD tracks four career "stages". Career content comes first.

**Architecture:**
- **Pure logic modules** in `src/game/` hold the math and lookups. Each has a `node:test` unit test, with no React and no DOM:
  - road projection
  - scroll-driven speed
  - course/marker positions
  - scenery per stage
- **Content** lives in plain data files in `src/data/`.
- **Components:**
  - One fixed `<canvas>` (`RoadCanvas`) draws the road at 320×180 and is CSS-scaled with `image-rendering: pixelated`.
  - A fixed `Hud` shows the XP gauge, course map and loadout.
  - The content sections are normal-flow `<section>`s in pixel "dialog" panels over the canvas.
  - `useActiveStage` (IntersectionObserver) tells the HUD and the canvas which stage the visitor is in.

**Tech Stack:**
- Vite 5, React 18, CSS Modules
- framer-motion 11 (already installed; use its `useReducedMotion`)
- Node's built-in `node:test` for unit tests. Local Node is v18.20.8; CI uses Node 20.

**Spec:** `docs/superpowers/specs/2026-10-28-road-rash-redesign-design.md`

## Global Constraints

- **No new npm dependencies** (runtime or dev). Tests use `node --test`.
- Don't modify `.github/workflows/deploy.yml` or `CNAME`.
- Light, daytime palette only. No dark mode or theme toggle. No sound. Not a playable game.
- Every number and claim must come from the spec's Content section. Don't invent facts.
- Fonts:
  - "Press Start 2P" for the logo, headings, HUD, labels and buttons only.
  - Body text uses "Chakra Petch" (my call for the spec's "builder's choice"), weights 400 and 600, from Google Fonts.
- Hard edges everywhere: no `border-radius` and no blurred `box-shadow`. Shadows are hard offsets, e.g. `4px 4px 0 var(--ink)`.
- Palette tokens (CSS custom properties in `src/styles/global.css`):
  - sky: `--sky-1: #7ec8f5`, `--sky-2: #a6dcfa`, `--sky-3: #cdeefe`
  - grass: `--grass-1: #8fd16a`, `--grass-2: #7cc35a`, `--grass-3: #3d8f3a`
  - road: `--road-1: #7a7a86`, `--road-2: #6c6c78`
  - accents: `--rumble: #e83b3b`, `--white: #ffffff`, `--sun: #ffd93b`
  - text and panels: `--ink: #1b1b2f`, `--cream: #f4efe2`
- **Native scroll only.** No scroll-jacking and no `preventDefault` on wheel or touch.
- Canvas is `aria-hidden="true"`. Keep the skip-to-content link. All text must meet WCAG AA contrast, and text always sits on a solid panel, never directly on the scenery.
- `prefers-reduced-motion: reduce` gives a static road with no scroll-driven speed.
- The canvas loop pauses when `document.hidden` is true.
- Stage order is chronological. Stage ids:

  | Id | Company |
  |---|---|
  | `ascend` | Ascend Infotech |
  | `wisdom-mirror` | Wisdom Mirror |
  | `kodknackare` | Kodknackare |
  | `portpro` | PortPro |

- Section ids (used for anchors and the observer): `start`, `stage-ascend`, `stage-wisdom-mirror`, `stage-kodknackare`, `stage-portpro`, `loadout`, `pit-stop`, `finish`.

## Review Focus

1. **Fast scroll jumps.** Clicking a course checkpoint, the End key, or a fling on a phone can scroll thousands of pixels in one frame. Speed must stay finite and capped and never become NaN. A tab coming back from the background (huge `dt`) must not spike either. *Pinned in Task 2, `speed.test.js`.*
2. **Scrolling back up** gives a negative road offset. Stripes must still alternate correctly, with no NaN and no stuck colors. *Pinned in Task 2, `road.test.js`.*
3. **Visitor above Stage 1 or below Stage 4** (on the start screen, Loadout, Pit Stop or Finish). The HUD must show a sensible state ("START" or "FINISH") and the marker must stay within 0–100%. *Pinned in Task 2, `course.test.js`.*
4. **Phone at 360px wide.** The compact top HUD must not cover section headings when you jump to an anchor (`scroll-margin-top`), and there must be no horizontal scroll. *Pinned in Task 6, manual verification step.*
5. **Reduced-motion users** get a still frame, with no loop running and no speed changes. *Pinned in Task 2 (`nextSpeed` with `reducedMotion`) and Task 5 (manual check).*

---

### Task 1: Content data and test runner

**Files:**
- Create: `src/data/career.js`, `src/data/loadout.js`, `src/data/pitstop.js`, `src/data/content.test.js`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Produces:
  - `career` — `{ name, title, location, summary, headline: { company, role, stats: [{ label, value }] }, education, stages: Stage[] }`
  - `Stage` — `{ id, number, company, place, role, dates, loadout: string[], bullets: string[] }`
  - `loadout` — `Array<{ category: string, items: string }>`
  - `pitStop` — `Array<{ label: string, line: string }>`

- [ ] **Step 1: Add the test script and gitignore entry**

  - In `package.json` scripts, add `"test": "node --test"`. With no arguments, Node finds `**/*.test.js` and skips `node_modules`.
  - Add `.superpowers/` to `.gitignore`.

- [ ] **Step 2: Write the failing test `src/data/content.test.js`**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { career } from './career.js'
import { loadout } from './loadout.js'
import { pitStop } from './pitstop.js'

test('four stages, chronological, PortPro last', () => {
  assert.deepEqual(career.stages.map(s => s.id), ['ascend', 'wisdom-mirror', 'kodknackare', 'portpro'])
  assert.deepEqual(career.stages.map(s => s.number), [1, 2, 3, 4])
})

test('PortPro carries all seven resume bullets', () => {
  const portpro = career.stages.at(-1)
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
```

- [ ] **Step 3: Run it to confirm it fails**

  - Run: `npm test`
  - Expected: FAIL, "Cannot find module … career.js".

- [ ] **Step 4: Write the three data files**

  - **`career.js`:** copy all text verbatim from the spec's Content section: identity, summary line, stage table, PortPro bullets, earlier-stage bullets, per-stage loadout, and education.
    - `headline` is `{ company: 'PortPro', role: 'Lead Software Engineer · Container Tracking', stats: [{label:'YEARS', value:'12+'}, {label:'CONTAINERS TRACKED', value:'100,000+'}, {label:'TRUCKING COMPANIES', value:'550+'}] }`.
    - Stage `place` values:
      - `'Lalitpur'`
      - `'Kathmandu'`
      - `'Malmö, Sweden (remote)'`
      - `''` for PortPro
    - Ascend `dates`: `'2013 – 2015 · remote part-time 2017 – 2019'`.
  - **`loadout.js`:** the spec's skills table, verbatim. `items` is the comma-separated string exactly as written there.
  - **`pitstop.js`:** these exact lines, taken from the existing data files:

    | Label | Line |
    |---|---|
    | `GAMING` | `'Currently riding through Red Dead Redemption 2 on PC. Favorites: RDR2, GTA V, Halo Infinite.'` |
    | `ANIME` | `'Currently watching One Piece. All-time: Attack on Titan, Vinland Saga, Fullmetal Alchemist: Brotherhood, Berserk.'` |
    | `MOVIES & TV` | `'Currently watching A Knight of the Seven Kingdoms. Favorites: Interstellar, The Dark Knight, Breaking Bad, Dune.'` |
    | `DIY` | `'Bamboo bow & arrow, a home server rack, a drone build, a smart mirror.'` |
    | `PAINTING` | `'Canvas when the mood strikes: Mountain Sunrise, Kathmandu Nights, The Wanderer.'` |

    Before writing, check each of those titles against `src/data/gaming.js`, `anime.js`, `movies.js`, `diy.js` and `artworks.js`. Drop any title that isn't present.

- [ ] **Step 5: Run the tests to confirm they pass**

  - Run: `npm test`
  - Expected: all 6 pass.

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore src/data/career.js src/data/loadout.js src/data/pitstop.js src/data/content.test.js
git commit -m "feat: add career, loadout and pit stop content data"
```

---

### Task 2: Game logic modules (road, speed, course, scenery)

**Files:**
- Create: `src/game/road.js`, `src/game/speed.js`, `src/game/course.js`, `src/game/scenery.js`
- Test: `src/game/road.test.js`, `src/game/speed.test.js`, `src/game/course.test.js`, `src/game/scenery.test.js`

**Interfaces:**
- Produces:
  - `projectRoad({ width, height, horizon, offset, cameraHeight = 1000, stripeLength = 200, roadWidth = 2000 }) -> Row[]`
    - `Row` is `{ y, z, center, halfWidth, rumbleWidth, laneWidth, stripe: 0|1 }`, one per screen row from `horizon` to `height - 1`.
    - `center` is `width / 2` (straight road; no curves in v1).
    - `halfWidth = (roadWidth / 2) * (cameraHeight / z) * (width / 2) / cameraHeight`, scaled so the bottom row is roughly 90% of the screen width. Tune the constant and say what you chose in a code comment.
  - `nextSpeed({ current, scrollDelta, dt, reducedMotion }) -> number`
    - Constants exported: `IDLE = 40`, `MAX = 600`, `EASE = 4`.
    - Units are road units per second. `scrollDelta` is pixels scrolled since the last frame. `dt` is seconds.
  - `checkpointPercents(count) -> number[]`
  - `markerPercent(activeIndex, count, phase) -> number`, where `phase` is `'start' | 'stage' | 'finish'`.
  - `hudLabel(phase, stage) -> string`
  - `SCENERY: Record<stageId, SpriteKind[]>`, where `SpriteKind` is one of `'hill' | 'prayer-flags' | 'tree' | 'billboard' | 'container' | 'crane'`.
  - `sceneryFor(stageId | null) -> SpriteKind[]`

- [ ] **Step 1: Write the failing tests**

`road.test.js`:
```js
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
```

`speed.test.js`:
```js
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
```

`course.test.js`:
```js
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
```

`scenery.test.js`:
```js
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
```
Each file imports `test` from `node:test`, `assert` from `node:assert/strict`, and its module with a `.js` extension.

- [ ] **Step 2: Run the tests to confirm they fail**

  - Run: `npm test`
  - Expected: the 4 new files fail with module-not-found. Task 1's tests still pass.

- [ ] **Step 3: Implement the four modules to the interfaces above**

  - **Road:** for each row `y`, set `z = cameraHeight * (height - horizon) / (y - horizon + 1)` (or an equivalent). Compute `stripe = mod(Math.floor((z + offset) / stripeLength), 2)`, where `mod(a, n) = ((a % n) + n) % n`. This handles negative offsets.
  - **Speed:**
    - `target = IDLE + Math.min(Math.abs(scrollDelta) * 8, MAX - IDLE)`
    - `current + (target - current) * Math.min(1, EASE * clamp(dt, 0, 0.1))`
    - Clamp the result to `[0, MAX]`.
  - **Course:**
    - `checkpointPercents(n)[i] = (i + 0.5) * 100 / n`.
    - `markerPercent` returns 0 for `start` and 100 for `finish`. Otherwise it returns the checkpoint percent, clamped to `[0, 100]`; an index ≥ count gives 100.
  - **Scenery:**
    - `ascend`, `wisdom-mirror`: hill, prayer-flags, tree
    - `kodknackare`: tree, billboard
    - `portpro`: container, crane, billboard
    - fallback: hill, tree

- [ ] **Step 4: Run the tests to confirm they pass**

  - Run: `npm test`
  - Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/game
git commit -m "feat: add road projection, speed, course and scenery logic"
```

---

### Task 3: Daytime theme foundation

**Files:**
- Modify: `src/styles/global.css` (full rewrite of tokens and base), `index.html` (head only), `src/components/ErrorBoundary/ErrorBoundary.module.css`

**Interfaces:**
- Produces:
  - **Global CSS tokens:** the Global Constraints palette, plus:
    - `--font-pixel: 'Press Start 2P', monospace`
    - `--font-body: 'Chakra Petch', system-ui, sans-serif`
    - `--hud-h-desktop: 88px`
    - `--hud-h-mobile: 56px`
  - **Global utility classes:**
    - `.pixel-panel`: cream fill, 4px solid ink border, `6px 6px 0 var(--ink)` shadow
    - `.pixel-heading`: pixel font, ink, uppercase
    - `.pixel-btn`: rumble-red fill, white pixel text, ink border, hard shadow; `:active` moves 2px and shrinks the shadow
    - `.blink`: a `steps(1)` blink animation, disabled under reduced motion
    - `.sr-only`: keep the existing one
  - `section { scroll-margin-top }`: `16px` on desktop and `calc(var(--hud-h-mobile) + 12px)` at ≤ 720px.

- [ ] **Step 1: Rewrite `global.css`**

  - Replace the "Midnight Amber" tokens and the dark `body`, `::-webkit-scrollbar` and `.glow-orb` rules.
  - Keep the reset and `.sr-only`.
  - Set `body` to the `--sky-3` background, `--ink` text and the body font.
  - Add `html { scroll-behavior: smooth }`, wrapped in `@media (prefers-reduced-motion: no-preference)`.
  - Add `body { overflow-x: hidden }`.

- [ ] **Step 2: Update the `index.html` head**

  - **Title:** `Bikash Ramtel | Lead Software Engineer`
  - **Description:** `Bikash Ramtel — Lead Software Engineer at PortPro, leading the Container Tracking module that tracks 100,000+ containers in real time across North American ports and rail. 12+ years building production web platforms. Kathmandu, Nepal.` Use the same text for OG and Twitter.
  - **`theme-color`:** `#7ec8f5`
  - **JSON-LD:**
    - `jobTitle`: `Lead Software Engineer`
    - `knowsAbout`: `["Container tracking","Logistics automation","Node.js","React","MongoDB","PostgreSQL","Event-driven architecture","LLM integration","Web scraping"]`
  - **Keywords:** career-first. Drop otaku and anime, and keep name, location and the tech.
  - **Fonts:** replace the Fraunces/Syne/JetBrains link with `family=Press+Start+2P&family=Chakra+Petch:wght@400;600&display=swap`.
  - Leave `og:image` untouched.

- [ ] **Step 3: Restyle the ErrorBoundary CSS** to `.pixel-panel` look using the new tokens. Replace any `var(--amber)` or `var(--bg)` with the new tokens.
  - Run: `grep -rn "var(--amber\|var(--bg\|var(--teal\|var(--ember" src/components/ErrorBoundary src/styles`
  - Expected: no output.

- [ ] **Step 4: Build**

  - Run: `npm run build`
  - Expected: success. The old components will look broken, which is fine; they're replaced in Task 4.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css index.html src/components/ErrorBoundary/ErrorBoundary.module.css
git commit -m "feat: daytime 16-bit theme tokens, fonts and career-first meta"
```

---

### Task 4: Content sections and App rewrite

**Files:**
- Create (each with its own `.module.css`):
  - `src/components/StartLine/StartLine.jsx`
  - `src/components/Stage/Stage.jsx`
  - `src/components/Loadout/Loadout.jsx`
  - `src/components/PitStop/PitStop.jsx`
  - `src/components/FinishLine/FinishLine.jsx`
- Modify: `src/App.jsx`
- Delete:
  - component folders: `Hero/` (including `ArtCanvas.jsx`), `Gaming/`, `Anime/`, `Movies/`, `DIY/`, `Art/`, `Skills/`, `About/`, `Navbar/`, `Footer/`
  - `src/hooks/useImages.js`
  - `src/services/images.js`
- Keep untouched: `src/services/api.js`, `config.js`, `supabase.js`, and the existing hobby data files. They're the Supabase-ready layer and nothing imports them, so they don't ship.

**Interfaces:**
- Consumes: `career`, `loadout`, `pitStop` (Task 1); `socialLinks`, `contactInfo` (existing `src/data/contact.js`); `about.quickFacts` (existing `src/data/about.js`); and the CSS utilities from Task 3.
- Produces:
  - `<StartLine onStart={() => void} />` with `id="start"`
  - `<Stage stage={Stage} />` with `id={'stage-' + stage.id}`
  - `<Loadout />` with `id="loadout"`
  - `<PitStop />` with `id="pit-stop"`
  - `<FinishLine />` with `id="finish"`

  Each renders a `<section>` with the given id and a real `<h2>` (StartLine uses the page's only `<h1>`).

- [ ] **Step 1: StartLine**

  - **Pixel logo** `<h1>`: "BIKASH RAMTEL", rumble red with a hard ink text-shadow.
  - **Subtitle:** "LEAD SOFTWARE ENGINEER".
  - **Summary:** `career.summary` in a `.pixel-panel`.
  - **Headline strip:** `career.headline.role` @ `career.headline.company`, plus the three stats as pixel badges.
  - **Start button:** `.pixel-btn` "PRESS START ▶" with `.blink` on the arrow. It calls `onStart`, which scrolls to `#stage-ascend`.
  - **Layout:** min-height `100svh`, with the content in the upper half so the road shows below. On desktop, leave `--hud-h-desktop` of bottom padding.

- [ ] **Step 2: Stage**

  - **Header row:** `STAGE {number}` badge, then company (h2), role, place and dates.
  - **Body:** the bullets as a `<ul>` in body font, 16–17px, line-height ≥ 1.55.
  - **Loadout chips:** `stage.loadout` as pixel chips.
  - **PortPro emphasis:** the panel is wider (max ~860px vs ~680px) and gets a "CURRENT LAP" ribbon.
  - **Spacing:** sections get ~40vh of vertical spacing between them so the road shows through.

- [ ] **Step 3: Loadout**

  - **Content:** an "EQUIPMENT" screen. A `<dl>` grid with each category in pixel font on the left and its items in body font on the right.
  - **Layout:** stacks to one column at ≤ 720px.

- [ ] **Step 4: PitStop**

  - **Content:** heading "PIT STOP", the five `pitStop` rows, then `about.quickFacts` as small stat tiles.
  - **Size:** visibly smaller than a stage panel.

- [ ] **Step 5: FinishLine**

  - **Banner:** a checkered-flag strip (a CSS `conic-gradient` checkerboard).
  - **Heading:** "CONTINUE?" with a 9→0 countdown, decorative and `aria-hidden`.
  - **Links:** `contactInfo` and `socialLinks` as `.pixel-btn` links. External links get `target="_blank" rel="noopener noreferrer"`.
  - **Education:** `career.education`.
  - **Footer line:** a small "© {year} Bikash Ramtel".

- [ ] **Step 6: Rewrite `App.jsx`**

  - **Skip link:** keep it; restyle its inline colors to `--rumble` and `--white`.
  - **`<main id="main">`:** StartLine, then the four Stages (map over `career.stages`), then Loadout, PitStop and FinishLine.
  - **ErrorBoundary:** wrap each section in `ErrorBoundary`, as today.
  - **Leave room for Tasks 5–6:** a `RoadCanvas` slot before `<main>` and a `Hud` slot after it, added there.
  - **Delete** the files listed above.

- [ ] **Step 7: Verify**

  - **Build:** `npm run build` should succeed.
  - **Unused code:** `grep -rn "useImages\|services/images\|ArtCanvas\|Navbar\|Footer" src` should return no output.
  - **Visual check:** run `npm run dev` and open the page. Check that:
    - all eight section ids exist (`document.querySelectorAll('main section[id]').length === 8`)
    - text sits on solid panels
    - there's no horizontal scroll at 360px width

- [ ] **Step 8: Commit**

```bash
git add -A src
git commit -m "feat: career-first racing sections; remove hobby galleries"
```

---

### Task 5: RoadCanvas (the road and scenery)

**Files:**
- Create: `src/components/RoadCanvas/RoadCanvas.jsx`, `RoadCanvas.module.css`, `src/components/RoadCanvas/sprites.js`
- Modify: `src/App.jsx` (mount `<RoadCanvas activeStageId={…} />` before `<main>`)

**Interfaces:**
- Consumes:
  - from `src/game/road.js`: `projectRoad`
  - from `src/game/speed.js`: `nextSpeed`
  - from `src/game/scenery.js`: `sceneryFor`
  - from framer-motion: `useReducedMotion`
- Produces:
  - `<RoadCanvas activeStageId={string | null} />`. Task 6 passes in the observed id; until then App passes `null`.
  - `sprites.js` exports `drawSky`, `drawHills`, `drawBike(ctx, x, y, lean)`, and `drawSprite(ctx, kind, x, y, scale)`, where `kind` is a `SpriteKind`. Each is a pure canvas-drawing function that uses `fillRect` only and the palette hexes from Global Constraints.

- [ ] **Step 1: Write the sprites**

  - Draw everything with `fillRect` on whole-pixel coordinates. No anti-aliased paths.
  - Bike and rider: ~16×24 px, seen from behind, with a red jacket and a dark bike. `lean` (−1…1) shifts the top rows by up to 2px.
  - `container`: stacked 2-high boxes in red, blue or green with ribbing lines.
  - `crane`: a gantry silhouette.
  - `prayer-flags`: a pole with a sagging string of 5 colored squares.
  - `billboard`: a white board on a post with a few ink "text" bars.

- [ ] **Step 2: Implement RoadCanvas**

  - **Canvas setup:**
    - Fixed `inset: 0`, `z-index: 0`, `pointer-events: none`, `aria-hidden="true"`.
    - The internal canvas is 320×180. Recompute height on resize so the aspect matches the viewport: `width = 320`, `height = round(320 * innerHeight / innerWidth)`, clamped to 140–400.
    - CSS `width: 100vw; height: 100svh; image-rendering: pixelated`.
    - Horizon at 50% of height.
  - **Animation loop:** a `requestAnimationFrame` loop. Each frame:
    1. Read `scrollY`; `scrollDelta` is the change since the last frame.
    2. Update speed with `nextSpeed`.
    3. Advance `offset += speed * dt`.
    4. Draw the sky bands, sun, hills, and grass rows, alternating `--grass-1`/`--grass-2` by `row.stripe`.
    5. Draw the rumble strips and road, alternating `--road-1`/`--road-2`.
    6. Draw the center lane dash on `stripe === 0` only.
  - **Roadside sprites:**
    - Place `sceneryFor(activeStageId)` sprites at fixed world-z intervals.
    - Project them with the same `z` → screen-row mapping, scale by row, and alternate left and right of the road edge.
    - When `activeStageId` changes, swap the set.
  - **Bike:**
    - Draw it last, centered just above the bottom.
    - `lean = clamp(scrollDelta / 30, -1, 1)`, eased toward 0.
  - **Pausing and reduced motion:**
    - Stop the loop on `visibilitychange` when `document.hidden`, and resume with `dt` reset.
    - If `useReducedMotion()` is true, draw exactly one frame (offset 0, no loop) and redraw only on resize or stage change.
  - **Cleanup:** cancel the frame and remove all listeners on unmount.

- [ ] **Step 3: Verify**

  - **Build and tests:** `npm run build && npm test` should both pass.
  - **Visual check:** run `npm run dev`. Check that:
    - the road stripes rush when you scroll and settle to a slow cruise when you stop
    - scrolling up still moves forward
    - the scenery switches to containers and cranes at the PortPro stage (temporarily pass `'portpro'` to test before Task 6)
  - **Reduced motion:** in Chrome DevTools, open Rendering, set "Emulate CSS prefers-reduced-motion: reduce", and reload. The road should be still, and the Performance panel should show no rAF loop.
  - **Background tab:** switch tabs for 30s and come back. There should be no speed spike.

- [ ] **Step 4: Commit**

```bash
git add src/components/RoadCanvas src/App.jsx
git commit -m "feat: pixel pseudo-3D road canvas with per-stage scenery"
```

---

### Task 6: HUD and active-stage tracking

**Files:**
- Create: `src/hooks/useActiveStage.js`, `src/components/Hud/Hud.jsx`, `Hud.module.css`
- Modify: `src/App.jsx` (call the hook, pass the result to `RoadCanvas` and `Hud`)

**Interfaces:**
- Consumes:
  - from `src/game/course.js`: `checkpointPercents`, `markerPercent`, `hudLabel`
  - from Task 1: `career.stages`
  - from Task 5: `RoadCanvas` with the `activeStageId` prop
- Produces:
  - `useActiveStage(stageIds: string[]) -> { phase: 'start'|'stage'|'finish', stageId: string|null, index: number }`
    - Observe `#start`, every `#stage-{id}`, `#loadout`, `#pit-stop` and `#finish` with `IntersectionObserver`, using `rootMargin: '-45% 0px -45% 0px'` (a line through the middle of the viewport).
    - `start` gives phase `start`. A stage section gives phase `stage`. Loadout, pit-stop and finish give phase `finish`, with `index = -1`.
    - Initial state is `start`.
  - `<Hud phase stageId index />`

- [ ] **Step 1: Implement `useActiveStage`** to the interface above. Disconnect the observer on unmount.

- [ ] **Step 2: Implement the Hud**

  - **Container:** `<nav aria-label="Course">`.
  - **Desktop (> 720px):** a fixed bottom bar, `height: var(--hud-h-desktop)`, cream with a 4px ink top border, holding three boxes:
    1. **XP:** a segmented red/white gauge (CSS `repeating-linear-gradient`). Fill width runs from the marker percent to 100% at finish. Labeled "XP 12+ YRS".
    2. **COURSE:** `hudLabel(phase, stage)` above a track bar. The 4 checkpoints are `<a href="#stage-{id}">` elements with `aria-label="Stage {n}: {company}"`, placed at `checkpointPercents(4)`. The rider marker sits at `markerPercent(index, 4, phase)` with a `left` transition of 300ms (none under reduced motion). The current checkpoint is filled `--rumble` and has `aria-current="step"`.
    3. **LOADOUT:** the current stage's `loadout` joined with " · ". It reads "READY" at start and "ALL SYSTEMS" at finish.
  - **Phone (≤ 720px):** a fixed top bar, `height: var(--hud-h-mobile)`, showing only the label and the course track. The XP and LOADOUT boxes are hidden.
  - **Spacing:** add `padding-bottom: var(--hud-h-desktop)` to `main` on desktop and `padding-top: var(--hud-h-mobile)` on mobile so the bar never covers the last or first content.

- [ ] **Step 3: Wire into App.** Call `const active = useActiveStage(career.stages.map(s => s.id))`. Render `<RoadCanvas activeStageId={active.stageId} />` and `<Hud {...active} />`.

- [ ] **Step 4: Verify (includes Review Focus 3 and 4)**

  - **Build and tests:** `npm run build && npm test` should both pass.
  - **Desktop:** run `npm run dev` at full width. Scrolling through the page should take the label from START to STAGE 1 · ASCEND INFOTECH, through to STAGE 4 · PORTPRO, and then FINISH. The marker should never leave the track.
  - **Checkpoint links:** clicking checkpoint 2 should scroll to Wisdom Mirror, with its heading not hidden under the HUD. The road should speed up but stay capped.
  - **Keyboard:** Tab should reach all 4 checkpoints, each with a visible focus outline (2px ink plus `--sun` offset).
  - **Phone (360×740 in DevTools device mode):**
    - The top HUD shows, with no bottom bar.
    - There's no horizontal scroll.
    - Jumping to `#stage-portpro` leaves its heading fully visible below the top bar.
    - The start screen's "PRESS START" is visible without scrolling.
  - **Full-page contrast check:** in DevTools, open Lighthouse, then Accessibility. There should be no contrast failures.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActiveStage.js src/components/Hud src/App.jsx
git commit -m "feat: cockpit HUD with course map, XP gauge and stage loadout"
```
