# bikashramtel.com.np

Portfolio of **Bikash Ramtel**, Lead Software Engineer at PortPro, styled as a daytime 16-bit motorcycle racer (Road Rash-inspired).

🌐 Live at [bikashramtel.com.np](https://bikashramtel.com.np)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (node --test)
npm run build    # production build → dist/
```

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## How it's put together

| Path | What lives there |
|---|---|
| `src/data/` | All content: `career.js` (resume), `loadout.js` (skills), `pitstop.js` (hobbies), `billboards.js` (roadside messages), `contact.js` |
| `src/game/` | Pure, unit-tested logic: road projection and curves, speed, rivals, course map, scenery, pixel font, canvas sizing |
| `src/components/RoadCanvas/` | The fixed pixel-art road: `scene.js` draws a frame, `sprites.js` holds the sprites |
| `src/components/Hud/` | Dashboard: speedometer, XP gauge, course map, per-stage loadout |
| `src/components/*` | Page sections: StartLine, Stage, Loadout, PitStop, FinishLine |

Every claim on the site comes from the resume; update `src/data/` to change content.

## Link-preview image

`public/og-image.png` is generated from the same road scene. With `npm run dev` running:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=4000 \
  --screenshot=public/og-image.png "http://localhost:5173/scripts/generate-og-image.html"
```
