/* eslint-disable @next/next/no-img-element */
"use client"

import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    learnMoreUrl: "https://francis-press.com/uploads/papers/IfWxKOnMTYTm9UM82RGD5ScuKIoF7phhslFNWMrn.pdf",
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
    learnMoreUrl: "https://www.energy-storage.news/investigation-confirms-cause-of-fire-at-teslas-victorian-big-battery-in-australia/",
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
    learnMoreUrl: "https://www.nhtsa.gov/press-releases/recall-all-chevy-bolt-vehicles-fire-risk",
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

function EventCard({ event }: { event: CatastrophicEvent }) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm sm:flex-row">
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-64">
        <img
          src={event.imageUrl}
          alt={event.imageAlt}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = "none"
            const parent = target.parentElement
            if (parent) {
              parent.classList.add("flex", "items-center", "justify-center", "bg-primary/10")
              parent.innerHTML =
                '<span class="text-4xl font-bold text-primary/30">' + event.year + "</span>"
            }
          }}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {event.title} ({event.year})
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>
        <div className="flex justify-end">
          <Button asChild>
            <a
              href={event.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              Learn More
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
        </div>
    </Card>
  )
}

export default function LibraryClientView() {
  return (
    <div className="min-h-screen bg-[#dde9f5] font-sans dark:bg-background">
      <main className="mx-auto h-full max-w-5xl space-y-6 p-6">
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary dark:text-cyan-500">
            When things go wrong.
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Catastrophic Events Library
          </h1>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  )
}