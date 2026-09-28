import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"


interface Reference {
  authors: string
  year: number
  title: string
  journal: string
  url: string
  summary: string
}

interface Technique {
  id: string
  number: number
  title: string
  category: "visualization" | "monitoring"
  description: string
  references: Reference[]
}

const techniques: Technique[] = [
  {
    id: "optical-microscopy",
    number: 1,
    title: "In Situ Optical Microscopy",
    category: "visualization",
    description:
      "Transparent-window battery cells let researchers watch dendrites grow and dissolve in real time under a light microscope, tracking growth rate and shape as charging conditions change. It's the most accessible of these techniques, though anything smaller than the microscope's resolution stays invisible.",
    references: [
      {
        authors: "Steiger, J., Kramer, D., & Mönig, R.",
        year: 2014,
        title:
          "Mechanisms of dendritic growth investigated by in situ light microscopy during electrodeposition and dissolution of lithium",
        journal: "Journal of Power Sources, 261, 112–119",
        url: "https://doi.org/10.1016/j.jpowsour.2014.03.029",
        summary:
          "Uses live light microscopy to work out the mechanics behind dendrite growth during plating and stripping.",
      },
      {
        authors: "Wood, K. N., et al.",
        year: 2016,
        title:
          "Dendrites and Pits: Untangling the Complex Behavior of Lithium Metal Anodes through Operando Video Microscopy",
        journal: "ACS Central Science, 2, 790–801",
        url: "https://doi.org/10.1021/acscentsci.6b00260",
        summary:
          "Operando video microscopy separates dendrite growth from pitting as two distinct failure behaviors on lithium metal anodes.",
      },
      {
        authors: "Becherer, J., Kramer, D., & Mönig, R.",
        year: 2022,
        title:
          "The growth mechanism of lithium dendrites and its coupling to mechanical stress",
        journal: "Journal of Materials Chemistry A, 10, 5530–5539",
        url: "https://doi.org/10.1039/D1TA10920K",
        summary:
          "Links dendrite growth mechanics to the mechanical stress they generate as they push through the cell.",
      },
      {
        authors: "Sun, M., et al.",
        year: 2021,
        title:
          "Visualizing Lithium Dendrite Formation within Solid-State Electrolytes",
        journal: "ACS Energy Letters",
        url: "https://doi.org/10.1021/acsenergylett.0c02314",
        summary:
          "Direct visualization of how dendrites nucleate and spread inside solid-state (not liquid) electrolytes.",
      },
    ],
  },
  {
    id: "sem",
    number: 2,
    title: "Scanning Electron Microscopy (SEM)",
    category: "visualization",
    description:
      "A focused electron beam images lithium deposits at far higher magnification than optical microscopy, distinguishing needle-like dendrites from mossy or dense lithium. In situ SEM setups can capture this surface detail as it develops mid-cycle.",
    references: [
      {
        authors: "Rong, G., et al.",
        year: 2017,
        title:
          "Liquid-Phase Electrochemical Scanning Electron Microscopy for In Situ Investigation of Lithium Dendrite Growth and Dissolution",
        journal: "Advanced Materials",
        url: "https://doi.org/10.1002/adma.201606187",
        summary:
          "Introduces a liquid-phase SEM setup for watching dendrite growth and dissolution as it happens.",
      },
      {
        authors: "Golozar, M., et al.",
        year: 2018,
        title:
          "In Situ Scanning Electron Microscopy Detection of Carbide Nature of Dendrites in Li–Polymer Batteries",
        journal: "Nano Letters, 18, 7583–7589",
        url: "https://doi.org/10.1021/acs.nanolett.8b03148",
        summary:
          "In situ SEM reveals that dendrites in lithium-polymer cells are carbide in composition, not pure metal.",
      },
      {
        authors: "Golozar, M., et al.",
        year: 2020,
        title:
          "Direct observation of lithium metal dendrites with ceramic solid electrolyte",
        journal: "Scientific Reports, 10, 18410",
        url: "https://doi.org/10.1038/s41598-020-75456-0",
        summary:
          "Direct SEM imaging of how lithium dendrites behave when paired with a ceramic solid electrolyte.",
      },
      {
        authors: "—",
        year: 2019,
        title:
          "In situ observation of solid electrolyte interphase evolution in a lithium metal battery",
        journal: "Communications Chemistry, 2, 131",
        url: "https://doi.org/10.1038/s42004-019-0234-0",
        summary:
          "Tracks how the SEI layer itself evolves over cycling, ahead of and alongside dendrite formation.",
      },
    ],
  },
  {
    id: "tem",
    number: 3,
    title: "In Situ Transmission Electron Microscopy (TEM)",
    category: "visualization",
    description:
      "TEM fires electrons through an ultra-thin sample to resolve structures at the nanometer scale. Specialized in situ cells let researchers watch individual lithium atoms cluster into the earliest filaments, showing exactly where and how a dendrite gets its start.",
    references: [
      {
        authors: "—",
        year: 2014,
        title:
          "Visualization of Electrode–Electrolyte Interfaces in LiPF₆/EC/DEC Electrolyte for Lithium Ion Batteries via in Situ TEM",
        journal: "Nano Letters, 14, 1745–1750",
        url: "https://doi.org/10.1021/nl403922u",
        summary:
          "In situ TEM images the electrode–electrolyte interface directly in a standard carbonate electrolyte.",
      },
      {
        authors: "Sacci, R. L., et al.",
        year: 2015,
        title:
          "Nanoscale Imaging of Fundamental Li Battery Chemistry: Solid-Electrolyte Interphase Formation and Preferential Growth of Lithium Metal Nanoclusters",
        journal: "Nano Letters, 15, 2011–2018",
        url: "https://doi.org/10.1021/nl5048626",
        summary:
          "Nanoscale imaging of SEI formation alongside the earliest lithium nanoclusters that seed dendrite growth.",
      },
      {
        authors: "Kushima, A., et al.",
        year: 2017,
        title:
          "Liquid cell transmission electron microscopy observation of lithium metal growth and dissolution: Root growth, dead lithium and lithium flotsams",
        journal: "Nano Energy, 32, 271–279",
        url: "https://doi.org/10.1016/j.nanoen.2016.12.001",
        summary:
          "Liquid-cell TEM captures root-style growth and how detached fragments become electrochemically \"dead\" lithium.",
      },
      {
        authors: "—",
        year: 2021,
        title:
          "In Situ Visualization of Lithium Penetration through Solid Electrolyte and Dead Lithium Dynamics in Solid-State Lithium Metal Batteries",
        journal: "ACS Nano",
        url: "https://doi.org/10.1021/acsnano.1c04864",
        summary:
          "Watches lithium physically penetrate a solid electrolyte and tracks dead-lithium buildup in solid-state cells.",
      },
    ],
  },
  {
    id: "cryo-em",
    number: 4,
    title: "Cryogenic Electron Microscopy (Cryo-EM)",
    category: "visualization",
    description:
      "Lithium is reactive enough that ordinary electron microscopy can damage it before it's ever imaged. Cryo-EM freezes samples first, preserving delicate dendrite structures well enough to resolve their atomic arrangement and the thin protective layer around them.",
    references: [
      {
        authors: "Li, Y., et al.",
        year: 2017,
        title:
          "Atomic structure of sensitive battery materials and interfaces revealed by cryo-electron microscopy",
        journal: "Science, 358, 506–510",
        url: "https://doi.org/10.1126/science.aam6014",
        summary:
          "One of the first demonstrations of cryo-EM resolving battery interfaces at atomic resolution without beam damage.",
      },
      {
        authors: "Wang, X., et al.",
        year: 2017,
        title:
          "New Insights on the Structure of Electrochemically Deposited Lithium Metal and Its Solid Electrolyte Interphases via Cryogenic TEM",
        journal: "Nano Letters",
        url: "https://doi.org/10.1021/acs.nanolett.7b03606",
        summary:
          "Cryogenic TEM reveals structural detail in deposited lithium metal and its SEI that room-temperature imaging misses.",
      },
      {
        authors: "Zachman, M. J., et al.",
        year: 2018,
        title:
          "Cryo-STEM mapping of solid–liquid interfaces and dendrites in lithium-metal batteries",
        journal: "Nature, 560, 345–349",
        url: "https://doi.org/10.1038/s41586-018-0397-3",
        summary:
          "Maps the solid–liquid interface and dendrite structure together using cryo scanning-TEM.",
      },
    ],
  },
  {
    id: "xray",
    number: 5,
    title: "X-ray Imaging and Tomography",
    category: "visualization",
    description:
      "X-rays can see dendrites inside a sealed battery without cutting it open, and imaging from multiple angles reconstructs a full 3D picture of where they've grown. Synchrotron phase-contrast techniques push this further, sharpening visibility of lithium's naturally low density.",
    references: [
      {
        authors: "Harry, K. J., et al.",
        year: 2014,
        title:
          "Detection of subsurface structures underneath dendrites formed on cycled lithium metal electrodes",
        journal: "Nature Materials, 13, 69–73",
        url: "https://doi.org/10.1038/nmat3793",
        summary:
          "Finds that dendrites are seeded by subsurface structures invisible from the electrode surface alone.",
      },
      {
        authors: "—",
        year: 2016,
        title:
          "Morphological Evolution of Electrochemically Plated/Stripped Lithium Microstructures Investigated by Synchrotron X-ray Phase Contrast Tomography",
        journal: "ACS Nano, 10, 7990–7997",
        url: "https://doi.org/10.1021/acsnano.6b03939",
        summary:
          "Synchrotron tomography tracks how plated lithium's 3D shape evolves across repeated plate/strip cycles.",
      },
      {
        authors: "Yu, S.-H., Huang, X., Brock, J. D., & Abruña, H. D.",
        year: 2019,
        title:
          "Regulating Key Variables and Visualizing Lithium Dendrite Growth: An Operando X-ray Study",
        journal: "Journal of the American Chemical Society, 141, 8441–8449",
        url: "https://doi.org/10.1021/jacs.8b13297",
        summary:
          "Operando X-ray imaging connects specific cycling variables to how aggressively dendrites grow.",
      },
      {
        authors:
          "Savsatli, Y., Wang, F., Guo, H., Li, Z., Hitt, A., Zhan, H., Ge, M., Xiao, X., Lee, W.-K., Agarwal, H., Stephens, R. M., & Tang, M.",
        year: 2024,
        title:
          "In Situ and Operando Observation of Zinc Moss Growth and Dissolution in Alkaline Electrolyte for Zinc–Air Batteries",
        journal: "ACS Energy Letters, 9, 3516",
        url: "https://doi.org/10.1021/acsenergylett.4c01011",
        summary:
          "Extends operando X-ray imaging to zinc \"moss\" growth, the zinc-air battery analog of lithium dendrites.",
      },
    ],
  },
  {
    id: "neutron",
    number: 6,
    title: "Neutron Imaging",
    category: "visualization",
    description:
      "Neutrons interact with materials differently than X-rays do, and are especially sensitive to lithium — which makes neutron imaging useful for tracking how lithium redistributes inside a cell and correlating that with dendrite growth and internal shorting.",
    references: [
      {
        authors: "Song, B., et al.",
        year: 2019,
        title:
          "Dynamic Lithium Distribution upon Dendrite Growth and Shorting Revealed by Operando Neutron Imaging",
        journal: "ACS Energy Letters, 4, 2402–2408",
        url: "https://doi.org/10.1021/acsenergylett.9b01652",
        summary:
          "Operando neutron imaging follows lithium redistributing in real time as a dendrite grows toward a short.",
      },
      {
        authors: "—",
        year: 2026,
        title:
          "Towards understanding electrolyte-dependent dynamics and kinetics of lithium deposition and stripping by operando neutron imaging",
        journal: "Energy Storage Materials, 84, 104817",
        url: "https://doi.org/10.1016/j.ensm.2025.104817",
        summary:
          "Compares how different electrolytes change the kinetics of lithium deposition, as seen through neutron imaging.",
      },
    ],
  },
  {
    id: "afm",
    number: 7,
    title: "Atomic Force Microscopy (AFM)",
    category: "visualization",
    description:
      "AFM scans a surface with an ultra-sharp probe to build a detailed topographic map, and — unlike electron microscopy — it can operate directly in liquid electrolyte. That makes it well suited to watching early-stage lithium deposition and measuring the mechanical properties of the layer around it.",
    references: [
      {
        authors: "Kitta, M., et al.",
        year: 2017,
        title:
          "Real-Time Observation of Li Deposition on a Li Electrode with Operando Atomic Force Microscopy and Surface Mechanical Imaging",
        journal: "Langmuir, 33, 1861–1866",
        url: "https://doi.org/10.1021/acs.langmuir.6b04651",
        summary:
          "Combines operando AFM with surface mechanical imaging to watch lithium deposit on an electrode in real time.",
      },
      {
        authors: "Shen, C., et al.",
        year: 2018,
        title:
          "Direct Observation of the Growth of Lithium Dendrites on Graphite Anodes by Operando EC-AFM",
        journal: "Small Methods, 2, 1700298",
        url: "https://doi.org/10.1002/smtd.201700298",
        summary:
          "Uses electrochemical AFM to directly observe dendrite growth on a graphite anode as it happens.",
      },
    ],
  },
  {
    id: "eis",
    number: 8,
    title: "Electrochemical Impedance Spectroscopy (EIS)",
    category: "monitoring",
    description:
      "EIS probes a battery with small electrical signals across a range of frequencies. As lithium deposits build up, they change surface area, interfacial resistance, and ion transport — shifts that EIS can detect without ever opening the cell, making it a practical early-warning signal.",
    references: [
      {
        authors: "Talian, S. D., Kapun, G., Moškon, J., Dominko, R., & Gaberšček, M.",
        year: 2025,
        title:
          "Operando impedance spectroscopy with combined dynamic measurements and overvoltage analysis in lithium metal batteries",
        journal: "Nature Communications, 16, 2030",
        url: "https://doi.org/10.1038/s41467-025-57256-0",
        summary:
          "Pairs operando EIS with overvoltage analysis for a more complete real-time read on lithium metal cell health.",
      },
      {
        authors: "—",
        year: 2026,
        title:
          "Quantitative Diagnosis of Li Plating Morphology by Analyzing Response of Electrochemical Impedance Spectroscopy in Working Li Batteries",
        journal: "Journal of the American Chemical Society",
        url: "https://doi.org/10.1021/jacs.5c23170",
        summary:
          "Shows how the shape of an EIS response can be read to diagnose the morphology of lithium plating.",
      },
    ],
  },
  {
    id: "ultrasonic",
    number: 9,
    title: "Ultrasonic Imaging",
    category: "monitoring",
    description:
      "Ultrasonic imaging sends high-frequency sound into a battery and reads how it travels through the internal layers. Abnormal lithium plating changes those returning sound waves, letting researchers map plating activity without cutting the cell open — a technique with real potential for in-field battery monitoring.",
    references: [
      {
        authors: "—",
        year: 2023,
        title:
          "In situ tomography of lithium-ion battery cells enabled by scanning acoustic imaging",
        journal: "Journal of Power Sources, 580, 233295",
        url: "https://doi.org/10.1016/j.jpowsour.2023.233295",
        summary:
          "Builds a 3D internal picture of a working lithium-ion cell using scanning acoustic imaging alone.",
      },
      {
        authors: "Wang, Y., Li, Z., Li, X., Ma, Z., & Li, L.",
        year: 2024,
        title:
          "Catalyzing Battery Materials Research via Lab-Made, Sub-Ampere-Hour-Scale Pouch Cells, and Long-Term Electrochemical Monitoring by a Reparable Reference Electrode",
        journal: "Advanced Energy Materials, 14, 2304512",
        url: "https://doi.org/10.1002/aenm.202304512",
        summary:
          "Introduces lab-scale pouch cells with a repairable reference electrode for long-term monitoring setups.",
      },
      {
        authors: "Wasylowski, D., et al.",
        year: 2024,
        title:
          "Operando visualisation of lithium plating by ultrasound imaging of battery cells",
        journal: "Nature Communications, 15, 10237",
        url: "https://doi.org/10.1038/s41467-024-54319-6",
        summary:
          "Directly visualizes lithium plating in an operating cell using ultrasound alone, no disassembly required.",
      },
    ],
  },
]

const categories = [
  {
    id: "visualization",
    eyebrow: "Category A",
    title: "Direct Visualization & Imaging",
    description:
      "Techniques that let researchers actually see a dendrite — from live video of a growing filament to atomic-scale maps of its structure.",
  },
  {
    id: "monitoring",
    eyebrow: "Category B",
    title: "Indirect Detection & Monitoring",
    description:
      "Techniques that infer dendrite growth from the electrical, acoustic, or thermal signals a battery gives off, without ever imaging the dendrite directly.",
  },
] as const


function ReferenceRow({ reference }: { reference: Reference }) {
  return (
    <li className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground/90">
          {reference.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {reference.authors} — {reference.journal} ({reference.year})
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground/90">
          {reference.summary}
        </p>
      </div>
      <Button variant="ghost" size="sm" asChild className="h-7 shrink-0 px-2">
        <a
          href={reference.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs"
        >
          View <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </li>
  )
}

function TechniqueBlock({ technique }: { technique: Technique }) {
  return (
    <div id={technique.id} className="scroll-mt-24 space-y-3">
      <h3 className="text-lg font-bold text-foreground">
        {technique.number}. {technique.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {technique.description}
      </p>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card/50">
        {technique.references.map((ref) => (
          <ReferenceRow key={ref.url} reference={ref} />
        ))}
      </ul>
    </div>
  )
}

function TableOfContents() {
  return (
    <Card className="rounded-2xl border border-primary/20 bg-blue-50 p-6 shadow-sm dark:border-cyan-900/60 dark:bg-blue-950/40">
      <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
        Jump to
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
        {techniques.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="text-sm text-foreground/80 underline-offset-4 hover:text-primary hover:underline dark:hover:text-cyan-500"
          >
            {t.number}. {t.title}
          </a>
        ))}
      </div>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReferencesClientView() {
  return (
    <div className="min-h-screen bg-[#dde9f5] font-sans dark:bg-background">
      <main className="mx-auto h-full max-w-5xl space-y-14 p-6 pt-24">
        {/* Page header */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary dark:text-cyan-500">
            Primary sources.
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            References
          </h1>
          <p className="max-w-2xl pt-2 text-sm leading-relaxed text-muted-foreground">
            A collection of literature to show how researchers and scientists actually see, measure, and detech lithium dendrites, organized by technique.
          </p>
        </div>

        <TableOfContents />

        {categories.map((category) => (
          <section key={category.id} className="space-y-1">
            <Card className="space-y-10 rounded-2xl p-8 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
                  {category.eyebrow}
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  {category.title}
                </h2>
                <p className="max-w-2xl pt-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <div className="space-y-10">
                {techniques
                  .filter((t) => t.category === category.id)
                  .map((t) => (
                    <TechniqueBlock key={t.id} technique={t} />
                  ))}
              </div>
            </Card>
          </section>
        ))}
      </main>
    </div>
  )
}
