import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import type { NextConfig } from "next"

const WASM_FILES = ["lkmc-wasm.js", "lkmc-wasm.wasm"] as const
const publicPath = (file: string) => path.join(process.cwd(), "public", file)
const sha256 = (data: Buffer) => createHash("sha256").update(data).digest("hex")

// Cache-bust key for the simulator build in public/: a content hash of
// lkmc-wasm.js + lkmc-wasm.wasm, computed at build time. The lithium-kmc CI
// bot replaces those two files directly, so a hand-maintained version string
// goes stale on every bot update; a content hash changes exactly when the
// bytes do. A missing file fails the build rather than shipping a site with
// no simulator.
function lkmcWasmVersion(): string {
  const hash = createHash("sha256")
  for (const file of WASM_FILES) hash.update(readFileSync(publicPath(file)))
  return hash.digest("hex").slice(0, 16)
}

// Which lithium-kmc commit built the served files, from the provenance
// record lithium-kmc CI writes next to them (public/lkmc-wasm.build.json).
// Trusted only if its sha256 values match the files actually in public/;
// otherwise the record is stale, which is itself drift worth surfacing.
function lkmcWasmProvenance(): { status: string; commit: string } {
  const file = publicPath("lkmc-wasm.build.json")
  if (!existsSync(file)) return { status: "missing", commit: "" }
  try {
    const record = JSON.parse(readFileSync(file, "utf8"))
    const commit = String(record?.source_commit ?? "")
    const matches = WASM_FILES.every(
      (f) => record?.sha256?.[f] === sha256(readFileSync(publicPath(f)))
    )
    if (!/^[0-9a-f]{40}$/.test(commit)) return { status: "invalid", commit: "" }
    return { status: matches ? "verified" : "mismatch", commit }
  } catch {
    return { status: "invalid", commit: "" }
  }
}

const provenance = lkmcWasmProvenance()

const nextConfig: NextConfig = {
  env: {
    LKMC_WASM_VERSION: lkmcWasmVersion(),
    LKMC_WASM_PROVENANCE: provenance.status,
    LKMC_WASM_SOURCE_COMMIT: provenance.commit,
  },
}

export default nextConfig
