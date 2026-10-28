# Portfolio Redesign: "Road Rash" Daytime Racer

Date: 2026-10-28 · Site: https://bikashramtel.com.np

## Intent

Redesign Bikash Ramtel's portfolio as a **light, daytime, 16-bit motorcycle racing game** in the spirit of Road Rash (Sega Genesis). The feeling a visitor should get is **racing: speed and forward motion**, not combat, menus, or a playable game.

The site also changes what it says. The current site leads with hobbies (gaming, anime, movies, DIY, painting) and treats code as an aside. The new site **leads with his engineering career**. He is a Lead Software Engineer at PortPro who owns the Container Tracking module (100,000+ containers tracked in real time across North American port, rail, and terminal systems, for a TMS used by 550+ trucking companies). The racing theme is how the site looks. It must never get in the way of a recruiter or hiring manager reading his experience.

## Chosen direction (Bikash picked option B from mockups)

The visitor is "in the race." The screen shows:

- **Road scene:** a pseudo-3D road running to the horizon, seen from behind the rider. It uses the classic Road Rash construction: alternating light and dark stripes, red-and-white rumble strips, a white center dash, green rolling hills, a blue banded sky, and a sun.
- **Cockpit HUD:** a chunky dashboard bar showing:
  - **XP gauge:** a speedometer-style meter labeled "12+ YRS"
  - **Course map:** a track with the five jobs as checkpoints and a marker for where the visitor is now
  - **Loadout:** the tech used at the current stage
- **Stage cards:** each job is a "stage", for example `STAGE 5 · PORTPRO · 2021 → NOW`.

Reference mockup: `.superpowers/brainstorm/87854-1793185756/content/direction-v2.html`, card B.

## Goals

1. Within one screen, a visitor knows who he is (name, Lead Software Engineer, PortPro, Container Tracking at 100k+ containers) and feels the racing theme.
2. **Scrolling = riding.** Scrolling advances the bike along the course, road speed follows scroll speed, and the HUD updates as the visitor passes each stage.
3. All career content from the resume is present and comfortably readable.
4. Light, daytime palette throughout. No dark mode.
5. Works well on a phone, including the HUD.

## Non-goals

- A playable game. There's no steering, no score, and no combat.
- Sound or music.
- Dark mode or a theme toggle.
- Supabase or backend work. The data layer stays as plain JS data files.
- Regenerating the OG share image. *(My call: deferred to a later pass. The meta text still gets updated.)*

## Anti-goals (would be a failure even if it "works")

- Body text in a pixel font that is tiring to read, or text that is low-contrast against the scenery.
- **Scroll-jacking.** Native scrolling must stay native. The animation reacts to scroll; it never takes it over.
- Choppy scrolling or a hot phone. The canvas must be cheap to run.
- Reading as a generic template with a pixel font pasted on top.
- Invented facts. Every number and claim comes from the resume or the existing data files.

## Constraints

- **Stack (my call: build on what exists):**
  - Vite 5, React 18, CSS Modules, and plain JS data files under `src/data/`
  - `framer-motion` is already installed and may be used
  - **No new npm dependencies**
- **Deployment:** GitHub Pages via `.github/workflows/deploy.yml`, with custom domain `CNAME`. Don't change either.
- **Rendering:** the road and scenery are drawn on `<canvas>`, the way the current hero uses `ArtCanvas.jsx`. They're rendered at a low internal resolution (around 320×180) and scaled up with `image-rendering: pixelated`. All sprites (bike, rider, roadside objects) are drawn in code. No image assets are required.
- **Motion:**
  - Respect `prefers-reduced-motion`: show a static road and no scroll-driven speed.
  - Pause the animation loop when the tab is hidden or the canvas is offscreen.
- **Accessibility:**
  - Keep the skip-to-content link, semantic sections and headings, keyboard-reachable navigation, and WCAG AA contrast for all text.
  - The canvas is decorative (`aria-hidden`).

## Content (source: resume, Oct 2026)

**Identity:** Bikash Ramtel · Lead Software Engineer · Kathmandu, Nepal.

**Summary line:** Lead Software Engineer with 12+ years building production web platforms and 5+ years leading the Container Tracking module of PortPro's drayage TMS (550+ trucking companies, 100,000+ containers tracked in real time).

**Stages, in chronological order, so the race ends at the present:**

| Stage | Role · Company | Dates | Content |
|---|---|---|---|
| 1 | Web Developer · Ascend Infotech, Lalitpur | 2013–2015, remote part-time 2017–2019 | Patient registry and dialysis tracking system for the National Kidney Center; remote projects for US stakeholders (Laravel, AngularJS, React) |
| 2 | Full Stack Developer · Wisdom Mirror Pvt Ltd, Kathmandu | 2016–2019 | Built Karma CRM (SaaS) from scratch, scrum master for the two-year build, solo React app in the final year; led the SkyCRM team (Laravel, AngularJS, MySQL) |
| 3 | Lead Full Stack Developer · Kodknackare Webblösningar AB, Malmö (remote) | 2019–2021 | Led the Kod CMS v3 team, owned the React front end and PHP back end, coordinated with the CEO in Sweden |
| 4 | Lead Software Engineer · PortPro | Apr 2021 – Present | All seven resume bullets: team lead, 100k+ container real-time tracking, extraction/normalization pipelines, pickup and return appointment automation, event-driven services, LLM extraction in production, scraping and integration layers |

Note: the resume lists **four** jobs, but the mockup course map showed five checkpoints. The course has as many checkpoints as there are jobs. *(My call: four stages, numbered 1–4, with PortPro as Stage 4, the final "current lap".)* PortPro gets the most space and detail.

**PortPro bullets (verbatim from resume):**

- Lead the engineering team that owns Container Tracking, a core module of PortPro's transportation management platform. Set architecture, plan development, review implementation, and resolve the hardest technical problems.
- Designed and built a real-time tracking system that monitors 100,000+ containers, pulling statuses, holds, and events from port terminals, rail carriers, and third-party data providers across North America.
- Built extraction, normalization, and validation pipelines that turn inconsistent external data into a single reliable container record consumed by downstream dispatch, billing, and tracking workflows.
- Automated container pickup and return appointment booking through terminal systems, including appointment lookup, submission, and confirmation processing.
- Designed event-driven services that react to container status changes to trigger and update logistics workflows, cutting manual data gathering and coordination for carrier operations teams.
- Shipped LLM-based functionality for information extraction and interpretation, evaluating AI approaches for production reliability and integrating them into established workflows.
- Maintain web-scraping and integration layers against constantly changing third-party interfaces, diagnosing and fixing data availability and accuracy issues in production.

**Earlier stages (verbatim from resume):**

- *Kodknackare:* Led the development team building Kod CMS v3, a content management and e-commerce platform, owning the React front end and PHP back end and coordinating delivery with the CEO in Sweden.
- *Wisdom Mirror:*
  - Built Karma CRM, a SaaS client and project management product, from scratch. Served as scrum master for the two-year build and delivered the React application solo for its final year.
  - Led the development team for SkyCRM, an inventory, pricing, and quotation system for an aluminium fabrication company (Laravel, AngularJS, MySQL).
- *Ascend Infotech:* Designed and delivered a patient registry and dialysis tracking system for the National Kidney Center, and built remote projects for US-based stakeholders in Laravel, AngularJS, and React.

**Loadout (skills table, verbatim from resume):**

| Category | Items |
|---|---|
| Languages | JavaScript, TypeScript, Python, SQL, PHP |
| Backend | Node.js, Hapi.js, Express, REST APIs, event-driven architecture, RabbitMQ, Redis, Temporal |
| Data | MongoDB, PostgreSQL, TimescaleDB, MySQL |
| Integrations | Web scraping (Puppeteer, Playwright), port, rail, and terminal APIs, webhooks, appointment systems |
| AI | LLM integration (OpenAI, Claude), structured extraction, RAG, AI agents, MCP tool use |
| Frontend | React, Redux |
| Infrastructure | AWS, Docker, CI/CD, monitoring with New Relic and CloudWatch |
| Leadership | System design, technical planning, code review, mentoring, cross-team coordination |
| Domain | Container lifecycle, port and rail terminal operations, drayage, appointment booking |

**Per-stage HUD loadout** *(my call: taken from the tech each job names, with PortPro's taken from the resume skills it lists)*:

| Stage | Loadout |
|---|---|
| 1 · Ascend | LARAVEL · ANGULARJS · REACT |
| 2 · Wisdom Mirror | REACT · LARAVEL · ANGULARJS · MYSQL |
| 3 · Kodknackare | REACT · PHP |
| 4 · PortPro | NODE · MONGO · POSTGRES · RABBITMQ · TEMPORAL · LLM |

The full skills table appears in its own Loadout section.

**Education:** BE Computer Engineering, Purbanchal University, College of Information Technology & Engineering, Kathmandu.

**Contact (from `src/data/contact.js`):**
- email
- WhatsApp
- location
- GitHub
- LinkedIn
- Instagram

## Page structure

1. **Start line (full viewport).** The road scene with HUD.
   - Pixel logo: "BIKASH RAMTEL".
   - Subtitle: "LEAD SOFTWARE ENGINEER".
   - The summary line in readable type.
   - A blinking "PRESS START ▶" button that scrolls to Stage 1.
   - Because the stages run chronologically, the start screen must already surface the PortPro headline (role, Container Tracking, 100k+, 550+) so nobody has to scroll to find it.
2. **Stages 1–4.** One section per job, styled as a 16-bit dialog or billboard panel (white or cream fill, thick dark pixel border, hard drop shadow) laid over the road. PortPro is the longest.
3. **Loadout.** The full skills table, styled like a game's equipment screen.
4. **Pit Stop (hobbies).** *(My call.)* One compact section with a few lines on gaming, anime, movies, DIY, and painting, plus the existing "quick facts" numbers from `src/data/about.js`. The five separate hobby gallery sections and their API-powered cover art (RAWG/TMDB) are removed from the page. Their components can stay in git history.
5. **Finish line / Contact.** A checkered flag and a "CONTINUE?"-style call to action, with contact and social links. Education sits here or in Loadout.

## Visual system

- **Palette (daytime Genesis):**
  - sky blues in bands (`#7ec8f5`, `#a6dcfa`, `#cdeefe`)
  - grass greens (`#8fd16a`, `#7cc35a`, `#3d8f3a`)
  - asphalt greys (`#7a7a86`, `#6c6c78`)
  - rumble red `#e83b3b` and white
  - sun yellow `#ffd93b`
  - ink `#1b1b2f` for borders and text
  - cream panel `#f4efe2`
  - Exact values may be tuned. Define them as CSS custom properties in `global.css`, replacing the current "Midnight Amber" tokens.
- **Type:**
  - "Press Start 2P" (Google Fonts) for the logo, headings, HUD, labels, and buttons only.
  - A readable non-pixel font for paragraphs and bullets. Which one is the builder's choice; it should feel at home next to the pixel font.
- **Shapes:** hard edges, no border-radius, no soft blur shadows, stepped (`steps()`) animations where it suits the 16-bit feel.
- **Scenery by stage** *(a goal worth reaching, not a requirement)*: roadside sprites change as the visitor progresses. Kathmandu hills and prayer-flag poles fit the early stages. **Shipping containers and gantry cranes** belong at the PortPro stage, which ties the art to his actual domain.

## Behavior

- **Road layer:** one fixed, full-viewport canvas behind all content. Road speed comes from scroll velocity, eases back to a slow idle cruise when scrolling stops, and the bike leans slightly while scrolling.
- **HUD:**
  - Desktop: a fixed bottom bar.
  - Phone: a compact fixed top bar showing the stage name and a progress strip, so content isn't squeezed. The builder may adjust the details.
  - Course-map checkpoints are links that jump to their stage.
  - The current stage is tracked with `IntersectionObserver`.
- **Navbar:** the current `Navbar` is replaced by the HUD's course map.
- **SEO/meta (`index.html`):**
  - Update the title, description, OG and Twitter text, and the JSON-LD `jobTitle` and `knowsAbout` to the career-first framing.
  - Change `theme-color` to a light value.
  - Remove the now-unused Fraunces/Syne/JetBrains Mono fonts.

## Left to the builder

- Component breakdown and file names. New data goes in `src/data/` (for example a `career.js`), and `skills.js` and `about.js` are updated or replaced to match the resume.
- The exact canvas pseudo-3D technique (classic segment projection is fine) and how roadside sprites are drawn.
- The body font, exact colors, spacing, and sizes.
- Removing unused components, data, and services (`Gaming`, `Anime`, `Movies`, `DIY`, `Art`, `ArtCanvas`, `services/images.js` RAWG/TMDB calls) once nothing imports them. The RAWG/TMDB env vars in the deploy workflow can stay; they're harmless.
- Adding `.superpowers/` to `.gitignore`.
