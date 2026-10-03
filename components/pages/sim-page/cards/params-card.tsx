import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { BorderBeam } from "@/components/ui/border-beam"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip"
import { CircleQuestionMarkIcon, ChevronDownIcon } from "lucide-react"

export default function ParamsCard({
  handleSubmit,
  isLiveMode,
  setIsLiveMode,
  width,
  setWidth,
  height,
  setHeight,
  drawingCarbon,
  setDrawingCarbon,
  carbonEnergy,
  setCarbonEnergy,
  carbonSites,
  carbonUndoStack,
  undoCarbonSite,
  clearCarbon,
  graphiteHeight,
  setGraphiteHeight,
  graphiteAngle,
  setGraphiteAngle,
  continueSteps,
  setContinueSteps,
  continueSim,
  canContinue,
  addGraphiteLattice,
  temp,
  setTemp,
  dropRate,
  setDropRate,
  stepsToRun,
  setStepsToRun,
  updateInterval,
  setUpdateInterval,
  seed,
  setSeed,
  bondedEnergy,
  setBondedEnergy,
  atomSubstrate,
  setAtomSubstrate,
  freeAttFreq,
  setFreeAttFreq,
  depAttFreq,
  setDepAttFreq,
  passAttFreq,
  setPassAttFreq,
  wasmModule,
  isPaused,
  handleResumeSim,
  handlePauseSim,
  isRunning,
  handleStopSim,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex h-full shrink-0 flex-col justify-between gap-6"
      >
        <Card className="flex h-full flex-col justify-start rounded-2xl border border-border backdrop-blur-xl">
          <CardHeader className="pl-2">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Parameters
            </h3>
          </CardHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-2 py-4">
            <Alert className="flex shrink-0 items-center justify-between overflow-hidden rounded-xl border-border p-3!">
              <div className="space-y-1">
                <AlertTitle className="leading-none">
                  <Label
                    htmlFor="live-mode"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Live Mode
                  </Label>
                </AlertTitle>
                <AlertDescription>
                  <p className="text-xs text-muted-foreground">
                    Update WASM parameters in real time
                  </p>
                </AlertDescription>
              </div>
              <AlertAction className="mt-0 shrink-0">
                <Switch
                  id="live-mode"
                  checked={isLiveMode}
                  onCheckedChange={setIsLiveMode}
                  aria-label="live mode toggle"
                />
              </AlertAction>
              <BorderBeam
                size={100}
                colorFrom={isLiveMode ? "var(--color-primary)" : "transparent"}
                colorTo={isLiveMode ? "var(--color-primary)" : "transparent"}
                borderWidth={2}
              />
              <BorderBeam
                size={100}
                colorFrom={isLiveMode ? "var(--color-primary)" : "transparent"}
                colorTo={isLiveMode ? "var(--color-primary)" : "transparent"}
                borderWidth={2}
                delay={3}
              />
            </Alert>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="width-input"
                className="flex items-center text-sm font-medium"
              >
                Width
                <Tooltip>
                  <TooltipTrigger aria-label={"width help"} className="ml-2" type="button">
                    <CircleQuestionMarkIcon size={17}></CircleQuestionMarkIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    The width of the simulation lattice
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="width-input"
                type="number"
                min={1}
                className="rounded-xl"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <Label
                htmlFor="height-input"
                className="flex items-center text-sm font-medium"
              >
                Height
                <Tooltip>
                  <TooltipTrigger aria-label={"height help"} className="ml-2" type="button">
                    <CircleQuestionMarkIcon size={17}></CircleQuestionMarkIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    The height of the simulation lattice
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="height-input"
                type="number"
                min={1}
                className="rounded-xl"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />

              <Separator className="my-4 bg-linear-to-r from-transparent via-primary/50 to-transparent dark:via-primary/50" />

              <Alert className="flex shrink-0 items-center justify-between overflow-hidden rounded-xl border-border p-3!">
                <div className="space-y-1">
                  <AlertTitle className="leading-none">
                    <Label
                      htmlFor="draw-carbon"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Draw Carbon (Anode)
                    </Label>
                  </AlertTitle>
                  <AlertDescription>
                    <p className="text-xs text-muted-foreground">
                      Click grid cells to place graphite anode sites
                    </p>
                  </AlertDescription>
                </div>
                <AlertAction className="mt-0 shrink-0">
                  <Switch
                  
                  aria-label="draw carbon toggle"
                    id="draw-carbon"
                    checked={drawingCarbon}
                    onCheckedChange={setDrawingCarbon}
                  />
                </AlertAction>
              </Alert>
              <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
                <Label className="flex items-center text-sm font-medium">
                  Graphite Lattice
                  <Tooltip>
                    <TooltipTrigger className="ml-2" type="button">
                      <CircleQuestionMarkIcon size={17} />
                    </TooltipTrigger>
                    <TooltipContent>
                      Adds straight, parallel carbon columns on the substrate,
                      one empty lattice line apart, all the same height
                      (typically 10&ndash;20 atoms). Drawing or clearing the
                      lattice resets the simulation.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="graphite-height-input"
                    className="text-xs text-muted-foreground"
                  >
                    Column height (atoms)
                  </Label>
                  <Input
                    id="graphite-height-input"
                    type="number"
                    min={1}
                    className="rounded-xl"
                    value={graphiteHeight}
                    onChange={(e) => setGraphiteHeight(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    id="graphite-angle-label"
                    className="text-xs text-muted-foreground"
                  >
                    Column angle
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="graphite-angle-label"
                    className="grid grid-cols-2 gap-1 rounded-full border border-border p-1"
                  >
                    {(
                      [
                        ["60", "60\u00b0", "Touching atoms along a lattice line"],
                        ["30", "30\u00b0", "Atoms one lattice step apart"],
                      ] as const
                    ).map(([value, label, hint]) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={graphiteAngle === value}
                        title={hint}
                        onClick={() => setGraphiteAngle(value)}
                        className={
                          "rounded-full px-3 py-1 text-sm font-medium transition-colors " +
                          (graphiteAngle === value
                            ? "bg-brand text-brand-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={addGraphiteLattice}
                >
                  Add Graphite Lattice
                </Button>
              </div>
              {drawingCarbon && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="atom-bond-energy-input"
                      className="flex items-center text-sm font-medium"
                    >
                      <span>Carbon Atom Bond Energy</span>
                      <Tooltip>
                        <TooltipTrigger aria-label={"bond energy help"} className="ml-2" type="button">
                          <CircleQuestionMarkIcon size={17} />
                        </TooltipTrigger>
                        <TooltipContent>
                          The strength of the bonds between carbon atoms and
                          atoms bonded to them
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="font-mono text-sm text-muted-foreground">
                      {carbonEnergy}
                    </span>
                  </div>
                  <Slider
                    id="atom-bond-energy-input"
                    min={-2.0}
                    max={0}
                    step={0.01}
                    value={[carbonEnergy]}
                    onValueChange={(val: number[]) => setCarbonEnergy(val[0])}
                  />
                </div>
              )}
              {carbonSites.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={clearCarbon}
                  >
                    Clear Carbon ({carbonSites.size})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={undoCarbonSite}
                    disabled={carbonUndoStack.length === 0}
                  >
                    Undo
                  </Button>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex flex-col gap-4">
                {/* temp */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="temp-input"
                      className="flex items-center text-sm font-medium"
                    >
                      <span>Temperature (K)</span>
                      <Tooltip>
                        <TooltipTrigger aria-label={"temperature help"} className="ml-2" type="button">
                          <CircleQuestionMarkIcon size={17} />
                        </TooltipTrigger>
                        <TooltipContent>
                          The temperature being simulated
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="font-mono text-sm text-muted-foreground">
                      {temp} K
                    </span>
                  </div>
                  <Slider
                    
                  aria-label="temperature input"
                    id="temp-input"
                    min={100}
                    max={600}
                    step={1}
                    value={[temp]}
                    onValueChange={(val: number[]) => setTemp(val[0])}
                  />
                </div>

                {/* drop rate */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="drop-rate-input"
                      className="flex items-center text-sm font-medium"
                    >
                      <span>
                        Drop Rate (d<sub>0</sub>)
                      </span>
                      <Tooltip>
                        <TooltipTrigger aria-label={"drop rate help"} className="ml-2" type="button">
                          <CircleQuestionMarkIcon size={17} />
                        </TooltipTrigger>
                        <TooltipContent>
                          The rate at which atoms spawn
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="font-mono text-sm text-muted-foreground">
                      {dropRate}
                    </span>
                  </div>
                  <Slider
                    id="drop-rate-input"
                    min={1}
                    max={100000}
                    step={100}
                    value={[dropRate]}
                    onValueChange={(val: number[]) => setDropRate(val[0])}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* play options */}

              <Label
                htmlFor="steps-to-run-input"
                className="flex items-center text-sm font-medium"
              >
                Steps
                <Tooltip>
                  <TooltipTrigger aria-label={"step count help"} className="ml-2" type="button">
                    <CircleQuestionMarkIcon size={17}></CircleQuestionMarkIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    The amount of steps that will be run upon starting the
                    simulation
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="steps-to-run-input"
                type="number"
                min={1}
                className="rounded-xl"
                value={stepsToRun}
                onChange={(e) => setStepsToRun(e.target.value)}
              />

              <Label
                htmlFor="update-interval-input"
                className="mt-2 flex items-center text-sm font-medium"
              >
                Update Frequency (steps)
                <Tooltip>
                  <TooltipTrigger aria-label={"update interval help"} className="ml-2" type="button">
                    <CircleQuestionMarkIcon size={17}></CircleQuestionMarkIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    How many simulated steps run between each visual and chart
                    update. Lower values show short-lived states like free atoms
                    more often, at the cost of performance.
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="update-interval-input"
                type="number"
                min={1}
                className="rounded-xl"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(e.target.value)}
              />

              <Label
                htmlFor="seed-input"
                className="mt-2 flex items-center text-sm font-medium"
              >
                Seed (optional)
                <Tooltip>
                  <TooltipTrigger aria-label={"seed help"} className="ml-2" type="button">
                    <CircleQuestionMarkIcon size={17}></CircleQuestionMarkIcon>
                  </TooltipTrigger>
                  <TooltipContent>
                    Fix the RNG seed to reproduce an identical run. Leave blank
                    for a new random seed each time.
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="seed-input"
                type="number"
                placeholder="random"
                className="rounded-xl"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />

              {/* advanced options */}

              <Collapsible className="w-full rounded-md">
                <CollapsibleTrigger className="w-full">
                  <Marker variant="separator" className="my-2 w-full">
                    <MarkerContent className="flex items-center gap-2">
                      Advanced <ChevronDownIcon />
                    </MarkerContent>
                  </Marker>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-4">
                    {/* bonded energy */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="bonded-energy-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>
                            Bonded Energy e<sub>0</sub> (eV)
                          </span>
                          <Tooltip>
                            <TooltipTrigger aria-label={"bonded energy help"} className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              The energy stored in bonds between atoms; Farther
                              negative values make bonds atoms&apos; bonds
                              stronger
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {bondedEnergy}
                        </span>
                      </div>
                      <Slider
                        id="bonded-energy-input"
                        min={-2.0}
                        max={0}
                        step={0.01}
                        value={[bondedEnergy]}
                        onValueChange={(val: number[]) =>
                          setBondedEnergy(val[0])
                        }
                      />
                    </div>

                    {/* atom-substrate energy */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="atom-substrate-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>
                            Atom-substrate e<sub>1</sub> (eV)
                          </span>
                          <Tooltip>
                            <TooltipTrigger aria-label={"atom substrate bond energy help"} className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              The energy stored in bonds between atoms and the
                              substrate; Being more negative than the bonded
                              energy promotes vertical growth
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {atomSubstrate}
                        </span>
                      </div>
                      <Slider
                        id="atom-substrate-input"
                        min={-2.0}
                        max={0}
                        step={0.01}
                        value={[atomSubstrate]}
                        onValueChange={(val: number[]) =>
                          setAtomSubstrate(val[0])
                        }
                      />
                    </div>

                    {/* free att freq */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="free-att-freq-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>Free Attempt Freq. (v_f)</span>
                          <Tooltip>
                            <TooltipTrigger aria-label={"free attempt frequency help"} className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Vibrational frequency of isolated surface atoms
                              that may attempt displacement
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {freeAttFreq.toExponential(1)}
                        </span>
                      </div>
                      <Slider
                        id="free-att-freq-input"
                        min={1e8}
                        max={1e10}
                        step={1e8}
                        value={[freeAttFreq]}
                        onValueChange={(val: number[]) =>
                          setFreeAttFreq(val[0])
                        }
                      />
                    </div>

                    {/* dep att freq */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="dep-att-freq-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>Dep. Attempt Freq. (v_d)</span>
                          <Tooltip>
                            <TooltipTrigger aria-label={"deposition attempt frequency help"} className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Vibrational frequency of bonded surface atoms that
                              may attempt displacement
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {depAttFreq.toExponential(1)}
                        </span>
                      </div>
                      <Slider
                        id="dep-att-freq-input"
                        min={1e8}
                        max={5e9}
                        step={1e8}
                        value={[depAttFreq]}
                        onValueChange={(val: number[]) => setDepAttFreq(val[0])}
                      />
                    </div>

                    {/* pass att freq */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="pass-att-freq-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>Passivation Attempt Freq. (v_p)</span>
                          <Tooltip>
                            <TooltipTrigger aria-label={"passivation attempt frequency help"} className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Flat rate at which an exposed deposited atom
                              (with at least one empty neighbor) converts to
                              passivated -- no energy barrier
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {passAttFreq.toExponential(1)}
                        </span>
                      </div>
                      <Slider
                        id="pass-att-freq-input"
                        min={1e1}
                        max={1e5}
                        step={1e2}
                        value={[passAttFreq]}
                        onValueChange={(val: number[]) =>
                          setPassAttFreq(val[0])
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <CardFooter className="mt-auto! flex gap-2 p-0">
            <Button
              type="submit"
              variant="default"
              className="h-10 flex-5 rounded-3xl hover:bg-primary/90"
              disabled={!wasmModule}
            >
              {wasmModule
                ? "Run " + (Number(stepsToRun) || 0).toLocaleString() + " steps"
                : "Loading WASM..."}
            </Button>
            {isPaused ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1"
                onClick={handleResumeSim}
                disabled={!wasmModule}
              >
                Resume
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1"
                onClick={handlePauseSim}
                disabled={!wasmModule || !isRunning}
              >
                Pause
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              className="h-10 flex-1"
              onClick={handleStopSim}
              disabled={!wasmModule || (!isRunning && !isPaused)}
            >
              Stop
            </Button>
          </CardFooter>
          <div className="flex items-center gap-2">
            <Label htmlFor="continue-steps-input" className="sr-only">
              Steps to continue
            </Label>
            <Input
              id="continue-steps-input"
              type="number"
              min={1}
              className="h-10 flex-1 rounded-xl"
              value={continueSteps}
              onChange={(e) => setContinueSteps(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-3xl"
              onClick={continueSim}
              disabled={!canContinue}
              title="Run more steps on the current simulation without restarting"
            >
              Continue {(Number(continueSteps) || 0).toLocaleString()} steps
            </Button>
          </div>
        </Card>
      </form>
    </>
  )
}
