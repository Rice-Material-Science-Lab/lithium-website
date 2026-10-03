"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  ArrowUpRight,
  ChevronDown,
  Cpu,
  Flame,
  Microscope,
  Play,
  Search,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "./homepage/layout-primitives"

type ClipKind = "simulation" | "experimental"
type ClipCategory = "simulation" | "microscopy" | "failure"

interface VideoClip {
  id: string
  title: string
  kind: ClipKind
  category: ClipCategory
  takeaway: string
  explanation: string
  embedUrl: string
  thumbnailUrl: string | null
  source: string
  year?: number
  sourceUrl: string
}

interface CatastrophicEvent {
  id: string
  title: string
  year: number
  location: string
  impact: string
  description: string
  imageUrl?: string
  imageAlt?: string
  learnMoreUrl: string
}

const yt = (id: string) => ({
  embedUrl: `https://www.youtube.com/embed/${id}`,
  thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
})

const clips: VideoClip[] = [
  {
    id: "sim-2d-dendrites",
    title: "2D Lithium Dendrite Growth Model",
    kind: "simulation",
    category: "simulation",
    takeaway:
      "Shows how ion depletion around a growing tip pulls even more lithium toward it.",
    explanation:
      "A two-dimensional numerical model of dendrite growth. The left panel shows lithium structures extending from the electrode into the electrolyte; the right panel maps lithium-ion concentration. Notice the depleted zones that form around each tip — the steeper concentration gradient there accelerates deposition at the tip, which is why dendrites grow as sharp spikes rather than an even layer.",
    ...yt("K3o0Ls91MxE"),
    source: "Nicolas Agustin Labanda",
    year: 2022,
    sourceUrl: "https://www.youtube.com/watch?v=K3o0Ls91MxE",
  },
  {
    id: "sim-scratch",
    title: "Interactive Charging Simulation",
    kind: "simulation",
    category: "simulation",
    takeaway:
      "A simplified, interactive model of uneven lithium deposition leading to a short.",
    explanation:
      "A simplified interactive demonstration built in MIT Scratch. As the cell charges, lithium ions deposit unevenly on the anode. Small bumps attract more ions than flat areas, so they grow into dendrites that eventually cross the separator and touch the cathode — the internal short circuit that can trigger thermal runaway.",
    embedUrl: "https://scratch.mit.edu/projects/966895042/embed",
    thumbnailUrl:
      "https://cdn2.scratch.mit.edu/get_image/project/966895042_480x360.png",
    source: "crkcity · MIT Scratch",
    year: 2026,
    sourceUrl: "https://scratch.mit.edu/projects/966895042/",
  },
  {
    id: "sim-limiting-factor",
    title: "How a Lithium-Ion Battery Actually Works",
    kind: "simulation",
    category: "simulation",
    takeaway:
      "A photorealistic 3D animation of the cell’s inner layers — the context for where dendrites form.",
    explanation:
      "A photorealistic animation, produced over 16 months, that walks through a lithium-ion cell layer by layer: cathode, separator, anode and electrolyte, and how lithium ions shuttle between them during charge and discharge. It’s the best foundation for understanding where dendrites grow and why a punctured separator is so dangerous.",
    ...yt("4-1psMHSpKs"),
    source: "The Limiting Factor",
    sourceUrl: "https://www.youtube.com/watch?v=4-1psMHSpKs",
  },

  {
    id: "exp-graphite-half-cell",
    title: "Dendrite Growth in a Graphite / Li Half Cell",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "Real optical footage of mossy lithium branching across the electrolyte gap.",
    explanation:
      "Direct microscopy of a cell with a graphite working electrode (bottom) and a lithium-metal counter electrode (top) during charging. Lithium plates unevenly and sprouts dark, mossy, tree-like growths that branch outward across the electrolyte gap toward the opposite electrode.",
    ...yt("f_8Ih5O8Yfc"),
    source: "Andy Wu",
    year: 2018,
    sourceUrl: "https://www.youtube.com/watch?v=f_8Ih5O8Yfc",
  },
  {
    id: "exp-el-cell",
    title: "Operando View: Graphite vs. Lithium Metal Cell",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "Filmed through a windowed test cell used in battery research labs.",
    explanation:
      "Recorded with a commercial optical test cell (EL-CELL ECC-Opto-Std) that lets researchers watch the electrode edge through a glass window while the cell is cycled. The footage shows lithium dendrites nucleating and growing on the electrode in real time — the same “operando” technique labs use to test whether new electrolytes and additives actually suppress dendrites.",
    ...yt("922FeDvw2Rk"),
    source: "EL-CELL",
    sourceUrl: "https://www.youtube.com/watch?v=922FeDvw2Rk",
  },
  {
    id: "exp-mit-boundary",
    title: "Dendrite Initiation at an Electrode Boundary",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "Supplementary footage from an MIT study — dendrites begin as tiny projections along the edge.",
    explanation:
      "High-resolution footage published as supporting material to a Nano Letters study from the Li Group at MIT. As the electrochemical reaction proceeds, dark metallic projections nucleate along the right-hand edge and branch outward into the lighter electrolyte region.",
    ...yt("IccH9OLKHaI"),
    source: "Li Group, MIT",
    year: 2015,
    sourceUrl: "https://www.youtube.com/watch?v=IccH9OLKHaI",
  },
  {
    id: "exp-cen",
    title: "Scientists Tackle the Lithium Dendrite Problem",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "How labs are fighting dendrites: electron microscopy, piezoelectric films and solid electrolytes.",
    explanation:
      "A short documentary from Chemical & Engineering News. Lithium-metal anodes could roughly double capacity compared to graphite, but dendrites have kept them out of products. The video shows electron-microscope imaging of dendrites at Pacific Northwest National Laboratory, a University of Michigan piezoelectric polymer film that survived 1,000 cycles without shorting, and Toyota Research Institute’s work on solid electrolytes with higher ionic conductivity.",
    ...yt("XP9w6mGo-mE"),
    source: "Chemical & Engineering News",
    year: 2019,
    sourceUrl:
      "https://cen.acs.org/energy/energy-storage-/Video-Battery-scientists-tackle-dendrite/97/i48",
  },
  {
    id: "exp-rice",
    title: "Why Lithium Dendrites Cause Battery Failures",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "New finding: dendrites are surprisingly strong and brittle — they snap rather than bend.",
    explanation:
      "Rice University researchers harvested individual dendrites from working batteries and tested them inside an airtight chamber in a scanning electron microscope. They found that lithium dendrites are unexpectedly strong and brittle under mechanical stress. The work was published in Science (2026) and helps explain how dendrites can force their way through a separator.",
    ...yt("Fl4RIaSXObY"),
    source: "Rice Advanced Materials Institute",
    year: 2026,
    sourceUrl:
      "https://news.rice.edu/news/2026/thorny-issue-plaguing-lithium-ion-batteries-laid-bare-new-study",
  },
  {
    id: "exp-copper-lcem",
    title: "Copper Dendrites Under Liquid-Cell Electron Microscopy",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "An analog experiment: copper grows jagged dendrites by the same mechanism as lithium.",
    explanation:
      "Real-time liquid-cell electron microscopy of copper ions depositing at an electrode. When a potential is applied, copper nucleates along the dark electrode edge at the top and grows downward into jagged dendrites. Copper is easier to image than lithium, so it’s often used to study the physics of dendritic growth.",
    ...yt("tDuaoQ4Am_c"),
    source: "Nicholas Schneider",
    year: 2016,
    sourceUrl: "https://www.youtube.com/watch?v=tDuaoQ4Am_c",
  },
  {
    id: "exp-ecm",
    title: "Electrochemical Migration on Circuit Boards",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "Dendrites aren’t just a battery problem — they short out electronics the same way.",
    explanation:
      "Surface-mount electronic components under DC voltage, observed under a microscope. With moisture present, metal ions dissolve from the positive terminal, migrate across the surface and deposit at the negative terminal. Dendrites grow back toward the positive side until one bridges the gap and causes a short circuit.",
    ...yt("1GpeQ-pkF8s"),
    source: "Surface Mount Process",
    year: 2023,
    sourceUrl: "https://www.youtube.com/watch?v=1GpeQ-pkF8s",
  },
  {
    id: "exp-protochips",
    title: "Liquid-Cell TEM: Salt Crystallization",
    kind: "experimental",
    category: "microscopy",
    takeaway:
      "Shows the imaging technique researchers use to watch dendrites form in liquid electrolyte.",
    explanation:
      "Real-time nucleation and growth of salt crystals inside a liquid cell in a transmission electron microscope. This isn’t electroplating, but it demonstrates liquid-phase TEM — the same technique researchers use to observe lithium dendrite growth and SEI formation inside battery electrolytes.",
    ...yt("6RL-eDgq5YA"),
    source: "Protochips",
    year: 2014,
    sourceUrl: "https://www.youtube.com/watch?v=6RL-eDgq5YA",
  },

  {
    id: "fail-stached",
    title: "What Is Thermal Runaway?",
    kind: "experimental",
    category: "failure",
    takeaway:
      "The chain reaction that turns an internal short into a fire — and why it’s so hard to stop.",
    explanation:
      "A training breakdown of thermal runaway: a failing cell heats up, which triggers reactions that release more heat, which heats neighbouring cells. Covers what triggers it (internal shorts from dendrites, overcharging, physical damage, heat), how it spreads, and why it is so difficult to stop once it starts.",
    ...yt("3PHbIaT-TtM"),
    source: "StacheD Training",
    year: 2023,
    sourceUrl: "https://www.youtube.com/watch?v=3PHbIaT-TtM",
  },
  {
    id: "fail-fsri-bedroom",
    title: "Overcharged E-Scooter in a Bedroom",
    kind: "experimental",
    category: "failure",
    takeaway:
      "A full-scale lab fire test — watch how quickly a room becomes unsurvivable.",
    explanation:
      "UL’s Fire Safety Research Institute intentionally overcharged an e-scooter inside a furnished bedroom to drive the battery into thermal runaway. The full-scale experiment (November 2022) is part of FSRI’s research into e-mobility fire hazards in homes and shows how fast smoke, heat and flames spread from a single battery pack.",
    embedUrl: "https://player.vimeo.com/video/768558655",
    thumbnailUrl: "https://vumbnail.com/768558655.jpg",
    source: "UL Fire Safety Research Institute",
    year: 2022,
    sourceUrl:
      "https://fsri.org/resource/intentional-e-scooter-overcharge-bedroom",
  },
  {
    id: "fail-cbs",
    title: "The Explosive Power of Thermal Runaway",
    kind: "experimental",
    category: "failure",
    takeaway:
      "A controlled test shows the violent energy release when a lithium-ion pack fails.",
    explanation:
      "CBS News reports on a controlled test that deliberately drives a lithium-ion battery into thermal runaway, showing the jets of flame and gas that are released and why these fires are so dangerous indoors.",
    ...yt("0RrqiO3k94k"),
    source: "CBS News",
    sourceUrl: "https://www.youtube.com/watch?v=0RrqiO3k94k",
  },
  {
    id: "fail-bakerrisk",
    title: "Grid Battery (BESS) Explosion Testing",
    kind: "experimental",
    category: "failure",
    takeaway:
      "Large-scale tests on the flammable gas that failing cells release — the cause of the McMicken explosion.",
    explanation:
      "BakerRisk runs large-scale thermal runaway and explosion tests on battery energy storage systems, measuring gas generation, pressure build-up and explosion risk. This is the hazard behind incidents like the 2019 McMicken explosion, where vented gas accumulated in an enclosure and ignited.",
    ...yt("Cb_CLdIUcto"),
    source: "BakerRisk",
    year: 2023,
    sourceUrl: "https://www.youtube.com/watch?v=Cb_CLdIUcto",
  },
  {
    id: "fail-mbn",
    title: "Lithium Battery Explosion Test",
    kind: "experimental",
    category: "failure",
    takeaway: "What happens when a lithium battery is pushed past its limits.",
    explanation:
      "A controlled explosion test demonstrating the fire risk of lithium batteries when subjected to stress or failure conditions.",
    ...yt("NKsEvsB6DHI"),
    source: "MBN News",
    year: 2025,
    sourceUrl: "https://www.youtube.com/watch?v=NKsEvsB6DHI",
  },
  {
    id: "fail-ncm-lfp",
    title: "NCM vs. LFP (BYD Blade) Nail Test",
    kind: "experimental",
    category: "failure",
    takeaway:
      "Chemistry matters: LFP cells are far more resistant to thermal runaway than NCM.",
    explanation:
      "A side-by-side abuse test of a nickel-cobalt-manganese (NCM) cell and a lithium-iron-phosphate (LFP) BYD Blade cell. The difference in thermal stability between the two chemistries is dramatic, which is one reason LFP is increasingly used in EVs and grid storage.",
    ...yt("e0mGpK-tVkE"),
    source: "Createsomes",
    sourceUrl: "https://www.youtube.com/shorts/e0mGpK-tVkE",
  },
  {
    id: "fail-dem-con",
    title: "Lithium Battery Fire at a Recycling Facility",
    kind: "experimental",
    category: "failure",
    takeaway:
      "Real footage of how quickly a battery fire intensifies once it starts.",
    explanation:
      "Real footage from Dem-Con Companies, a waste and recycling operator, of a lithium battery fire. Batteries thrown in the trash or recycling are a growing cause of fires at waste facilities.",
    ...yt("oieH2wwDGzo"),
    source: "Dem-Con Companies",
    year: 2020,
    sourceUrl: "https://www.youtube.com/watch?v=oieH2wwDGzo",
  },
  {
    id: "fail-abc7",
    title: "E-Bike Shop Fire After Battery Explodes",
    kind: "experimental",
    category: "failure",
    takeaway: "News footage of a real e-bike battery fire in a Chicago shop.",
    explanation:
      "ABC 7 Chicago covers a fire at an e-bike shop that started when a lithium battery exploded — an example of the risk from unregulated or damaged e-bike packs, especially where many are stored and charged together.",
    ...yt("9TsieJbjXaI"),
    source: "ABC 7 Chicago",
    year: 2024,
    sourceUrl: "https://www.youtube.com/watch?v=9TsieJbjXaI",
  },
  {
    id: "fail-kord",
    title: "Suppressing a Thermal Runaway Fire",
    kind: "experimental",
    category: "failure",
    takeaway:
      "Why ordinary extinguishers fall short, and what purpose-built suppression looks like.",
    explanation:
      "A demonstration of a suppression system designed for lithium-ion thermal runaway, showing how specialised agents cool and contain battery fires that conventional systems struggle with.",
    ...yt("TNN7TKcy0do"),
    source: "Kord Fire Protection",
    sourceUrl: "https://www.youtube.com/shorts/TNN7TKcy0do",
  },
]

const events: CatastrophicEvent[] = [
  {
    id: "ups-6",
    title: "UPS Airlines Flight 6",
    year: 2010,
    location: "Dubai, UAE",
    impact: "2 crew killed",
    description:
      "A Boeing 747-400 freighter crashed near Dubai after a fire broke out in the main cargo deck, which was carrying a large shipment of lithium batteries. Smoke filled the cockpit within minutes. The crash led to tighter international rules on shipping lithium batteries by air.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/N571UP.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    learnMoreUrl: "https://en.wikipedia.org/wiki/UPS_Airlines_Flight_6",
  },
  {
    id: "boeing-787",
    title: "Boeing 787 Dreamliner Grounding",
    year: 2013,
    location: "Worldwide",
    impact: "Entire fleet grounded",
    description:
      "The FAA grounded all Boeing 787s after two lithium-ion battery incidents within nine days. An internal short circuit in a battery cell led to thermal runaway that spread to neighbouring cells — the first fleet-wide grounding of an airliner since 1979.",
    imageUrl:
      "https://static0.simpleflyingimages.com/wordpress/wp-content/uploads/2022/03/GettyImages-165716532-1000x601.jpg?q=50&fit=crop&w=992&h=558&dpr=1.5",
    learnMoreUrl: "https://simpleflying.com/boeing-787-battery-issues/",
  },
  {
    id: "samsung-note7",
    title: "Samsung Galaxy Note 7 Recall",
    year: 2016,
    location: "Worldwide",
    impact: "$5B+ cost",
    description:
      "Samsung recalled and discontinued the Galaxy Note 7 after phones caught fire worldwide. Two separate manufacturing defects — a battery casing too small for its cell, and welding flaws that could pierce the separator — caused internal short circuits and thermal runaway.",
    imageUrl:
      "https://www.edn.com/wp-content/uploads/mobile-devices-galaxy-note-7.jpg?fit=770%2C433",
    imageAlt: "Samsung Galaxy Note 7 smartphone",
    learnMoreUrl:
      "https://francis-press.com/uploads/papers/IfWxKOnMTYTm9UM82RGD5ScuKIoF7phhslFNWMrn.pdf",
  },
  {
    id: "mcmicken-explosion",
    title: "McMicken Battery Storage Explosion",
    year: 2019,
    location: "Surprise, Arizona",
    impact: "4 firefighters injured",
    description:
      "Flammable gas vented from cells in thermal runaway built up inside an APS battery storage enclosure and exploded when firefighters opened the door, critically injuring two. The incident reshaped ventilation and emergency-response standards for grid batteries.",
    imageUrl:
      "https://pv-magazine-usa.com/wp-content/uploads/2019/02/aps_battery-e1550776292391.jpg",
    imageAlt: "Grid-scale lithium battery storage facility",
    learnMoreUrl:
      "https://eticaag.com/the-arizona-mcmicken-bess-explosion-key-takeaways/",
  },
  {
    id: "victorian-big-battery",
    title: "Victorian Big Battery Fire",
    year: 2021,
    location: "Geelong, Australia",
    impact: "2 Megapacks destroyed",
    description:
      "During commissioning, a coolant leak caused a short circuit that triggered thermal runaway in a Tesla Megapack at the 300 MW facility. Fire spread to a second unit and took days to bring fully under control, prompting changes to Megapack design and firmware.",
    imageUrl:
      "https://www.energy-storage.news/wp-content/uploads/2021/12/VBB-victoria-state-government.jpeg",
    imageAlt: "Victorian Big Battery Tesla Megapack facility",
    learnMoreUrl:
      "https://www.energy-storage.news/investigation-confirms-cause-of-fire-at-teslas-victorian-big-battery-in-australia/",
  },
  {
    id: "chevy-bolt-recall",
    title: "Chevrolet Bolt EV Recall",
    year: 2021,
    location: "United States",
    impact: "~140,000 vehicles",
    description:
      "GM recalled every Chevrolet Bolt EV and EUV (2017–2022) after LG cells with two rare, simultaneous manufacturing defects — a torn anode tab and a folded separator — were linked to fires. Owners were told not to park indoors or charge overnight until batteries were replaced.",
    imageUrl:
      "https://www.kbb.com/wp-content/uploads/2021/02/2022-chevrolet-bolt-ev-front-3qtr-16x9-1.jpg",
    imageAlt: "Chevrolet Bolt EV",
    learnMoreUrl:
      "https://www.nhtsa.gov/press-releases/recall-all-chevy-bolt-vehicles-fire-risk",
  },
  {
    id: "nyc-ebike-fires",
    title: "NYC E-Bike Battery Fire Crisis",
    year: 2023,
    location: "New York City",
    impact: "18 deaths in 2023",
    description:
      "Lithium-ion battery fires from e-bikes and scooters became one of New York City’s deadliest fire causes, killing 18 people in 2023. Uncertified and aftermarket battery packs were the leading culprit, prompting a city law requiring UL-certified devices.",
    imageUrl:
      "https://d2c0db5b8fb27c1c9887-9b32efc83a6b298bb22e7a1df0837426.ssl.cf2.rackcdn.com/24818020-nyc-ebike-battery-fire-liabilit-1826x872.png",
    imageAlt: "FDNY fire engine",
    learnMoreUrl:
      "https://www.nytimes.com/2023/06/21/nyregion/e-bike-lithium-battery-fires-nyc.html",
  },
  {
    id: "moss-landing",
    title: "Moss Landing Battery Plant Fire",
    year: 2025,
    location: "Moss Landing, California",
    impact: "~1,200 evacuated",
    description:
      "A fire broke out at Vistra’s 300 MW battery building at Moss Landing, one of the largest grid batteries in the world. It burned for days, forced evacuations and closed Highway 1, and renewed debate over siting large indoor battery installations.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Moss_Landing_Battery_Fire.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Moss_Landing_Power_Plant",
  },
]

const categoryMeta: Record<
  ClipCategory,
  { label: string; icon: typeof Cpu; blurb: string; group: ClipKind }
> = {
  simulation: {
    label: "Simulations & Animations",
    icon: Cpu,
    group: "simulation",
    blurb:
      "Computer models and animations. They allow us to see what is not visible to the naked eye, such as ion flow, concentration fields and cell structure.",
  },
  microscopy: {
    label: "Lab Microscopy",
    icon: Microscope,
    group: "experimental",
    blurb:
      "Real footage recorded through optical and electron microscopes as dendrites nucleate and grow inside working or model cells.",
  },
  failure: {
    label: "Fire & Failure Tests",
    icon: Flame,
    group: "experimental",
    blurb:
      "Controlled abuse tests, full-scale fire experiments and news footage showing what happens after a cell fails.",
  },
}

const kindLabel: Record<ClipKind, string> = {
  simulation: "Simulated",
  experimental: "Experimental",
}

function withAutoplay(url: string) {
  if (url.includes("youtube.com") || url.includes("vimeo.com")) {
    return `${url}${url.includes("?") ? "&" : "?"}autoplay=1`
  }
  return url
}

function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string | null
  alt: string
  fallback: ReactNode
  className?: string
}) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) return <>{fallback}</>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setErrored(true)}
    />
  )
}

function KindBadge({
  kind,
  className = "",
}: {
  kind: ClipKind
  className?: string
}) {
  const Icon = kind === "simulation" ? Cpu : Microscope
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur ${
        kind === "simulation"
          ? "bg-background/90 text-primary ring-1 ring-primary/30"
          : "bg-foreground/85 text-background"
      } ${className}`}
    >
      <Icon className="h-3 w-3" />
      {kindLabel[kind]}
    </span>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Video viewer (modal)
// ─────────────────────────────────────────────────────────────────────────────

function VideoViewer({
  clip,
  onClose,
}: {
  clip: VideoClip
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-card shadow-2xl ring-1 ring-border sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-overlay/60 text-overlay-foreground transition hover:bg-overlay/80"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="aspect-video w-full bg-overlay">
          <iframe
            src={withAutoplay(clip.embedUrl)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={clip.title}
          />
        </div>

        <div className="space-y-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={clip.kind} />
            <span className="text-xs text-muted-foreground">
              {categoryMeta[clip.category].label}
            </span>
          </div>
          <h3
            id="viewer-title"
            className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            {clip.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {clip.explanation}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{clip.source}</span>
              {clip.year && <> · {clip.year}</>}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href={clip.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                View original source <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Video card + tabbed gallery
// ─────────────────────────────────────────────────────────────────────────────

function VideoCard({ clip, onOpen }: { clip: VideoClip; onOpen: () => void }) {
  const Icon = categoryMeta[clip.category].icon
  return (
    <button
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      aria-label={`Watch ${clip.title}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <ImageWithFallback
          src={clip.thumbnailUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 via-primary/5 to-transparent">
              <Icon className="h-10 w-10 text-primary/40" />
            </div>
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-overlay/50 via-overlay/0 to-overlay/0" />
        <KindBadge kind={clip.kind} className="absolute top-3 left-3" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-overlay-foreground/90 text-primary shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-overlay-foreground">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-[15px] leading-snug font-semibold text-foreground">
          {clip.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {clip.takeaway}
        </p>
        <p className="truncate pt-1 text-xs text-muted-foreground/80">
          {clip.source}
          {clip.year && ` · ${clip.year}`}
        </p>
      </div>
    </button>
  )
}

function VideoLibrary() {
  const [active, setActive] = useState<ClipCategory>("simulation")
  const [showAll, setShowAll] = useState(false)
  const [openClip, setOpenClip] = useState<VideoClip | null>(null)
  const closeViewer = useCallback(() => setOpenClip(null), [])

  const counts = useMemo(() => {
    const c: Record<ClipCategory, number> = {
      simulation: 0,
      microscopy: 0,
      failure: 0,
    }
    clips.forEach((clip) => c[clip.category]++)
    return c
  }, [])

  const filtered = useMemo(
    () => clips.filter((c) => c.category === active),
    [active]
  )
  const INITIAL = 6
  const displayed = showAll ? filtered : filtered.slice(0, INITIAL)
  const remaining = filtered.length - INITIAL
  const meta = categoryMeta[active]

  const groups: { kind: ClipKind; categories: ClipCategory[] }[] = [
    { kind: "simulation", categories: ["simulation"] },
    { kind: "experimental", categories: ["microscopy", "failure"] },
  ]

  return (
    <Reveal>
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Video Library"
          title="Watch dendrites form and its effects"
          description="Clips are split into simulated footage (models and animations) and experimental footage (real recordings from labs and fire tests). Click through the videos to learn more about battery hazards and how it works."
        />

        <div
          role="tablist"
          aria-label="Video categories"
          className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-2 shadow-sm backdrop-blur sm:flex-row sm:items-stretch"
        >
          {groups.map((group, gi) => (
            <div
              key={group.kind}
              className={`flex flex-col gap-1.5 ${gi > 0 ? "border-t border-border/70 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3" : ""} ${group.categories.length > 1 ? "sm:flex-2" : "sm:flex-1"}`}
            >
              <span className="px-2 pt-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {kindLabel[group.kind]}
              </span>
              <div className="flex flex-col gap-1.5 sm:flex-row">
                {group.categories.map((cat) => {
                  const m = categoryMeta[cat]
                  const Icon = m.icon
                  const selected = cat === active
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => {
                        setActive(cat)
                        setShowAll(false)
                      }}
                      className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                        selected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{m.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                          selected
                            ? "bg-primary-foreground/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {counts[cat]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="max-w-3xl border-l-2 border-primary/50 pl-3 text-sm leading-relaxed text-muted-foreground">
          {meta.blurb}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((clip) => (
            <VideoCard
              key={clip.id}
              clip={clip}
              onOpen={() => setOpenClip(clip)}
            />
          ))}
        </div>

        {remaining > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="gap-1.5 rounded-full px-5"
            >
              {showAll ? "Show fewer" : `Show ${remaining} more`}
              <ChevronDown
                className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}

        {openClip && <VideoViewer clip={openClip} onClose={closeViewer} />}
      </section>
    </Reveal>
  )
}

function EventCard({ event }: { event: CatastrophicEvent }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:shadow-md sm:flex-row">
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-56">
        <ImageWithFallback
          src={event.imageUrl}
          alt={event.imageAlt ?? event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-linear-to-br from-primary/25 via-primary/10 to-transparent">
              <Flame className="h-7 w-7 text-primary/50" />
              <span className="font-heading text-3xl font-bold tracking-tight text-primary/60">
                {event.year}
              </span>
            </div>
          }
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
            {event.year}
          </span>
          <span className="text-muted-foreground">{event.location}</span>
          <span className="ml-auto rounded-full bg-destructive/10 px-2.5 py-0.5 font-semibold text-destructive">
            {event.impact}
          </span>
        </div>
        <h3 className="font-heading text-lg leading-snug font-semibold text-foreground">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>
        <div className="mt-auto pt-1">
          <a
            href={event.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read the full story <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  )
}

function IncidentTimeline() {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const INITIAL = 4

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = [...events].sort((a, b) => b.year - a.year)
    if (!q) return list
    return list.filter((e) =>
      [e.title, e.description, e.location, String(e.year)].some((s) =>
        s.toLowerCase().includes(q)
      )
    )
  }, [query])

  const displayed = showAll || query ? filtered : filtered.slice(0, INITIAL)
  const remaining = filtered.length - INITIAL

  return (
    <Reveal>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Case Studies"
            title="Notable incidents"
            description="Real-world failures, from phones to aircraft to grid-scale storage, and what investigators found."
          />
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, place or year"
              className="rounded-full bg-card pl-9"
              aria-label="Search incidents"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No incidents match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ol className="relative space-y-5 sm:pl-8">
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-2.75 hidden w-px bg-linear-to-b from-primary/60 via-primary/25 to-transparent sm:block"
            />
            {displayed.map((event) => (
              <li key={event.id} className="relative">
                <span
                  aria-hidden
                  className="absolute top-6 -left-8 hidden h-5.75 w-5.75 items-center justify-center rounded-full border-2 border-primary bg-background sm:flex"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <EventCard event={event} />
              </li>
            ))}
          </ol>
        )}

        {!query && remaining > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="gap-1.5 rounded-full px-5"
            >
              {showAll ? "Show fewer" : `Show ${remaining} more`}
              <ChevronDown
                className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}
      </section>
    </Reveal>
  )
}

export default function LibraryClientView() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto max-w-6xl space-y-16 px-4 pt-20 pb-24 sm:space-y-20 sm:px-6 sm:pt-28">
        <VideoLibrary />
        <IncidentTimeline />

        <p className="border-t border-border/70 pt-6 text-xs leading-relaxed text-muted-foreground">
          All videos are embedded from their original publishers and remain the
          property of their creators. Summaries are written for educational use;
          follow each source link for full details.
        </p>
      </main>
    </div>
  )
}