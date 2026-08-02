import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Dispatch, SetStateAction } from "react"

export default function HelpDialog({
  helpOpen,
  setHelpOpen,
}: {
  helpOpen: boolean
  setHelpOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle size={18} className="text-primary dark:text-cyan-500" />
            How the simulator works
          </DialogTitle>
          <DialogDescription>
            A quick reference for the lattice, parameters, and controls.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="flex flex-col gap-6 text-sm">
            <section>
              <h4 className="mb-2 font-semibold">Overview</h4>
              <p className="text-muted-foreground">
                This simulates lithium electrodeposition on a 2D hexagonal
                lattice using Kinetic Monte Carlo (KMC): atoms drop onto the
                lattice, hop between sites, bond to neighbors, and can be
                passivated by a growing SEI (solid-electrolyte interphase)
                layer. Every parameter below feeds into the rate equations that
                decide which event happens next and how quickly.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Lattice cell states</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#E5E7EB] dark:bg-[#18181B]" />
                  <span>
                    <span className="font-medium">Empty</span> &mdash;
                    unoccupied site.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#2563EB] dark:bg-[#38BDF8]" />
                  <span>
                    <span className="font-medium">Free</span> &mdash; mobile
                    atom, not yet bonded to a neighbor.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#F97316] dark:bg-[#FB923C]" />
                  <span>
                    <span className="font-medium">Deposited</span> &mdash;
                    bonded to at least one neighbor.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#6B7280] dark:bg-[#52525B]" />
                  <span>
                    <span className="font-medium">Substrate</span> &mdash; the
                    fixed bottom row atoms grow from.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#16A34A] dark:bg-[#4ADE80]" />
                  <span>
                    <span className="font-medium">Passivated</span> &mdash; a
                    deposited atom coated by SEI; can revert via de-passivation.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#DC2626] dark:bg-[#F87171]" />
                  <span>
                    <span className="font-medium">Carbon</span> &mdash; a
                    user-drawn graphite anode site.
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Core parameters</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Width / Height
                  </span>{" "}
                  &mdash; lattice dimensions in cells.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Temperature (K)
                  </span>{" "}
                  &mdash; sets the Boltzmann factor in every rate; higher T
                  makes energy differences matter less.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Drop Rate (d&#8320;)
                  </span>{" "}
                  &mdash; how often new atoms spawn at the top row.
                </li>
                <li>
                  <span className="font-medium text-foreground">Steps</span>{" "}
                  &mdash; total KMC steps to run when you press Run.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Update Frequency
                  </span>{" "}
                  &mdash; how many steps run between each visual/chart refresh;
                  lower values show short-lived states (like Free) more often,
                  at a performance cost.
                </li>
                <li>
                  <span className="font-medium text-foreground">Seed</span>{" "}
                  &mdash; fixes the RNG for a reproducible run; leave blank for
                  a random seed each time.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Advanced parameters</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Bonded Energy e&#8320;
                  </span>{" "}
                  &mdash; atom-atom bond strength; more negative = stronger
                  bonds = slower diffusion.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Atom-substrate e&#8321;
                  </span>{" "}
                  &mdash; bond strength to the substrate; more negative than
                  e&#8320; promotes vertical growth.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Free / Dep. Attempt Freq. (v_f, v_d)
                  </span>{" "}
                  &mdash; how often free vs. bonded atoms attempt to hop.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Passivation Attempt Freq. (v_p)
                  </span>{" "}
                  &mdash; governs how readily exposed deposited atoms get coated
                  by SEI.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    De-passivation Attempt Freq. / Barrier (v_dp, E_dp)
                  </span>{" "}
                  &mdash; governs SEI breakdown, reverting Passivated back to
                  Deposited.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">
                Drawing carbon (graphite anode)
              </h4>
              <p className="text-muted-foreground">
                Toggle{" "}
                <span className="font-medium text-foreground">Draw Carbon</span>
                , pick a species swatch, then click lattice cells to mark them
                as anode sites before pressing Run. Each species has its own
                independently tunable bond energy slider. Use{" "}
                <span className="font-medium text-foreground">Undo</span> or{" "}
                <span className="font-medium text-foreground">
                  Clear Carbon
                </span>{" "}
                to fix mistakes.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Live Mode</h4>
              <p className="text-muted-foreground">
                When enabled, changing any slider (including carbon energies,
                Steps, and Update Frequency) applies instantly to a running
                simulation instead of requiring a restart. Carbon sites you add
                or remove while Live Mode is on are also pushed to the running
                sim immediately.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Presets</h4>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Dense growth
                </span>
                ,{" "}
                <span className="font-medium text-foreground">
                  Sparse / dendritic
                </span>
                , and{" "}
                <span className="font-medium text-foreground">SEI-heavy</span>{" "}
                are ready-made parameter sets that produce visually distinct
                growth regimes &mdash; a fast way to explore the model without
                hand-tuning every slider.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Batch Run</h4>
              <p className="text-muted-foreground">
                Sweeps Temperature or Drop Rate across a Min&ndash;Max range
                over several independent runs (each with its own random seed),
                holding everything else fixed. Useful for seeing how fill % or
                passivation trends with one parameter. Results are exportable as
                CSV, and the panel can be collapsed with the &times; button when
                you don&apos;t need it.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Grid controls</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>Click-drag the lattice to pan; to adjust scale.</li>
                <li>
                  Click any cell (outside of Draw Carbon mode) to inspect its
                  state and coordination number.
                </li>
                <li>
                  The slider beneath the grid scrubs through saved lattice
                  snapshots &mdash; use &ldquo;Back to Live&rdquo; to return to
                  the current step.
                </li>
                <li>
                  Press{" "}
                  <kbd className="rounded border border-border bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    Space
                  </kbd>{" "}
                  to pause/resume a running simulation.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Exporting data</h4>
              <p className="text-muted-foreground">
                Use{" "}
                <span className="font-medium text-foreground">
                  Export Stats CSV
                </span>{" "}
                for the step-by-step counts chart, and{" "}
                <span className="font-medium text-foreground">
                  Export Lattice CSV
                </span>{" "}
                for a snapshot of the current grid state as a grid of cell
                codes.
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
