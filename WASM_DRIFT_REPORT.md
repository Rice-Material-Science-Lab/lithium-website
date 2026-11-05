# WASM drift report: lithium-website vs lithium-kmc `main` (after PR #78)

**Date:** 2026-11-05 (session ran 01:17–02:00 UTC)
**Rules followed:** local work only. Nothing was pushed, no PR or branch was uploaded, nothing was deployed, and no one on the team was contacted. No token was used, rotated or exposed. Proof is in [§8](#8-teleport-ready-summary).

---

## 1. Verdict

| Question | Answer |
|---|---|
| Does upstream `lithium-website/main` serve the canonical build of lithium-kmc `main` (`dfe1964`, PR #78)? | **Yes.** Bot commit `5cfbaf1` (2026-11-01 16:43:58Z, 43 s after the merge) is byte-identical to a local rebuild. |
| Did the CI auto-update go missing? | **No.** My first report said it did. **That was wrong.** This session's checkout was one commit behind upstream and had no `origin` remote, so I never compared against upstream. |
| Is there real drift? | **Yes, two kinds:** (a) upstream `WASM_VERSION` is still `"2026-09-29"` although the bytes changed, so a long-lived cache keeps serving the old simulator (demonstrated locally, §5); (b) the CI workflow's `EXPORTED_FUNCTIONS` was missing the two PR #78 exports and had diverged from the header comment in `lkmc-wasm.cpp`. |

### Hashes (Emscripten 3.1.74, exact CI `em++` command)

| Build | `lkmc-wasm.js` sha256 | `lkmc-wasm.wasm` sha256 |
|---|---|---|
| lithium-kmc `0d3928e` (pre-#78); website before `5cfbaf1` | `f2252d94ce10ce2912dc02e76ea694b86b96dca7e502dac32091f1049b28bb6d` | `525998564ed2c140627e37ea478511d83f4d38a4b48bfaae84eb6754df50a85f` |
| lithium-kmc `dfe1964` (main, #78): rebuild 1, rebuild 2, upstream `5cfbaf1`, and this checkout | `d55f885a913cf523902270ac47fed57b0a19f0e47b4a7a09ddb2414b24e757f0` | `32463c9a0d260b2edbdb66b9e9c1f9fbf5fefee6a5419d2ccef38684d3207dbf` |
| `dfe1964` built with the aligned export list (§3) | identical | identical |

Builds are deterministic: two independent rebuilds were byte-identical, so any hash difference is real drift. `cache key = sha256(js ‖ wasm)[:16] = 4ab141909ecd846f`.

---

## 2. CI diagnosis (auto-update workflow, `lithium-kmc/.github/workflows/push-to-other-repo.yml`)

### Evidence: the pipeline has published every `main` push since July

| lithium-kmc `main` push (UTC) | website bot commit |
|---|---|
| `8ddeccf` 09-06 18:04 | `0f164c5` 18:05 |
| #73 `4f2be84` 09-29 22:42 | `bc20df9` 22:42 |
| #74 `1064fd2` 23:10 | `604f1d3` 23:11 |
| #75 `ed48ab0` 23:27 | `ffa4412` 23:28 |
| #76 `989a5c0` 23:43 | `07e5558` 23:44 |
| **#78 `dfe1964` 11-01 16:43:15** | **`5cfbaf1` 16:43:58** |

The token (`UPDATE_WASM_PAT`) was valid on 2026-11-01 at 16:43Z.

### Causes ranked: what actually happened, then latent risks

| # | Cause | Status | Evidence |
|---|---|---|---|
| 1 | **Stale local checkout** (session clone at `1bbfc7d`, 2026-10-19, with no `origin` remote) | **Actual cause of the reported drift** | `ls-remote` shows upstream main = `5cfbaf1`; fast-forwarding removed the WASM diff entirely |
| 2 | **Cache key not bumped by the bot** | **Real, live upstream** | Bot commits change only `public/lkmc-wasm.{js,wasm}`; `WASM_VERSION` is a hand-edited date. Stale cache reproduced locally (§5) |
| 3 | Token expiry or revocation | Not the cause now; **highest future risk** | PATs expire, and the expiry date isn't visible from YAML. On expiry, `git clone` fails and the site silently stops updating |
| 4 | Out-of-order publish | Latent bug in the original YAML | No `concurrency:` group. A slower run of an older commit can push an **older** build over a newer one |
| 5 | Branch protection or rulesets on website `main` | Not the cause | The bot push succeeded on 11-01, and humans pushed directly to main on 10-15/16 (`02224aa`, `c380123`, `b77ad1f`). Adding PR-only or signed-commit rules later would block the bot |
| 6 | Failed run (emsdk or compile error) | Not the cause | The bot commit exists. Locally the build is reproducible at 3.1.74 |
| 7 | Trigger misconfiguration | Not the cause | `push: branches: ['**']` includes `main`, PR merges fire `push`, and publishing is gated on `refs/heads/main` |

### YAML audit of the original workflow
- **Trigger:** correct, as above.
- **Bot commit logic:** `git add`, then `git diff-index --quiet HEAD ||` commit. It's correct and handles the no-op case.
- **PAT:** embedded in the clone URL. GitHub masks it in logs and it isn't echoed. However:
  - there's no empty-secret check, so a missing secret gives a confusing clone error;
  - there's no `set -e` and no clear error messages.
- **Permissions:** none declared, so `GITHUB_TOKEN` gets the repo default even though it isn't needed.
- **Missing pieces:**
  - no concurrency group;
  - no check after pushing that the website serves the new build;
  - no record of which source commit the site serves;
  - the export list had drifted from the header comment.

---

## 3. CI fix (lithium-kmc, **local commits in a scratchpad clone, not pushed**)

These were made in Phase 1, as asked, *before* the later instruction that a separate session owns lithium-kmc. **Coordinate with that session before landing them, because they may overlap with its work.** After that instruction I made no more commits there.

Clone: `/tmp/claude-0/-home-user-repo/ed54967f-f0b6-5c68-a258-5d704d019f16/scratchpad/kmc`, branch `local/wasm-drift-check`:

| Commit | Change |
|---|---|
| `896fc8a` | `scripts/build-wasm.sh` is now the single source of the `em++` command, and the workflow calls it. `EXPORTED_FUNCTIONS` gains `_get_intercalation_json` and `_get_intercalation_json_len`, and the `lkmc-wasm.cpp` header is synced. **Output is byte-identical** to the canonical build. Also adds `scripts/check_wasm_build_config.py`, which fails CI if the header and script disagree or if exports ≠ the `EMSCRIPTEN_KEEPALIVE` set plus malloc/free. Its 7 unit tests include a replay of the PR #78 drift, and they caught a gap in the checker's first version. The publish job gains a build-twice-and-`cmp` step, a build artifact upload, `public/lkmc-wasm.build.json` provenance, explicit errors for a missing or expired token and for rejected pushes, and a hash check after pushing. New `wasm-drift-check.yml`: daily and on-demand rebuild of `main`, compared against what the website serves. |
| `c13e557` | Skip publishing when the run's commit is no longer the tip of `main`, so a slow run can't regress the site. |

**Validation:**
- `actionlint` and `shellcheck` are clean, and all 7 unit tests pass.
- The drift check passes against upstream `5cfbaf1` and **fails** (exit 1, exact hashes) against the stale `1bbfc7d`. So it would have caught this situation.
- I dry-ran the publish step from the YAML against a local bare repo. HTTPS was blocked (`GIT_ALLOW_PROTOCOL=file`) and the token was a dummy. Scenarios:
  - stale site: publishes, and verification passes;
  - rerun: no-op;
  - empty secret: clear error;
  - clone fails (expired token): clear error;
  - branch-protection rejection: clear error;
  - older commit finishing late: skipped, destination untouched.
- The dry-run bot commit's blobs equal the real `5cfbaf1` blobs.

**Not committed:** `scratchpad/lithium-kmc-intercalation-perf.patch`. It refactors the Stage 5 column scans into one O(Nx·Ny) pass. The result is **byte-identical** JSON and save blobs over 420 frames (27 with plating) and the fixed-capacity override path. Speed at 400×200:
- `get_intercalation_json`: **1,588 ms → 0.9 ms**;
- `save_state`: **494 ms → 0.22 ms**.

It's left as a patch for the lithium-kmc owner.

---

## 4. Website changes (this repo, **local commits only**, branch `local/intercalation-and-cache-bust` on top of upstream `5cfbaf1`)

| Commit | Change |
|---|---|
| `8cb65fe` | **Cache-bust from content hash.** `next.config.ts` hashes `public/lkmc-wasm.{js,wasm}` at build time into `process.env.LKMC_WASM_VERSION`, which `sim.tsx` uses as `WASM_VERSION`. It replaces the hand-edited date, which the bot can never bump. This supersedes the earlier uncommitted `"2026-11-01"` bump: same purpose, but automatic. A missing WASM file fails the build. |
| `a062625` | **Intercalation tab** (`components/pages/sim-page/intercalation-panel.tsx` plus wiring in `sim.tsx`). Shows totals (intercalated, plating, gap columns, saturated) and a per-column table (capacity, Li atoms, intercalated, plating, fill bar), in the existing card and table style, in both themes. Details: [§6](#6-findings-for-the-team-not-fixed) explains the throttling; the memory-safe read and its validation are covered in the commit message. |
| `f2d9cff` | ESLint ignores the generated `public/lkmc-wasm.js`. All 66 prior warnings, including the 2 for the new exports, were in that generated file. Site code had none, and lint is now clean. |

The WASM files equal upstream `5cfbaf1`, so this branch carries no binary changes. Each commit typechecks, lints and builds **on its own**, so they can be cherry-picked independently.

---

## 5. Verification

### Phase A: backward compatibility (Node, old `0d3928e` vs new `dfe1964` builds side by side)
- **Same-seed parity:** across 135 configurations (3 grid sizes × 5 carbon layouts × 3 parameter sets × 3 seeds), checked at 4 checkpoints, 25k steps apart (100k steps per run). Lattice, step, time, fill, terminated flag and stats JSON are all **identical**. Batch sweeps are identical in every simulated field; `wall_time` is measured elapsed time and is excluded.
- **Old saves under v2 (WASM `save_state`):** 8 cases.
  - Old v1 blobs work in the new build: they peek and load exactly, and continuing after the load matches the old build.
  - v2 blobs round-trip, with magic `LKMC`, version 2, and the expected length.
  - Truncated, header-only or wrong-version blobs are rejected **without touching** the lattice.
- **Old saves (the site's Snapshot gallery, `localStorage` `lkmc-snapshots-v1`):** a snapshot built from the old build's lattice renders in the new site. PR #78 added no lattice codes.
- **New function returns valid JSON:**
  - 354 frames across random grids and layouts, including 24 with plating and 33 with saturated columns. Every frame is valid JSON and **equals an independent JS re-implementation** of the Stage 5 rules.
  - With no simulation, it returns `{}`, and the UI shows "No data yet".
- **Totals:** 4,050 + 2,053 assertions, all passing.
- **Lint, typecheck and build:** pass. Lint shows 0 warnings since `f2d9cff`; before that, the 66 warnings were **all** in generated `public/lkmc-wasm.js`, confirmed per file with `eslint -f json`.

### Phase B: local servers only, never production
- **Dev server (`npm run dev`):**
  - `/sim` loads js `d55f885a…` and wasm `32463c9a…`;
  - the `.wasm` is served as `application/wasm`;
  - Run advanced to 170k and then 390k steps;
  - there were 0 console errors.
- **Production-mode local build, Playwright:** these scenarios passed with 0 console errors:
  - drawn carbon columns: 10 gap columns, capacity equal to carbon height;
  - plating (220 plating atoms, 10 saturated columns), in dark and light themes;
  - the graphite lattice: the "no gap columns" explanation shows;
  - a cached **pre-#78** build: the tab explains the missing data and the sim still runs;
  - large grids: at 400×200 the slow-update note appears, and throughput matches a control run with the tab closed.
- **Version bump defeats the old cache:** a local proxy marked `/lkmc-wasm.*` `immutable, max-age=1y`, and one persistent browser profile visited three local builds:

| Visit | Key | Bytes the page ran | Origin fetches |
|---|---|---|---|
| 1 Old site `1bbfc7d` | `?v=2026-09-29` | OLD | 2 |
| 2 **Upstream as-is `5cfbaf1`** | `?v=2026-09-29` | **OLD (stale)** | **0** |
| 2b Same, fresh browser | `?v=2026-09-29` | NEW | 2 |
| 3 **Fixed `f2d9cff`** | `?v=4ab141909ecd846f` | **NEW** | 2 |

**Caveat:** Next serves `public/` with `max-age=0` by default, so whether *production* actually serves stale files depends on the host's or CDN's headers. I deliberately didn't probe production; a human needs to check it ([§7](#7-human-only-steps)).

---

## 6. Findings for the team (not fixed)

1. **The site's graphite lattice never produces intercalation data.** Stage 5 treats any `x` holding carbon at any height as a carbon column. The leaning 60°/30° graphite lines (height ≥ 4, and the default is 15) cross every column, so there are **0 gap columns**. Only vertical hand-drawn carbon, or graphite of height 1–2, produces stats. The UI explains this, but it's a modeling question for the group.
2. **Pre-#78 builds silently mis-load v2 saves.** They read `nx = 1129139020` (the bytes "LKMC"), and `load_state` returns success with a corrupted lattice. That can't be fixed retroactively. There's no site impact today, because the site never persists `save_state` blobs.
3. **Intercalation cost.** It's O(gaps × lattice) in `dfe1964`: about 5 ms at 60×25 and about 1.5 s at 400×200. The UI mitigates it by reading only while the tab is open, throttled; the real fix is the perf patch in §3.
4. **Large grids are already slow to render.** The first SVG render takes 6–20 s at 300×150 to 400×200, with or without the new tab.
5. **`next dev` rewrites a managed block in `AGENTS.md`.** This is Next 16.4 `generate-agent-files.js`. I discarded that churn so it wouldn't mix with these commits, and saved it as `scratchpad/next-dev-agents-md-rewrite.patch`. Decide whether to commit it.

---

## 7. Human-only steps

1. **Push and deploy decision (website).** Review `local/intercalation-and-cache-bust` (3 commits). If accepted, push and open a PR yourself. The content-hash commit `8cb65fe` is the one that fixes live drift; the other two are independent.
2. **Check the production cache headers** (read-only, from your browser devtools): look at `Cache-Control` on `/lkmc-wasm.wasm?v=2026-09-29`. If it's long-lived or immutable at the CDN, users may be running the pre-#78 simulator until `8cb65fe` ships.
3. **Token health** (only someone with admin access to lithium-kmc can do this):
   - In lithium-kmc: Settings → Secrets and variables → Actions → confirm that `UPDATE_WASM_PAT` exists.
   - The token owner, in their GitHub settings: Developer settings → Personal access tokens. Find the token and note its **expiry date**, its repository access (`lithium-website` only), and its permission (**Contents: Read and write**).
   - **To renew:** regenerate the token, or create a new fine-grained token scoped to `lithium-website` with Contents: Read and write. Paste it into the `UPDATE_WASM_PAT` secret, then run the workflow manually (Actions → "Compile WASM and Push to Website" → Run workflow on `main`). Expected result: a no-op ("Website already serves this build").
   - Consider a deploy key or GitHub App with write access to `lithium-website` only, so it doesn't depend on one person's PAT or expiry.
   - If the token's owner leaves the org, publishing breaks immediately.
4. **Branch rules:** if PR-only or signed-commit rules are ever added to website `main`, allow the bot's identity to bypass them, or switch publishing to open a PR.
5. **lithium-kmc changes:** hand `local/wasm-drift-check` (2 commits) and the perf patch to the session or person who owns lithium-kmc. If the daily drift check is adopted, it needs re-enabling after 60 days of repo inactivity.

### Landing checklist (after each future lithium-kmc merge)
- [ ] The Actions run for the merge is green, including "Reproducibility check" and "Verify website now serves this build".
- [ ] A website bot commit appeared within a few minutes, and `public/lkmc-wasm.build.json` names the merge commit.
- [ ] Any new `EMSCRIPTEN_KEEPALIVE` function is in `scripts/build-wasm.sh` and in the header (CI enforces this).
- [ ] The website deploys from that bot commit. The cache key changes automatically (content hash); no manual bump.
- [ ] If exports or JSON shapes changed, update `CustomWasmModule` in `sim.tsx` and any reader validation.
- [ ] Smoke-test `/sim`: the `.wasm` is served as `application/wasm`, Run advances, and there are no console errors.

### Drift prevention, in summary
The CI hash check and the daily drift check catch drift in the bytes. The config checker catches drift in the export list. The content-hash key catches drift in the cache. `lkmc-wasm.build.json` makes "what's being served?" a one-file lookup.

---

## 8. Teleport-ready summary

**Local files changed:**
- **This repo (`/home/user/repo`):** branch `local/intercalation-and-cache-bust` holds 3 commits on top of upstream `5cfbaf1`:
  - `next.config.ts`
  - `components/pages/sim-page/sim.tsx`
  - `components/pages/sim-page/intercalation-panel.tsx` (new)
  - `AGENTS.md`
  - `eslint.config.mjs`

  This report is untracked. The `public/lkmc-wasm.*` files are unchanged versus upstream; they're already canonical.
- **lithium-kmc scratchpad clone:**
  - branch `local/wasm-drift-check` holds 2 commits;
  - uncommitted perf refactor in the working tree, also exported as `scratchpad/lithium-kmc-intercalation-perf.patch`.
- **Test harnesses:** under `scratchpad/smoke/` and `scratchpad/cache/`. Screenshots: `scratchpad/ui-intercalation-*.png`.

**Proof that nothing was pushed or deployed** (checked 01:55Z):
- Both repos have their push URL set to `no-push://disabled-by-session-rule`.
- `git ls-remote` shows remote `main` unchanged: website `5cfbaf1`, lithium-kmc `dfe1964`. Neither remote has any `local/*` branch.
- No reflog in either repo contains a push entry.
- Every server used was on `localhost` (`3123`, `3124`, `3200`), and all are stopped. No deploy command was run.
- The publish-step dry run used `GIT_ALLOW_PROTOCOL=file` (HTTPS blocked) and a dummy token.

**What only a human can land:** pushing or opening PRs (in either repo), deploying, checking and renewing the token, branch rules, the production cache-header check, and the modeling decision on graphite gap columns ([§6](#6-findings-for-the-team-not-fixed) item 1).

**Still unproven:**
- The real production cache behavior.
- The token's expiry date.
- The new workflows running on real GitHub Actions. They're linted and dry-run locally, never executed there.
- Whether the lithium-kmc session's work conflicts with `local/wasm-drift-check`.
