<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## lithium-website — Agent Quick Reference

**Educational site** for lithium metal battery dendrites with an in-browser LKMC simulator. Built by students collaborating with Prof. Ming Tang's Mesoscale Materials Science Group at Rice University.

---

## Commands

| Command | Purpose |
| --------- | --------- |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run format` | Prettier on `**/*.{ts,tsx}` |
| `npm run typecheck` | `tsc --noEmit` |

**Recommended order:** `lint → typecheck → build`

---

## Architecture

```text
app/                    # App Router pages
  page.tsx              # Homepage (client component)
  sim/page.tsx          # LKMC simulator page
  about/page.tsx        # About page
  library/page.tsx      # References/library page
  api/chat/route.ts     # AI chat (Gemini + Vercel AI SDK)
  api/news/route.ts     # News feed endpoint
  layout.tsx            # Root layout + providers
  globals.css           # Tailwind v4 + Rice brand tokens
components/
  ui/                   # shadcn/ui components (Radix-based)
  pages/
    homepage/           # Homepage sections
    sim-page/           # Simulator (1500+ lines, client)
      sim.tsx           # Main simulator component
      hex-grid.tsx      # Hexagon lattice renderer (SVG)
      cards/params-card.tsx  # Parameter controls
  theme-provider.tsx    # next-themes + hotkey (D)
lib/
  utils.ts              # cn() = clsx + tailwind-merge
  types.ts              # CellInfo type for simulator
public/
  lkmc-wasm.js          # Emscripten glue code
  lkmc-wasm.wasm        # Compiled C++ simulation
  lkmc-wasm.js.map      # Source map (dev)
```

---

## Key Technical Details

### WebAssembly Simulator

- **Source:** `lithium-kmc` repo (C++), compiled to WASM via Emscripten
- **Loaded in:** `components/pages/sim-page/sim.tsx` via dynamic import
- **Dev cache-bust:** `?v=${Date.now()}` on both `.js` and `.wasm`
- **Prod cache-bust:** `WASM_VERSION = "2026-09-29"` — bump when rebuilding WASM
- **Interface:** `CustomWasmModule` type in `sim.tsx` lines 27–97
- **Callbacks registered on `window`:** `updateSimulation`, `onSimulationTerminated`, `onBatchRunProgress`

### Simulator State Machine

```text
Stopped → (Run) → Running ↔ (Pause/Resume) ↔ Paused
                ↓
           (Stop) → WasStopped
                ↓
           (Jam)  → Terminated (alert shown)
```

- **Live Mode:** parameters/carbon edits apply mid-run without restart
- **History Mode:** scrub saved snapshots via `loadSnapshot(idx)`
- **Batch Mode:** sweeps temp/dropRate, runs headless in WASM, returns JSON

### Theme System

- **Provider:** `components/theme-provider.tsx` — `next-themes`, default `dark`, `enableSystem`
- **Hotkey:** `D` (when not in input/textarea)
- **Colors:** Rice brand palette in `app/globals.css` (CSS variables for both themes)
- **Tailwind v4:** `@theme inline` maps CSS vars → Tailwind utilities

### AI Chat (`/api/chat`)

- **Model:** Google Gemini 2.5 Flash via `@ai-sdk/google`
- **Tools:** fetches source code from GitHub (markdown renderer, WASM C++, sim.tsx, params-card)
- **System prompt:** constrains to battery dendrite/simulator topics

### Path Aliases (`tsconfig.json`)

```json
"@/*": ["./*"]
```

Import as `@/components/ui/button`, `@/lib/utils`, etc.

---

## Conventions & Gotchas

1. **Client components:** All interactive pages use `"use client"` at top. The app pages (`app/*/page.tsx`) are thin wrappers importing client views from `components/pages/`.

2. **WASM loading:** Only runs in browser. The dynamic import uses `/* @vite-ignore */ /* webpackIgnore: true */` comments to prevent bundler processing.

3. **Simulator params persisted:** `localStorage` key `lkmc-sim-params-v4` — version bump clears old params.

4. **Grid dimensions:** Controlled by `width`/`height` inputs → `gridDimensions` state. Changing them before first run resizes the preview lattice live.

5. **Carbon/anode drawing:** Two modes — hand-drawn sites (`carbonSites`) + generated graphite lattice (`graphiteSites`). Both stored in state, refitted on grid resize via `fitCarbonToGrid()`.

6. **No test suite** — verify manually via `npm run dev` and `npm run build`.

7. **ESLint config:** Extends `eslint-config-next/core-web-vitals` + `typescript`. Ignores `.next/`, `out/`, `build/`, `next-env.d.ts`.

8. **TypeScript strict mode** — `strict: true`, `noEmit: true`.

---

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component>
```

Places components in `components/ui/`. Configured in `components.json`:

- Style: `radix-maia`
- Base color: `mist`
- CSS variables: `true`
- Icon library: `lucide`

---

## Deployment Notes

- Static export not used — requires Node.js server for API routes
- WASM files served from `public/` — ensure hosting preserves `.wasm` MIME type
- No environment variables required (Gemini API key not in repo)

---

## Useful Files to Read First

- `components/pages/sim-page/sim.tsx` — simulator logic (start here for sim changes)
- `app/globals.css` — all design tokens, brand colors
- `components/theme-provider.tsx` — theme + hotkey
- `app/api/chat/route.ts` — AI tools & system prompt
- `components/pages/sim-page/cards/params-card.tsx` — parameter UI
