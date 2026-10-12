/**
 * Team data for the About page.
 *
 * Scroll to line 50 and edit (photos go in `public/team/`)
 * You can put `public/team/ming-tang.jpg` which are referenced as `/team/ming-tang.jpg`.
 * Portrait photos (4:5 or 3:4) look best
 * If you don't want a photo, you can leave `photo` out to show an initials monogram instead
 */

export interface TeamLink {
  kind: "email" | "website" | "scholar" | "linkedin" | "github"
  href: string
}

export interface TeamMember {
  name: string
  role: string
  contribution: string //a line to show what you did
  bio: string //longer bio that is shown when the card is opened
  photo?: string
  focus?: string[]
  links?: TeamLink[]
}

// Not shown on the About page for now (removed at the PI's request). Kept
// here so the profile can be restored by rendering it again in about.tsx.
export const principalInvestigator: TeamMember & {
  title: string
  statement: string
} = {
  name: "Ming Tang",
  title: "Associate Professor, Materials Science & NanoEngineering",
  role: "Principal Investigator",
  contribution: "Leads the Mesoscale Materials Science Group at Rice.",
  statement:
    "Our research studies materials phenomena at mesoscale, which bridge between atomistic building blocks and macroscopic properties.",
  bio: "Dr. Ming Tang leads the Mesoscale Materials Science Group at Rice University, which combines simulation, theory and experiment to understand how material structures evolve under electrochemical and thermal stimuli, with a focus on energy storage systems such as lithium rechargeable batteries. He earned his Ph.D. in Materials Science and Engineering from MIT and received a Department of Energy Early Career Award in 2018. His lattice kinetic Monte Carlo model is the foundation of this site's dendrite simulation.",
  photo: "/team/ming-tang.jpg",
  focus: ["Mesoscale modeling", "Lithium batteries", "Phase-field methods"],
  links: [
    { kind: "website", href: "https://tanggroup.rice.edu/" },
    {
      kind: "scholar",
      href: "https://scholar.google.com/citations?user=qqG9sh4AAAAJ",
    },
    { kind: "email", href: "mailto:mt20@rice.edu" },
  ],
}

export const team: TeamMember[] = [
  {
    name: "Joshua Ghattas",
    role: "Student Research Assistant",
    contribution:
      "Created much of the original design and architecture for the website.",
    bio: "I'm a student at the Spring Branch Academic Institute; I developed much of the original user interface, especially the sim page, and worked with Andrew to conceptualize and then realize the architecture behind the WASM/C++ integration. I am also the leading organizer on Github. In the future, I plan to study physics and pioneer modern quantum technology.",
    focus: [
      "Web design",
      "WASM integration",
      "Team coordination",
      "Systems engineering",
      "AI chatbot",
    ],
    links: [{ kind: "email", href: "mailto:joshua.ghattas@gmail.com" }],
  },
  {
    name: "Faye Tang",
    role: "Student Research Assistant",
    contribution:
      "Designed the site's overall design and structure, and extended the LKMC model.",
    bio: "I'm a student at Clements High School, class of 2027. I came up with the overall design and structure of Battery Dendrites, mapping out how each page would guide readers from battery basics through to the simulation. On the research side, I developed a more efficient version of the lab's lattice kinetic Monte Carlo (LKMC) model to realistically simulate dendrite formation, and I built the Homepage, Library, and References pages. I plan to study materials science and engineering, working closely with technology to advance sustainability.",
    focus: [
      "Site structure",
      "Web design",
      "Science communication",
      "Simulation",
      "Literature review",
    ],
    links: [{ kind: "email", href: "mailto:faye.tang.r@gmail.com" }],
  },
  {
    name: "Nelson Tang",
    role: "Student Research Assistant",
    contribution: "...",
    bio: ".....",
    focus: ["Education", "Detection methods"],
    links: [{ kind: "email", href: "johndoe@gmail.com" }],
  },
  {
    name: "Andrew Xu",
    role: "Student Research Assistant",
    contribution:
      "Ported the LKMC simulation to C++/WebAssembly and connected it to the website.",
    bio: "I ported the lab's Python LKMC simulation to C++/WebAssembly so it runs in the browser, connected it to the website, and debugged it across model versions 3 to 5.",
    focus: [
      "C++ / WebAssembly",
      "Simulation engine",
      "Debugging",
      "Team coordination",
    ],
  },
]