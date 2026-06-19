# Project Brief — Quantum Resonance Scan Glossary

This document is a handoff brief summarizing all work completed so far, intended
to give a new session (e.g. Claude Code) full context without re-explaining
from scratch.

---

## 1. What this project is

A health-parameter reference glossary, originally exported from a 76-page Word
document (`Quantum Resonance Scan Glossary.htm`), rebuilt as a single
self-contained `index.html` web app, and packaged as a Windows desktop app via
Electron.

**Repo:** `kobusvanwyk/qunatum-resonance-scan-glossary` on GitHub
**Git identity:** `kobusvanwyk` / `kobus.vanwyk.84@gmail.com`

### Branches
- **`develop`** — the web app only (`index.html`, source `.htm`, no Electron files)
- **`feature/electron-app`** — everything in `develop` PLUS the Electron desktop
  wrapper (`package.json`, `electron/`, `BUILD.md`). This is the active branch
  for ongoing work. It has NOT yet been merged back into `develop`.

---

## 2. The core artifact: `index.html`

A single self-contained HTML file (~495KB) with all CSS and JS inline — no
build step, no external dependencies except Google Fonts (DM Sans, DM Serif
Display) loaded via CDN link tag.

### Content structure
- **45 sections**, **288 parameters** total, each with a plain-English
  description (no medical jargon — explains what's measured and what
  high/low values mean practically)
- Content originated from the source `.htm` document; many sections had
  awkward machine-translated (Chinese→English) text that was rewritten
- 8 sections had **zero content** in the source ("Missing Information") and
  were written from scratch: Gallbladder Function, Lung Function, Channels &
  Collaterals, Pulse of Heart and Brain, Blood Lipids, Sperm and Semen, Human
  Immunity, Human Consciousness Level
- **Human Consciousness Level was later removed entirely** at the user's request
  (was the Hawkins consciousness scale — out of scope for this glossary)
- **4 female-specific sections were added** after "Male Hormone" (see section 6
  below) to parallel the existing male sections (Prostate, Male Sexual
  Function, Sperm and Semen, Male Hormone)

### Section/parameter HTML structure (important for future edits)
Each section follows this exact pattern — **maintain this structure for any
new sections** so search/sidebar/print all work automatically with zero extra
wiring:

```html
<!-- Sidebar nav link -->
<a class="nav-link" href="#slug-id" id="nav-slug-id" onclick="navClick('slug-id',event)">
    <span class="nav-icon">🌸</span>
    <span class="nav-name">Section Title</span>
    <span class="nav-count">5</span>
</a>

<!-- Section block (in main content area) -->
<section class="section-block" id="slug-id" data-name="section title lowercase">
    <div class="section-header">
        <div class="s-badge">🌸</div>
        <h2 class="s-title">Section Title</h2>
        <span class="s-count">5 parameters</span>
    </div>
    <div class="param-list">
        <div class="param-card" data-pname="param name lowercase" data-pdesc="description lowercase, truncated to 300 chars">
            <div class="param-head" onclick="toggleCard(this.parentElement)">
                <div class="p-dot"></div>
                <div class="p-name">Param Name</div>
                <svg class="p-chevron" ...><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="param-body">
                <div class="p-desc">Full plain-English description here.</div>
            </div>
        </div>
        <!-- more param-card divs -->
    </div>
</section>
```

The `data-pname` / `data-pdesc` attributes are what the search reads. The
`id` (slug) must match between the nav link and the section block, and must
be a kebab-case slug of the title.

### Features implemented
- **Sidebar navigation** — left panel, all sections listed, click to jump,
  active-section highlighting on scroll, plus a filter input to narrow the
  visible list by typing
- **Search** — top bar, substring match (case-insensitive) across parameter
  names + descriptions + section names. NOTE: this was originally a "fuzzy"
  character-sequence matcher but that produced false positives (e.g. "xyz"
  matching unrelated text) and was deliberately simplified to plain substring
  matching. Do not reintroduce loose fuzzy matching without discussing tradeoffs.
  - Shows a "No Search Results Found" panel with the search term echoed back
    when nothing matches
  - Highlights matches with `<mark>` tags
- **Accordion parameter cards** — click header to expand/collapse; first card
  in each section auto-opens by default
- **Light/dark mode toggle** — top-right icon button (sun/moon), animated
  icon transition. **Light mode is the default** (only switches to dark if
  user explicitly toggles; preference saved in `localStorage` under key
  `theme`, value `"dark"` when dark is active, otherwise light is assumed)
- **Zoom controls** — top bar, "Zoom" label + minus button + percentage +
  plus button. Steps: 70/80/90/100/110/125/150/175/200%. Implemented via
  `document.documentElement.style.zoom` (CSS zoom property on the `<html>`
  element) — NOT `font-size`, because the CSS uses hardcoded `px` throughout
  and font-size scaling does not cascade to px-based children. Keyboard
  shortcuts: Ctrl/Cmd +/- to zoom, Ctrl/Cmd+0 to reset. Saved in
  `localStorage` under key `zoom`. Hidden in print and on mobile (<768px).
- **Print styles** (`@media print`) —
  - Each section starts on a new page (`page-break-before: always` +
    `break-before: page`)
  - Auto-generated table of contents on page 1 (built by JS on the
    `beforeprint` event, function `buildPrintToc()`) listing every section
    with icon + name + dotted leader + an **empty outlined box** instead of
    a page number — the user fills these in manually with Acrobat Pro after
    printing, because browser-calculated page numbers proved unreliable
    (drift of several pages by the end of a long document; there is no
    browser-supported CSS cross-reference mechanism for this)
  - Footer via `@page` margin boxes: title bottom-left, page number
    (`counter(page)`) bottom-right
  - All accordion cards forced open, sidebar/topbar/toggle/chevrons hidden,
    colors forced to a print-safe light palette regardless of active theme

---

## 3. Brand style guide (applied across UI + print)

```
Primary accent (coral red):  #F24C5A
Warm accent (orange):        #F39442
Secondary accent (pink):     #FF7384
Info/link accent (blue):     #2F80ED  (hover: #1C5FCC)

Light mode (default):
  background: #F5F5F5
  surface:    #FFFFFF
  surface-2:  #EBEBEB
  border:     #E0E0E0
  text:       #111111

Dark mode:
  background: #1a1212
  surface:    #251818
  surface-2:  #2e1f1f
  border:     #3d2929
  text:       #F5F5F5

Font: DM Sans (body/headings), DM Serif Display (section titles, logo wordmark)
UI shape language: pill-shaped buttons/inputs (border-radius: 999px),
  rounded badges, 2px coral border under section headers
```

All CSS variables live in `:root` (dark, fallback) and `:root.light`
(overrides) near the top of the `<style>` block.

A proper brand logo exists at **`quantum-logo.svg`** (repo root) — full
wordmark with the atom-style icon mark, used in the topbar via
`<img src="quantum-logo.svg">`. **Path must remain relative** (no leading
`/`) — an absolute path breaks Electron's `file://` protocol resolution in
the packaged app even though it works fine in a normal browser.

---

## 4. Electron desktop app (`feature/electron-app` branch only)

### Files
```
package.json          — electron-builder config, scripts, deps
electron/main.js       — BrowserWindow setup, app lifecycle
electron/icon.ico      — app icon (must be genuine multi-size ICO binary,
                         NOT a renamed PNG — rcedit will reject it; also
                         must be ≥256×256 for the largest frame)
electron/installer-sidebar.bmp  — 164×314px, 24-bit BMP, NSIS welcome/finish page
electron/installer-header.bmp   — 150×57px, 24-bit BMP, NSIS inner pages
BUILD.md               — build instructions for the user
.gitignore             — excludes node_modules/, dist/
```

### package.json key points
- `main`: `electron/main.js`
- Scripts: `npm start` (dev, runs raw Electron — no icon baked into binary,
  that's expected and fine for dev) / `npm run dist` (builds NSIS installer
  to `dist/QRS Glossary Setup 1.0.0.exe`)
- `build.files` MUST explicitly list every asset to bundle — this bit us
  once already: `quantum-logo.svg` was missing from this array and the logo
  silently failed to appear in the **installed** app (worked fine in dev
  because dev reads straight from disk) until it was added
- `build.win.icon` points to the ICO
- `build.nsis.installerSidebar` / `installerHeader` point to the BMPs
  (already wired in and BMPs already added per commit history)
- `overrides` block forces newer versions of several deprecated transitive
  dependencies (`glob`, `rimraf`, `tar`, `are-we-there-yet`, `gauge`,
  `npmlog`) pulled in by electron-builder. These warnings are harmless
  (devDependency-only, never bundled into the app) but were cleaned up
  anyway. **Do not run `npm audit fix --force`** — it can break
  electron-builder internals.

### electron/main.js key points
- `app.setAppUserModelId(...)` called early — required on Windows for the
  taskbar/window icon to display correctly even in dev mode (`npm start`)
- `Menu.setApplicationMenu(null)` — removes the native File/Edit/View/
  Window/Help menu bar entirely
- Icon loaded via `nativeImage.createFromPath(...)`, not just a string path
- Window opens maximized (`show: false` initially, then `.maximize()` +
  `.show()` on `ready-to-show` to avoid a white flash)
- External links open in the system browser via `setWindowOpenHandler`
  (not inside the Electron window)

### Known issues already fixed (don't reintroduce)
1. Icon was once a PNG renamed to `.ico` → rcedit rejected it with
   "Reserved header is not 0 or image type is not icon" → fixed by
   generating a real multi-size ICO
2. ICO frames must include a genuine 256×256 — Pillow's default ICO output
   wasn't reliable for this, ended up needing a properly authored ICO (user
   sourced one manually in the end)
3. `str_replace`-style edits to `main.js` once left **duplicated code**
   causing a `SyntaxError: Unexpected token '}'` — always re-view a file
   immediately before/after editing it, and run `node --check file.js`
   after any edit to `main.js` before considering it done
4. Zoom didn't work at all in the first implementation (`fontSize` on a
   container) — fixed via `document.documentElement.style.zoom`

---

## 5. Things NOT yet done / open items

- `feature/electron-app` has not been merged into `develop` — they have
  diverged (electron branch has the female sections + brand styling +
  zoom + everything else; need to check whether `develop` should be
  fast-forwarded or merged)
- No macOS/Linux packaging — Windows NSIS only, by explicit choice
- The print TOC page-number boxes are empty by design (manual fill-in via
  Acrobat Pro) — this was a deliberate simplification after determining
  that automatic page-number calculation in-browser is fundamentally
  unreliable (no `target-counter()` support in any browser)
- No automated tests exist — this is a static HTML/CSS/JS app with no
  build tooling beyond Electron packaging

---

## 6. The 4 female sections added (for reference)

Inserted directly after **Male Hormone**, before **Human Immunity**, in both
the sidebar nav and the main content flow:

| Section | Icon | Params | Source quality |
|---|---|---|---|
| Gynecology | 🌸 | 5 | Heavy machine-translation, fully rewritten |
| Breast | 🎀 | 5 | Decent source, rewritten for plain English |
| Menstrual Cycle | 🔄 | 4 | **No source text** — written from scratch (Beta Hormone, Reflect Protein, Fibrinogen, Sedimentation Rate) |
| Female Hormone | 🌺 | 6 | Good source, lightly polished |

These parallel the existing male-specific sections (Prostate, Male Sexual
Function, Sperm and Semen, Male Hormone) which were already present in the
original source document.

---

## 7. Working conventions established in this project

- Always `git pull` at the start of a session before editing (multiple
  session resets happened where local clone was lost — always re-clone or
  pull fresh)
- Commits are made in logical, descriptive chunks with detailed commit
  messages explaining *why*, not just *what*
- Feature branches used to isolate experimental work (`feature/electron-app`)
  from the stable web-app branch (`develop`)
- No em dashes or decorative punctuation in user-facing document content —
  clean, standard punctuation only
- When extracting content from the source `.htm`/`.pdf` files, note: the
  `.htm` file is a Word-exported HTML file with heavy inline styling; BeautifulSoup
  works fine on it directly (unlike the separate `Vital_Health_2nd_Edition_ORC.pdf`
  reference book mentioned in earlier project work, which required `strings`
  extraction rather than PDF libraries — that PDF is not part of this specific
  glossary app's source material, just background context)
