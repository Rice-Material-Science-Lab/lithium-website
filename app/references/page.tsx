"use client"

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Search,
  SearchX,
  X,
} from "lucide-react"


interface Reference {
  authors: string
  year: number
  title: string
  journal: string
  url: string
  summary: string
}

type CategoryId = "visualization" | "monitoring" | "foundations"

interface Technique {
  id: string
  title: string
  category: CategoryId
  description: string
  references: Reference[]
}


const techniques: Technique[] = [
  {
    id: "optical-microscopy",
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
        authors: "Bai, P., Li, J., Brushett, F. R., & Bazant, M. Z.",
        year: 2016,
        title: "Transition of lithium growth mechanisms in liquid electrolytes",
        journal: "Energy & Environmental Science, 9, 3221–3229",
        url: "https://doi.org/10.1039/C6EE01674J",
        summary:
          "Shows lithium switches from slow, mossy growth to fast, tip-driven dendrites once the electrolyte near the electrode runs out of ions — a key reason fast charging is risky.",
      },
      {
        authors: "Porz, L., et al.",
        year: 2017,
        title:
          "Mechanism of Lithium Metal Penetration through Inorganic Solid Electrolytes",
        journal: "Advanced Energy Materials, 7, 1701003",
        url: "https://doi.org/10.1002/aenm.201701003",
        summary:
          "Watches lithium force its way through cracks and flaws in ceramic electrolytes, challenging the idea that a stiff solid electrolyte alone can stop dendrites.",
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
        authors: "Golozar, M., Paolella, A., Demers, H., et al.",
        year: 2019,
        title:
          "In situ observation of solid electrolyte interphase evolution in a lithium metal battery",
        journal: "Communications Chemistry, 2, 131",
        url: "https://doi.org/10.1038/s42004-019-0234-0",
        summary:
          "Tracks how the SEI layer itself evolves over cycling, ahead of and alongside dendrite formation.",
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
    ],
  },
  {
    id: "tem",
    title: "In Situ Transmission Electron Microscopy (TEM)",
    category: "visualization",
    description:
      "TEM fires electrons through an ultra-thin sample to resolve structures at the nanometer scale. Specialized in situ cells let researchers watch individual lithium atoms cluster into the earliest filaments, showing exactly where and how a dendrite gets its start.",
    references: [
      {
        authors: "",
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
        authors: "Sun, H., Liu, Q., Chen, J., et al.",
        year: 2021,
        title:
          "In Situ Visualization of Lithium Penetration through Solid Electrolyte and Dead Lithium Dynamics in Solid-State Lithium Metal Batteries",
        journal: "ACS Nano, 15, 19070–19079",
        url: "https://doi.org/10.1021/acsnano.1c04864",
        summary:
          "Watches lithium physically penetrate a solid electrolyte and tracks dead-lithium buildup in solid-state cells.",
      },
    ],
  },
  {
    id: "cryo-em",
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
        authors: "",
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
    title: "Neutron Imaging & Depth Profiling",
    category: "visualization",
    description:
      "Neutrons interact with materials differently than X-rays do, and are especially sensitive to lithium — which makes neutron imaging useful for tracking how lithium redistributes inside a cell and correlating that with dendrite growth and internal shorting.",
    references: [
      {
        authors: "Han, F., et al.",
        year: 2019,
        title:
          "High electronic conductivity as the origin of lithium dendrite formation within solid electrolytes",
        journal: "Nature Energy, 4, 187–196",
        url: "https://doi.org/10.1038/s41560-018-0312-z",
        summary:
          "Uses time-resolved neutron depth profiling to show dendrites can form inside a solid electrolyte, not just grow into it from the anode.",
      },
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
        authors: "Winter, E., Carreon Ruiz, E. R., Kondracki, Ł., et al.",
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
    id: "nmr-mri",
    title: "NMR Spectroscopy & MRI",
    category: "visualization",
    description:
      "Metallic lithium gives off a magnetic-resonance signal that's clearly distinct from the lithium stored safely in electrode materials. That lets NMR measure how much dendritic lithium is present, and MRI map where it sits inside a working cell — all without opening it.",
    references: [
      {
        authors: "Bhattacharyya, R., et al.",
        year: 2010,
        title:
          "In situ NMR observation of the formation of metallic lithium microstructures in lithium batteries",
        journal: "Nature Materials, 9, 504–510",
        url: "https://doi.org/10.1038/nmat2764",
        summary:
          "A landmark study that uses in situ ⁷Li NMR to count how much mossy and dendritic lithium builds up as a cell cycles.",
      },
      {
        authors: "Chandrashekar, S., et al.",
        year: 2012,
        title:
          "⁷Li MRI of Li batteries reveals location of microstructural lithium",
        journal: "Nature Materials, 11, 311–315",
        url: "https://doi.org/10.1038/nmat3246",
        summary:
          "Uses magnetic resonance imaging to map exactly where dendrites form inside a cell, turning a bulk signal into a picture.",
      },
    ],
  },
  {
    id: "eis",
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
        authors: "",
        year: 2026,
        title:
          "Quantitative Diagnosis of Li Plating Morphology by Analyzing Response of Electrochemical Impedance Spectroscopy in Working Li Batteries",
        journal: "Journal of the American Chemical Society, 148, 15949",
        url: "https://doi.org/10.1021/jacs.5c23170",
        summary:
          "Shows how the shape of an EIS response can be read to diagnose the morphology of lithium plating.",
      },
    ],
  },
  {
    id: "voltage-analysis",
    title: "Voltage Relaxation Analysis",
    category: "monitoring",
    description:
      "When a cell rests after charging, plated lithium partly dissolves back into the electrode — and that leaves a small plateau in the voltage curve. Reading those subtle bumps is one of the cheapest ways to catch plating in a commercial cell, using nothing but the charger's own measurements.",
    references: [
      {
        authors: "Petzl, M., & Danzer, M. A.",
        year: 2014,
        title:
          "Nondestructive detection, characterization, and quantification of lithium plating in commercial lithium-ion batteries",
        journal: "Journal of Power Sources, 254, 80–87",
        url: "https://doi.org/10.1016/j.jpowsour.2013.12.060",
        summary:
          "Shows that the voltage plateau during discharge after low-temperature charging reveals — and roughly quantifies — plated lithium.",
      },
    ],
  },
  {
    id: "ultrasonic",
    title: "Ultrasonic & Acoustic Imaging",
    category: "monitoring",
    description:
      "Ultrasonic imaging sends high-frequency sound into a battery and reads how it travels through the internal layers. Abnormal lithium plating changes those returning sound waves, letting researchers map plating activity without cutting the cell open — a technique with real potential for in-field battery monitoring.",
    references: [
      {
        authors: "Hsieh, A. G., et al.",
        year: 2015,
        title:
          "Electrochemical-acoustic time of flight: in operando correlation of physical dynamics with battery charge and health",
        journal: "Energy & Environmental Science, 8, 1569–1577",
        url: "https://doi.org/10.1039/C5EE00111K",
        summary:
          "The foundational paper showing that sound waves passing through a cell shift in step with its charge and health.",
      },
      {
        authors: "Bommier, C., et al.",
        year: 2020,
        title:
          "In Operando Acoustic Detection of Lithium Metal Plating in Commercial LiCoO₂/Graphite Pouch Cells",
        journal: "Cell Reports Physical Science, 1, 100035",
        url: "https://doi.org/10.1016/j.xcrp.2020.100035",
        summary:
          "Uses acoustic signals to catch lithium plating in off-the-shelf pouch cells during fast charging.",
      },
      {
        authors: "Wasylowski, D., Neubauer, S., Faber, M., et al.",
        year: 2023,
        title:
          "In situ tomography of lithium-ion battery cells enabled by scanning acoustic imaging",
        journal: "Journal of Power Sources, 580, 233295",
        url: "https://doi.org/10.1016/j.jpowsour.2023.233295",
        summary:
          "Builds a 3D internal picture of a working lithium-ion cell using scanning acoustic imaging alone.",
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
    ],
  },
  {
    id: "embedded-sensors",
    title: "Thickness & Embedded Sensors",
    category: "monitoring",
    description:
      "Plated lithium takes up space and releases heat. Precise thickness gauges can pick up the tiny swelling it causes, and optical fibers built into a cell can read temperature and pressure from the inside — signals a battery management system could one day act on.",
    references: [
      {
        authors: "Bitzer, B., & Gruhle, A.",
        year: 2014,
        title:
          "A new method for detecting lithium plating by measuring the cell thickness",
        journal: "Journal of Power Sources, 262, 297–302",
        url: "https://doi.org/10.1016/j.jpowsour.2014.03.142",
        summary:
          "Shows that plated lithium makes a cell measurably thicker, giving a simple mechanical warning sign.",
      },
      {
        authors: "Huang, J., et al.",
        year: 2020,
        title:
          "Operando decoding of chemical and thermal events in commercial Na(Li)-ion cells via optical sensors",
        journal: "Nature Energy, 5, 674–683",
        url: "https://doi.org/10.1038/s41560-020-0665-y",
        summary:
          "Embeds fiber-optic sensors inside commercial cells to track heat and chemical events as they happen.",
      },
    ],
  },
  {
    id: "titration",
    title: "Titration Gas Chromatography",
    category: "monitoring",
    description:
      "Not all lost capacity is the same. By reacting a cycled cell's contents with water and measuring the hydrogen released, researchers can separate isolated \"dead\" metallic lithium from lithium trapped in the SEI — the clearest accounting of where a battery's lithium actually went.",
    references: [
      {
        authors: "Fang, C., et al.",
        year: 2019,
        title: "Quantifying inactive lithium in lithium metal batteries",
        journal: "Nature, 572, 511–515",
        url: "https://doi.org/10.1038/s41586-019-1481-z",
        summary:
          "Finds that stranded metallic lithium, not SEI growth, is the main cause of capacity loss in lithium metal cells.",
      },
    ],
  },
  {
    id: "theory",
    title: "Foundational Theory",
    category: "foundations",
    description:
      "Before anyone could film a dendrite at the atomic scale, theory set the terms of the problem: how stiff does a barrier have to be to physically stop lithium from pushing through?",
    references: [
      {
        authors: "Monroe, C., & Newman, J.",
        year: 2005,
        title:
          "The Impact of Elastic Deformation on Deposition Kinetics at Lithium/Polymer Interfaces",
        journal: "Journal of The Electrochemical Society, 152, A396–A404",
        url: "https://doi.org/10.1149/1.1850854",
        summary:
          "The classic stiffness criterion: an electrolyte roughly twice as stiff as lithium should suppress dendrites. Much of the solid-state battery field grew from it.",
      },
    ],
  },
  {
    id: "reviews",
    title: "Review Articles",
    category: "foundations",
    description:
      "The best places to start. Each of these pulls together hundreds of studies on why dendrites form, how they cause failures, and what's being done about it.",
    references: [
      {
        authors: "Lin, D., Liu, Y., & Cui, Y.",
        year: 2017,
        title: "Reviving the lithium metal anode for high-energy batteries",
        journal: "Nature Nanotechnology, 12, 194–206",
        url: "https://doi.org/10.1038/nnano.2017.16",
        summary:
          "A widely cited overview of why lithium metal anodes fail and the main strategies for taming dendrites.",
      },
      {
        authors: "Cheng, X.-B., Zhang, R., Zhao, C.-Z., & Zhang, Q.",
        year: 2017,
        title:
          "Toward Safe Lithium Metal Anode in Rechargeable Batteries: A Review",
        journal: "Chemical Reviews, 117, 10403–10473",
        url: "https://doi.org/10.1021/acs.chemrev.7b00115",
        summary:
          "A deep, safety-focused review covering dendrite nucleation models, growth, and protection strategies.",
      },
      {
        authors: "Waldmann, T., et al.",
        year: 2018,
        title:
          "Review—Li plating as unwanted side reaction in commercial Li-ion cells – A review",
        journal: "Journal of Power Sources, 384, 107–124",
        url: "https://doi.org/10.1016/j.jpowsour.2018.02.063",
        summary:
          "Focuses on everyday lithium-ion cells: when plating happens (cold, fast charging, overcharge) and how to detect it.",
      },
      {
        authors: "Feng, X., et al.",
        year: 2018,
        title:
          "Thermal runaway mechanism of lithium ion battery for electric vehicles: A review",
        journal: "Energy Storage Materials, 10, 246–267",
        url: "https://doi.org/10.1016/j.ensm.2017.05.013",
        summary:
          "Traces how internal shorts — including those caused by dendrites — escalate into thermal runaway and fire.",
      },
    ],
  },
]

const categories: {
  id: CategoryId
  eyebrow: string
  title: string
  description: string
}[] = [
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
      "Techniques that infer dendrite growth from the electrical, acoustic, mechanical, or chemical signals a battery gives off, without imaging the dendrite directly.",
  },
  {
    id: "foundations",
    eyebrow: "Category C",
    title: "Foundations & Reviews",
    description:
      "The theory that framed the dendrite problem, and the review articles that best summarize the field.",
  },
]

const techniqueNumber = new Map(techniques.map((t, i) => [t.id, i + 1]))

const allRefs = techniques.flatMap((t) => t.references)
const stats = {
  papers: allRefs.length,
  techniques: techniques.length,
  from: Math.min(...allRefs.map((r) => r.year)),
  to: Math.max(...allRefs.map((r) => r.year)),
}


const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

const tokenize = (q: string) => normalize(q).split(/\s+/).filter(Boolean)

function matches(ref: Reference, technique: Technique, tokens: string[]) {
  if (tokens.length === 0) return true
  const hay = normalize(
    [ref.title, ref.authors, ref.journal, ref.summary, ref.year, technique.title].join(" ")
  )
  return tokens.every((t) => hay.includes(t))
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>
  const folded = normalize(text)
  const ranges: [number, number][] = []
  for (const tok of tokens) {
    let i = folded.indexOf(tok)
    while (i !== -1) {
      ranges.push([i, i + tok.length])
      i = folded.indexOf(tok, i + tok.length)
    }
  }
  if (ranges.length === 0) return <>{text}</>
  ranges.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([...r])
  }
  const out: ReactNode[] = []
  let cursor = 0
  merged.forEach(([s, e], i) => {
    if (s > cursor) out.push(text.slice(cursor, s))
    out.push(
      <mark
        key={i}
        className="rounded-[3px] bg-amber-200/70 px-0.5 text-inherit dark:bg-cyan-400/25"
      >
        {text.slice(s, e)}
      </mark>
    )
    cursor = e
  })
  if (cursor < text.length) out.push(text.slice(cursor))
  return <>{out}</>
}


function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase dark:text-cyan-400">
      <span aria-hidden className="h-px w-6 bg-current opacity-50" />
      {children}
    </p>
  )
}

function CopyCitation({ reference }: { reference: Reference }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    const citation = [
      reference.authors ? `${reference.authors} (${reference.year}).` : `(${reference.year}).`,
      `${reference.title}.`,
      `${reference.journal}.`,
      reference.url,
    ].join(" ")
    try {
      await navigator.clipboard.writeText(citation)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy citation"
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Cite"}
    </button>
  )
}

function ReferenceCard({
  reference,
  tokens,
}: {
  reference: Reference
  tokens: string[]
}) {
  return (
    <li className="group relative rounded-xl border border-border/70 bg-background/60 p-5 transition-all duration-300 hover:-translate-y-px hover:border-primary/30 hover:bg-background hover:shadow-[0_12px_32px_-18px_rgb(0_0_0/0.35)] dark:bg-white/[0.02] dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.04]">
      <div className="flex gap-4">
        <span className="mt-0.5 shrink-0 font-mono text-xs font-medium tabular-nums text-primary/80 dark:text-cyan-400/80">
          {reference.year}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[15px] leading-snug font-semibold text-pretty text-foreground decoration-primary/40 underline-offset-4 hover:underline dark:decoration-cyan-400/40"
          >
            <Highlight text={reference.title} tokens={tokens} />
          </a>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {reference.authors && (
              <>
                <Highlight text={reference.authors} tokens={tokens} />
                <span aria-hidden className="mx-1.5 opacity-40">
                  ·
                </span>
              </>
            )}
            <span className="italic">
              <Highlight text={reference.journal} tokens={tokens} />
            </span>
          </p>
          <p className="text-sm leading-relaxed text-foreground/75">
            <Highlight text={reference.summary} tokens={tokens} />
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-600 dark:hover:text-white"
            >
              Read paper <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <CopyCitation reference={reference} />
            <span className="ml-auto hidden truncate font-mono text-[11px] text-muted-foreground/60 sm:block">
              {reference.url.replace("https://doi.org/", "doi:")}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

function TechniqueBlock({
  technique,
  refs,
  tokens,
}: {
  technique: Technique
  refs: Reference[]
  tokens: string[]
}) {
  const n = techniqueNumber.get(technique.id) ?? 0
  return (
    <article
      id={technique.id}
      data-technique
      className="scroll-mt-40 border-t border-border/60 pt-8 first:border-t-0 first:pt-0"
    >
      <header className="mb-5 flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 font-mono text-sm font-semibold text-primary dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-300">
          {String(n).padStart(2, "0")}
        </span>
        <div className="min-w-0 space-y-2">
          <h3 className="text-lg leading-tight font-semibold tracking-tight text-foreground sm:text-xl">
            <Highlight text={technique.title} tokens={tokens} />
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
            {technique.description}
          </p>
        </div>
      </header>
      <ul className="space-y-3 sm:pl-[3.25rem]">
        {refs.map((ref) => (
          <ReferenceCard key={ref.url} reference={ref} tokens={tokens} />
        ))}
      </ul>
    </article>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Filter = "all" | CategoryId

export default function ReferencesClientView() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [activeId, setActiveId] = useState<string>(techniques[0].id)
  const inputRef = useRef<HTMLInputElement>(null)

  const deferredQuery = useDeferredValue(query)
  const tokens = useMemo(() => tokenize(deferredQuery), [deferredQuery])

  const visible = useMemo(
    () =>
      techniques
        .filter((t) => filter === "all" || t.category === filter)
        .map((t) => ({
          technique: t,
          refs: t.references
            .filter((r) => matches(r, t, tokens))
            .sort((a, b) => a.year - b.year),
        }))
        .filter((x) => x.refs.length > 0),
    [tokens, filter]
  )
  const resultCount = visible.reduce((n, x) => n + x.refs.length, 0)
  const isFiltering = tokens.length > 0 || filter !== "all"

  const clear = useCallback(() => {
    setQuery("")
    setFilter("all")
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-technique]"))
    if (els.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActiveId(top.target.id)
      },
      { rootMargin: "-160px 0px -60% 0px" }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [visible])

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "visualization", label: "Imaging" },
    { id: "monitoring", label: "Monitoring" },
    { id: "foundations", label: "Foundations" },
  ]

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#dde9f5] font-sans dark:bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_255_255/0.7),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgb(34_211_238/0.08),transparent_70%)]"
      />

      <main className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
        <header className="max-w-3xl space-y-5">
          <Eyebrow>Primary sources</Eyebrow>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            References
          </h1>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            A collection of literature to show how researchers and scientists actually see, measure, and detech lithium dendrites, organized by technique.
          </p>
          <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-3">
            {[
              { label: "Papers", value: stats.papers },
              { label: "Techniques", value: stats.techniques },
              { label: "Years covered", value: `${stats.from}–${stats.to}` },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {s.label}
                </dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ── Sticky search ── */}
        <div className="sticky top-16 z-20 mt-12 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="rounded-2xl border border-border/80 bg-card/80 p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl dark:bg-card/70 dark:shadow-none">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <label className="relative flex flex-1 items-center">
                <span className="sr-only">Search references</span>
                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                  placeholder="Search titles, authors, journals, years…"
                  className="h-11 w-full rounded-xl bg-transparent pr-20 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/30 dark:focus-visible:ring-cyan-500/30 [&::-webkit-search-cancel-button]:hidden"
                />
                <span className="absolute right-3 flex items-center gap-1.5">
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                      /
                    </kbd>
                  )}
                </span>
              </label>
              <div
                role="tablist"
                aria-label="Filter by category"
                className="flex gap-1 overflow-x-auto rounded-xl bg-muted/60 p-1"
              >
                {filters.map((f) => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "h-9 shrink-0 rounded-lg px-3.5 text-xs font-medium transition-all",
                      filter === f.id
                        ? "bg-background text-foreground shadow-sm dark:bg-white/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <p aria-live="polite" className="px-3 pt-2 pb-1 text-xs text-muted-foreground">
              {isFiltering ? (
                <>
                  <span className="font-medium text-foreground">{resultCount}</span> of{" "}
                  {stats.papers} papers
                  {tokens.length > 0 && (
                    <>
                      {" "}matching “<span className="text-foreground">{deferredQuery.trim()}</span>”
                    </>
                  )}
                  <button
                    onClick={clear}
                    className="ml-2 font-medium text-primary hover:underline dark:text-cyan-400"
                  >
                    Reset
                  </button>
                </>
              ) : (
                <>Showing all {stats.papers} papers across {stats.techniques} techniques</>
              )}
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <nav aria-label="Techniques" className="hidden lg:block">
            <div className="sticky top-52 max-h-[calc(100vh-15rem)] space-y-6 overflow-y-auto pr-2">
              {categories.map((cat) => {
                const items = visible.filter((v) => v.technique.category === cat.id)
                if (items.length === 0) return null
                return (
                  <div key={cat.id}>
                    <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      {cat.title.split(" & ")[0]}
                    </p>
                    <ul className="space-y-0.5 border-l border-border">
                      {items.map(({ technique, refs }) => {
                        const active = activeId === technique.id
                        return (
                          <li key={technique.id}>
                            <a
                              href={`#${technique.id}`}
                              className={cn(
                                "-ml-px flex items-center justify-between gap-2 border-l py-1.5 pr-1 pl-3 text-[13px] leading-snug transition-colors",
                                active
                                  ? "border-primary font-medium text-foreground dark:border-cyan-400"
                                  : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                              )}
                            >
                              <span className="truncate">
                                {technique.title.replace(/\s*\(.*\)/, "")}
                              </span>
                              <span className="font-mono text-[10px] tabular-nums opacity-60">
                                {refs.length}
                              </span>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0 space-y-10">
            {visible.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
                <SearchX className="h-8 w-8 text-muted-foreground/60" />
                <p className="mt-4 font-semibold text-foreground">No papers match that search</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try an author&apos;s surname, a journal like “Nature”, a year, or a technique such as
                  “cryo” or “ultrasound”.
                </p>
                <button
                  onClick={clear}
                  className="mt-5 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 dark:bg-cyan-600"
                >
                  Clear search
                </button>
              </div>
            )}

            {categories.map((cat) => {
              const items = visible.filter((v) => v.technique.category === cat.id)
              if (items.length === 0) return null
              return (
                <section
                  key={cat.id}
                  aria-labelledby={`${cat.id}-title`}
                  className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(0_0_0/0.25)] sm:p-10 dark:shadow-none"
                >
                  <div className="mb-10 max-w-2xl space-y-3">
                    <Eyebrow>{cat.eyebrow}</Eyebrow>
                    <h2
                      id={`${cat.id}-title`}
                      className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                    >
                      {cat.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                  <div className="space-y-10">
                    {items.map(({ technique, refs }) => (
                      <TechniqueBlock
                        key={technique.id}
                        technique={technique}
                        refs={refs}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </section>
              )
            })}

            <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Links resolve through DOI to each publisher. Some papers sit behind a paywall; an
              open-access copy can often be found through a university library or the authors&apos;
              own pages.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}