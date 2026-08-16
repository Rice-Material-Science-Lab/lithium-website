"use client"

import { useState } from "react"
import { ExternalLink, PlayCircle, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ── Catastrophic Events ───────────────────────────────────────────────────────

interface CatastrophicEvent {
  id: string
  title: string
  year: number
  description: string
  imageUrl: string
  imageAlt: string
  learnMoreUrl: string
}

const events: CatastrophicEvent[] = [
  {
    id: "boeing-787",
    title: "Boeing 787 Grounding",
    year: 2013,
    description:
      "In January 2013, the FAA grounded all Boeing 787 Dreamliners worldwide after two lithium-ion battery fires within nine days. An internal short circuit in the auxiliary power unit battery caused thermal runaway—the first grounding of a commercial airliner since the DC-10 in 1979.",
    imageUrl:
      "https://i2-prod.mirror.co.uk/article34859239.ece/ALTERNATES/s1200e/0_American-Airlines-plane-erupts-in-flames-at-Denver-Airport-as-terrified-passengers-are-forced-to-esc.jpg",
    imageAlt: "Boeing 787 Dreamliner in flight",
    learnMoreUrl: "https://simpleflying.com/boeing-787-battery-issues/",
  },
  {
    id: "samsung-note7",
    title: "Samsung Galaxy Note 7 Recall",
    year: 2016,
    description:
      "Samsung recalled and permanently discontinued the Galaxy Note 7 after devices caught fire or exploded worldwide. Two simultaneous manufacturing defects—an overly tight battery casing and faulty separators—caused short circuits and thermal runaway. The recall cost Samsung over $5 billion.",
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
    description:
      "In April 2019, an Arizona Public Service lithium battery storage facility in Surprise, AZ exploded, injuring four firefighters—one critically. Venting gases from thermal runaway accumulated inside the enclosure and detonated when responders opened the access door, launching one firefighter 30 feet.",
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
    description:
      "A coolant leak triggered thermal runaway in a Tesla Megapack unit at Australia's 300 MW Victorian Big Battery project, spreading fire to a second unit. The blaze burned for over six hours, exposing critical safety gaps in large-scale lithium storage systems and fire suppression protocols.",
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
    description:
      "General Motors recalled all ~140,000 Chevrolet Bolt EVs and EUVs (model years 2017–2022) after LG battery cells with two simultaneous manufacturing defects were found to cause fires. GM advised owners never to charge overnight or park in enclosed spaces. The recall cost GM and LG over $2 billion.",
    imageUrl:
      "https://www.kbb.com/wp-content/uploads/2021/02/2022-chevrolet-bolt-ev-front-3qtr-16x9-1.jpg",
    imageAlt: "Chevrolet Bolt EV",
    learnMoreUrl:
      "https://www.nhtsa.gov/press-releases/recall-all-chevy-bolt-vehicles-fire-risk",
  },
  {
    id: "nyc-ebike-fires",
    title: "NYC E-Bike Battery Crisis",
    year: 2023,
    description:
      "Lithium-ion e-bike battery fires became New York City's deadliest and fastest-growing fire hazard, killing over 20 people in 2023 alone. A single Queens e-bike repair shop fire killed four. Unregulated, counterfeit battery packs unable to safely handle repeated charging cycles are the primary cause.",
    imageUrl:
      "https://d2c0db5b8fb27c1c9887-9b32efc83a6b298bb22e7a1df0837426.ssl.cf2.rackcdn.com/24818020-nyc-ebike-battery-fire-liabilit-1826x872.png",
    imageAlt: "NYFD fire engine",
    learnMoreUrl:
      "https://www.nytimes.com/2023/06/21/nyregion/e-bike-lithium-battery-fires-nyc.html",
  },
]

// ── Video Clips ───────────────────────────────────────────────────────────────

interface VideoClip {
  id: string
  title: string
  explanation: string
  embedUrl: string | null
  thumbnailUrl: string | null
  sourceLabel: string
  sourceUrl: string
}

const visualizationClips: VideoClip[] = [
  {
    id: "clip-1",
    title: "Dendrite Growth Process",
    explanation:
      "This clip gives a visual representation of the process of dendrite growth. During discharge, lithium ions are stripped off the anode surface and migrate across the electrolyte toward the cathode. During charging, lithium ions deposit back onto the anode. Repeated charge and discharge cycles lead to uneven stripping, which gradually roughens the anode surface. This roughening alters the local electric field, creating high-field concentration points that draw extra metal toward developing spikes. As these dendrites grow, they exert significant mechanical force, eventually puncturing the separator and bridging the gap between anode and cathode, causing a short circuit.",
    embedUrl: "https://www.youtube.com/embed/M1yow7VoZCk",
    thumbnailUrl: "https://img.youtube.com/vi/M1yow7VoZCk/hqdefault.jpg",
    sourceLabel: "Innovations in Manufacturing at ORNL (2011)",
    sourceUrl: "https://www.youtube.com/watch?v=M1yow7VoZCk",
  },
  {
    id: "clip-2",
    title: "2D Lithium Battery Dendrites",
    explanation:
      "On the left, we can see the structural growth of lithium dendrites extending from the left electrode interface into the electrolyte space. On the right, we can see ion depletion and localized gradient dynamics surrounding the growing tips.",
    embedUrl: "https://www.youtube.com/embed/K3o0Ls91MxE",
    thumbnailUrl: "https://img.youtube.com/vi/K3o0Ls91MxE/hqdefault.jpg",
    sourceLabel: "Nicolas Agustin Labanda (2022)",
    sourceUrl: "https://www.youtube.com/watch?v=K3o0Ls91MxE",
  },
  {
    id: "clip-3",
    title: "Electrochemical Migration & Dendrite Formation",
    explanation:
      "The video shows surface-mount electronic component packages subjected to direct current voltages under real-time microscopic observation. Under the influence of moisture, metal ions dissolve from the positive anode, migrate across the surface, and reduce at the negative cathode. As metal ions receive electrons, dendrites begin to form and extend back toward the anode. Once a dendrite branch spans the full gap and contacts the positive terminal, it forms a conductive bridge, causing a short circuit.",
    embedUrl: "https://www.youtube.com/embed/1GpeQ-pkF8s",
    thumbnailUrl: "https://img.youtube.com/vi/1GpeQ-pkF8s/hqdefault.jpg",
    sourceLabel: "Surface Mount Process (2023)",
    sourceUrl: "https://www.youtube.com/watch?v=1GpeQ-pkF8s",
  },
  {
    id: "clip-4",
    title: "Li-Ion Battery Charging Simulation",
    explanation:
      "A simple demonstration on Scratch showing the uneven deposit of lithium ions during charging, leading to the formation of dendrites and ultimately a short circuit.",
    embedUrl: "https://scratch.mit.edu/projects/966895042/embed",
    thumbnailUrl: null,
    sourceLabel: "crkcity (2026) — MIT Scratch",
    sourceUrl: "https://scratch.mit.edu/projects/966895042/",
  },
  {
    id: "clip-5",
    title: "Lithium Whisker Formation & Stress Response",
    explanation:
      "The video captures real-time imaging of an electrochemical cell observing lithium electrodeposition. Lithium first accumulates as a small clump before rapidly growing into a thin, needle-like lithium whisker—a specific type of dendrite. Subsequent clips show how whiskers are inhibited under different gas conditions (CO₂ and N₂), and how compressive forces from the probe tip cause the whisker to bend and buckle.",
    embedUrl: "https://www.youtube.com/embed/XP9w6mGo-mE",
    thumbnailUrl: "https://img.youtube.com/vi/XP9w6mGo-mE/hqdefault.jpg",
    sourceLabel: "He et al. (2019) — Nature Nanotechnology",
    sourceUrl: "https://www.youtube.com/watch?v=XP9w6mGo-mE",
  },
  {
    id: "clip-6",
    title: "Liquid-Phase EM: Dendrite Growth & Suppression",
    explanation:
      "As electrochemical plating begins, dark dendrites rapidly nucleate along the electrode surface and branch aggressively into the liquid electrolyte. With lithium nitrate added, growth transitions from long filaments to denser, slower clusters. During discharge, root regions dissolve back and detached fragments become isolated dead lithium. Polysulfide additives produce short, stubby dendrites. When both additives are combined, the electrode-electrolyte interface remains smooth and dendrite growth is suppressed to a high degree.",
    embedUrl: null,
    thumbnailUrl: null,
    sourceLabel: "Rong et al. (2017) — Advanced Materials",
    sourceUrl: "https://doi.org/10.1002/adma.201606187",
  },
  {
    id: "clip-7",
    title: "Liquid-Cell TEM: Salt Crystallization",
    explanation:
      "This video captures the real-time nucleation and expansion of salt crystals. Although driven by chemical solute rather than electrochemical plating, it demonstrates liquid-phase TEM—the exact imaging technique researchers rely on to visualize real-time lithium dendrite growth and SEI dynamics inside lithium batteries.",
    embedUrl: "https://www.youtube.com/embed/6RL-eDgq5YA",
    thumbnailUrl: "https://img.youtube.com/vi/6RL-eDgq5YA/hqdefault.jpg",
    sourceLabel: "Protochips (2014)",
    sourceUrl: "https://www.youtube.com/watch?v=6RL-eDgq5YA",
  },
  {
    id: "clip-8",
    title: "Lithium Dendrite Growth in Graphite/Li Half Cell",
    explanation:
      "Direct microscopy footage of lithium dendrites forming between a dark graphite working electrode at the bottom and a metallic lithium counter electrode at the top during charging. Metallic lithium plates unevenly, sprouting as dark, mossy, tree-like crystalline projections that rapidly branch outward across the electrolyte gap toward the opposing electrode.",
    embedUrl: "https://www.youtube.com/embed/f_8Ih5O8Yfc",
    thumbnailUrl: "https://img.youtube.com/vi/f_8Ih5O8Yfc/hqdefault.jpg",
    sourceLabel: "Andy Wu (2018)",
    sourceUrl: "https://www.youtube.com/watch?v=f_8Ih5O8Yfc",
  },
  {
    id: "clip-9",
    title: "Nanoscale Dendrite Nucleation",
    explanation:
      "A nanoscale micrograph showing the nucleation and growth of metallic lithium dendrites at the interface of a battery electrode. The dark, irregular clusters branching outward form during charging when lithium ions unevenly accumulate at surface microstructures rather than plating in a smooth, uniform layer.",
    embedUrl: null,
    thumbnailUrl: null,
    sourceLabel: "Source unavailable (video deleted)",
    sourceUrl: "#",
  },
  {
    id: "clip-10",
    title: "Copper Electrodeposition & Dendrite Formation",
    explanation:
      "Real-time liquid-cell electron microscopy footage of copper ions depositing at an electrode interface. As an electric potential is applied across the microfluidic cell, metallic copper nucleates along the dark electrode edge at the top and rapidly grows downward into jagged dendritic structures.",
    embedUrl: "https://www.youtube.com/embed/tDuaoQ4Am_c",
    thumbnailUrl: "https://img.youtube.com/vi/tDuaoQ4Am_c/hqdefault.jpg",
    sourceLabel: "Nicholas Schneider (2016)",
    sourceUrl: "https://www.youtube.com/watch?v=tDuaoQ4Am_c",
  },
  {
    id: "clip-11",
    title: "Lithium Dendrite Initiation at Electrode Boundary",
    explanation:
      "High-resolution footage of lithium dendrite initiation and nanoscale growth at an electrode boundary. As electrochemical reaction time progresses, dark metallic projections nucleate along the right edge and branch outward into the lighter electrolyte region.",
    embedUrl: "https://www.youtube.com/embed/IccH9OLKHaI",
    thumbnailUrl: "https://img.youtube.com/vi/IccH9OLKHaI/hqdefault.jpg",
    sourceLabel: "Li Group MIT (2015)",
    sourceUrl: "https://www.youtube.com/watch?v=IccH9OLKHaI",
  },
]

const accidentClips: VideoClip[] = [
  {
    id: "clip-12",
    title: "What is Thermal Runaway: Lithium-Ion Batteries",
    explanation:
      "An educational breakdown of thermal runaway in lithium-ion batteries — the self-sustaining chain reaction that converts a failing cell into a fire or explosion. Covers triggering conditions, propagation mechanics, and why the process is so difficult to stop once initiated.",
    embedUrl: "https://www.youtube.com/embed/3PHbIaT-TtM",
    thumbnailUrl: "https://img.youtube.com/vi/3PHbIaT-TtM/hqdefault.jpg",
    sourceLabel: "StacheD Training (2023)",
    sourceUrl: "https://www.youtube.com/watch?v=3PHbIaT-TtM",
  },
  {
    id: "clip-13",
    title: "Lithium Battery Fire",
    explanation:
      "Real footage of a lithium battery fire demonstrating the intensity and speed with which lithium-ion cells can combust once thermal runaway begins.",
    embedUrl: "https://www.youtube.com/embed/oieH2wwDGzo",
    thumbnailUrl: "https://img.youtube.com/vi/oieH2wwDGzo/hqdefault.jpg",
    sourceLabel: "Dem-Con Companies LLC (2020)",
    sourceUrl: "https://www.youtube.com/watch?v=oieH2wwDGzo",
  },
  {
    id: "clip-14",
    title: "E-Bike Shop Battery Explosion Fire",
    explanation:
      "News coverage of a fire that broke out at an e-bike shop after a lithium battery exploded, illustrating the real-world dangers of unregulated and counterfeit lithium battery packs used in electric bikes.",
    embedUrl: "https://www.youtube.com/embed/9TsieJbjXaI",
    thumbnailUrl: "https://img.youtube.com/vi/9TsieJbjXaI/hqdefault.jpg",
    sourceLabel: "ABC 7 Chicago (2024)",
    sourceUrl: "https://www.youtube.com/watch?v=9TsieJbjXaI",
  },
  {
    id: "clip-15",
    title: "Lithium Battery Explosion Test",
    explanation:
      "A controlled explosion test demonstrating the devastating fire risk of lithium batteries when subjected to stress or failure conditions.",
    embedUrl: "https://www.youtube.com/embed/NKsEvsB6DHI",
    thumbnailUrl: "https://img.youtube.com/vi/NKsEvsB6DHI/hqdefault.jpg",
    sourceLabel: "MBN News (2025)",
    sourceUrl: "https://www.youtube.com/watch?v=NKsEvsB6DHI",
  },
  {
    id: "clip-16",
    title: "NCM vs BYD Blade Battery Safety Test",
    explanation:
      "A side-by-side comparison between an NCM (nickel-cobalt-manganese) lithium battery and a BYD Blade LFP battery under abuse conditions, highlighting the dramatic difference in thermal stability between the two chemistries.",
    embedUrl: "https://www.youtube.com/embed/e0mGpK-tVkE",
    thumbnailUrl: "https://img.youtube.com/vi/e0mGpK-tVkE/hqdefault.jpg",
    sourceLabel: "YouTube Shorts",
    sourceUrl: "https://www.youtube.com/shorts/e0mGpK-tVkE",
  },
  {
    id: "clip-17",
    title: "Battery Energy Storage Systems: Thermal Runaway Testing",
    explanation:
      "BakerRisk conducts large-scale thermal runaway and explosion testing on lithium-ion battery energy storage systems (BESS), providing data on gas generation, pressure buildup, and explosion risk relevant to grid-scale deployments.",
    embedUrl: "https://www.youtube.com/embed/Cb_CLdIUcto",
    thumbnailUrl: "https://img.youtube.com/vi/Cb_CLdIUcto/hqdefault.jpg",
    sourceLabel: "BakerRisk (2023)",
    sourceUrl: "https://www.youtube.com/watch?v=Cb_CLdIUcto",
  },
  {
    id: "clip-18",
    title: "Thermal Runaway Fire Suppression System",
    explanation:
      "A demonstration of a fire suppression system designed specifically for lithium-ion thermal runaway, showing how specialized suppression agents work to cool and contain battery fires that standard water-based systems cannot handle.",
    embedUrl: "https://www.youtube.com/embed/TNN7TKcy0do",
    thumbnailUrl: "https://img.youtube.com/vi/TNN7TKcy0do/hqdefault.jpg",
    sourceLabel: "YouTube Shorts",
    sourceUrl: "https://www.youtube.com/shorts/TNN7TKcy0do",
  },
]

// ── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ clip }: { clip: VideoClip }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Video / Thumbnail */}
      <div className="relative w-full bg-muted" style={{ paddingTop: "52%" }}>
        <div className="absolute inset-0">
          {clip.embedUrl === null ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <span className="text-2xl">🔬</span>
              <span className="text-xs">Video unavailable</span>
            </div>
          ) : playing ? (
            <iframe
              src={`${clip.embedUrl}?autoplay=1`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={clip.title}
            />
          ) : (
            <button
              className="group relative h-full w-full cursor-pointer"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${clip.title}`}
            >
              {clip.thumbnailUrl ? (
                <img
                  src={clip.thumbnailUrl}
                  alt={clip.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <PlayCircle className="h-8 w-8 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-xs font-bold leading-snug text-foreground">
          {clip.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
          {clip.explanation}
        </p>
        <div className="flex items-center justify-between pt-0.5">
          <span className="truncate text-xs text-muted-foreground/60">
            {clip.sourceLabel}
          </span>
          {clip.sourceUrl !== "#" && (
            <Button variant="ghost" size="sm" asChild className="ml-2 h-6 shrink-0 px-2">
              <a
                href={clip.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs"
              >
                Source <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Video Grid ────────────────────────────────────────────────────────────────

function VideoGrid({
  clips,
  initialCount = 3,
}: {
  clips: VideoClip[]
  initialCount?: number
}) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? clips : clips.slice(0, initialCount)
  const remaining = clips.length - initialCount

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {displayed.map((clip) => (
          <VideoCard key={clip.id} clip={clip} />
        ))}
      </div>
      <div className="flex justify-center gap-2 pt-1">
        {!showAll && remaining > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="gap-1.5"
          >
            See {remaining} More <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="gap-1.5"
          >
            Hide Videos <ChevronDown className="h-3.5 w-3.5 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: CatastrophicEvent }) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm sm:flex-row">
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-44">
        <img
          src={event.imageUrl}
          alt={event.imageAlt}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = "none"
            const parent = target.parentElement
            if (parent) {
              parent.classList.add(
                "flex",
                "items-center",
                "justify-center",
                "bg-primary/10"
              )
              parent.innerHTML =
                '<span class="text-3xl font-bold text-primary/30">' +
                event.year +
                "</span>"
            }
          }}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">
            {event.title} ({event.year})
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>
        <div className="flex justify-end">
          <Button asChild size="sm">
            <a
              href={event.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              Learn More
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}

// ── Event List ────────────────────────────────────────────────────────────────

function EventList({
  events,
  initialCount = 3,
}: {
  events: CatastrophicEvent[]
  initialCount?: number
}) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? events : events.slice(0, initialCount)
  const remaining = events.length - initialCount

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {displayed.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="flex justify-center pt-1">
        {!showAll && remaining > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="gap-1.5"
          >
            See {remaining} More <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="gap-1.5"
          >
            Hide Incidents <ChevronDown className="h-3.5 w-3.5 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LibraryClientView() {
  return (
    <div className="min-h-screen bg-[#dde9f5] font-sans dark:bg-background">
      <main className="mx-auto h-full max-w-5xl space-y-14 p-6 pt-24">

        {/* Page header */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary dark:text-cyan-500">
            When things go wrong.
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Catastrophic Events Library
          </h1>
        </div>

        {/* Visualization clips */}
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary dark:text-cyan-500">
              See it to believe it.
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Dendrite Growth Visualizations
            </h2>
            <p className="text-sm text-muted-foreground">
              Real microscopy footage and simulations of lithium dendrite
              nucleation, growth, and suppression.
            </p>
          </div>
          <VideoGrid clips={visualizationClips} initialCount={4} />
        </section>

        {/* Accident clips */}
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary dark:text-cyan-500">
              Real-world consequences.
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Thermal Runaway & Battery Failures
            </h2>
            <p className="text-sm text-muted-foreground">
              Documented incidents, fire tests, and demonstrations of what
              happens when lithium batteries fail catastrophically.
            </p>
          </div>
          <VideoGrid clips={accidentClips} initialCount={4} />

        </section>

        {/* Notable incidents */}
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary dark:text-cyan-500">
              Historical record.
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Notable Incidents
            </h2>
          </div>
          <EventList events={events} initialCount={3} />
        </section>

      </main>
    </div>
  )
}
