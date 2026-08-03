import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { BorderBeam } from "@/components/ui/border-beam"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
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
  PRESETS,
  applyPreset,
  width,
  setWidth,
  height,
  setHeight,
  drawingCarbon,
  setDrawingCarbon,
  carbonSpeciesEnergies,
  setCarbonSpecies,
  carbonSpecies,
  CARBON_SPECIES_COLORS,
  setCarbonSpeciesEnergies,
  carbonSites,
  carbonUndoStack,
  setCarbonSites,
  undoCarbonSite,
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
  ePass,
  setEPass,
  depassAttFreq,
  setDepassAttFreq,
  eDepass,
  setEDepass,
  wasmModule,
  isPaused,
  handleResumeSim,
  handlePauseSim,
  isRunning,
  handleStopSim
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-[30%] shrink-0 flex-col justify-between gap-6"
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
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((name) => (
                <Button
                  key={name}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => applyPreset(name as keyof typeof PRESETS)}
                >
                  {name}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="width-input"
                className="flex items-center text-sm font-medium"
              >
                Width
                <Tooltip>
                  <TooltipTrigger className="ml-2" type="button">
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
                  <TooltipTrigger className="ml-2" type="button">
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
                    id="draw-carbon"
                    checked={drawingCarbon}
                    onCheckedChange={setDrawingCarbon}
                  />
                </AlertAction>
              </Alert>
              {drawingCarbon && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Anode species (drawing as)
                  </Label>
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {carbonSpeciesEnergies.map((_: any, sp: any) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => setCarbonSpecies(sp)}
                        className={
                          "h-7 w-7 rounded-full border-2 transition-all " +
                          (carbonSpecies === sp
                            ? "scale-110 border-primary"
                            : "border-transparent opacity-70 hover:opacity-100")
                        }
                        style={{
                          backgroundColor: CARBON_SPECIES_COLORS[sp],
                        }}
                        title={`Species ${sp + 1}`}
                      />
                    ))}
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {carbonSpeciesEnergies.map((energy: any, sp: any) => (
                    <div key={sp} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Species {sp + 1} bond energy (eV)
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {energy}
                        </span>
                      </div>
                      <Slider
                        min={-2.0}
                        max={0}
                        step={0.01}
                        value={[energy]}
                        onValueChange={(val: number[]) =>
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setCarbonSpeciesEnergies((prev: any) => {
                            const next = prev.slice()
                            next[sp] = val[0]
                            return next
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
              {carbonSites.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => {
                      carbonUndoStack.push(new Map(carbonSites))
                      setCarbonSites(new Map())
                    }}
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
                        <TooltipTrigger className="ml-2" type="button">
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
                        <TooltipTrigger className="ml-2" type="button">
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
                    max={200000}
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
                  <TooltipTrigger className="ml-2" type="button">
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
                  <TooltipTrigger className="ml-2" type="button">
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
                  <TooltipTrigger className="ml-2" type="button">
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
                            <TooltipTrigger className="ml-2" type="button">
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
                            <TooltipTrigger className="ml-2" type="button">
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
                            <TooltipTrigger className="ml-2" type="button">
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
                            <TooltipTrigger className="ml-2" type="button">
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
                        max={1e10}
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
                            <TooltipTrigger className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Vibrational frequency of isolated surface atoms
                              that are beneath the SEI layer
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

                    {/* pass energy barrier */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="e-pass-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>Passivation Energy Barrier (E_pass)</span>
                          <Tooltip>
                            <TooltipTrigger className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Activation energy penalizing lithium ion trying
                              to pass through SEI
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {ePass}
                        </span>
                      </div>
                      <Slider
                        id="e-pass-input"
                        min={0}
                        max={2.0}
                        step={0.01}
                        value={[ePass]}
                        onValueChange={(val: number[]) => setEPass(val[0])}
                      />
                    </div>

                    {/* de-passivation attempt freq */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="depass-att-freq-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>De-passivation Attempt Freq. (v_dp)</span>
                          <Tooltip>
                            <TooltipTrigger className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Vibrational frequency governing SEI breakdown,
                              reverting a passivated atom back to deposited
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {depassAttFreq.toExponential(1)}
                        </span>
                      </div>
                      <Slider
                        id="depass-att-freq-input"
                        min={1e1}
                        max={1e9}
                        step={1e5}
                        value={[depassAttFreq]}
                        onValueChange={(val: number[]) =>
                          setDepassAttFreq(val[0])
                        }
                      />
                    </div>

                    {/* de-passivation energy barrier */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="e-depass-input"
                          className="flex items-center text-sm font-medium"
                        >
                          <span>De-passivation Energy Barrier (E_dp)</span>
                          <Tooltip>
                            <TooltipTrigger className="ml-2" type="button">
                              <CircleQuestionMarkIcon size={17} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Activation energy penalizing SEI breakdown; higher
                              than E_pass keeps passivation dominant by default
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="font-mono text-sm text-muted-foreground">
                          {eDepass}
                        </span>
                      </div>
                      <Slider
                        id="e-depass-input"
                        min={0}
                        max={2.0}
                        step={0.01}
                        value={[eDepass]}
                        onValueChange={(val: number[]) => setEDepass(val[0])}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <CardFooter className="mt-auto! flex gap-2 p-0">
            <ButtonGroup className="w-full" aria-label="Button group">
              <Button
                type="submit"
                variant="default"
                className="dark:hover:bg-primary-400 w-1/2 flex-1 rounded-xl hover:bg-primary/90"
                disabled={!wasmModule}
              >
                {wasmModule
                  ? "Run " +
                    (Number(stepsToRun) || 0).toLocaleString() +
                    " steps"
                  : "Loading WASM..."}
              </Button>
              {isPaused ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/4"
                  onClick={handleResumeSim}
                  disabled={!wasmModule}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePauseSim}
                  disabled={!wasmModule || !isRunning}
                >
                  Pause
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                onClick={handleStopSim}
                disabled={!wasmModule || (!isRunning && !isPaused)}
              >
                Stop
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </form>
    </>
  )
}
