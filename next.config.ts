import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import path from "node:path"
import type { NextConfig } from "next"

// Cache-bust key for the simulator build in public/: a content hash of
// lkmc-wasm.js + lkmc-wasm.wasm, computed at build time. The lithium-kmc CI
// bot replaces those two files directly, so a hand-maintained version string
// goes stale on every bot update; a content hash changes exactly when the
// bytes do. A missing file fails the build rather than shipping a site with
// no simulator.
function lkmcWasmVersion(): string {
  const hash = createHash("sha256")
  for (const file of ["lkmc-wasm.js", "lkmc-wasm.wasm"]) {
    hash.update(readFileSync(path.join(process.cwd(), "public", file)))
  }
  return hash.digest("hex").slice(0, 16)
}

const nextConfig: NextConfig = {
  env: {
    LKMC_WASM_VERSION: lkmcWasmVersion(),
  },
}

export default nextConfig
