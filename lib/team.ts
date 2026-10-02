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
    { kind: "scholar", href: "https://scholar.google.com/citations?user=qqG9sh4AAAAJ" },
    { kind: "email", href: "mailto:mt20@rice.edu" },
  ],
}

export const team: TeamMember[] = [
  {
    name: "Faye Tang",
    role: "Student Research Assistant",
    contribution: "Designed and built the website, extended the LKMC model.",
    bio: "I'm a student at Clements High School, class of 2027. For this project, I developed a more efficient version of the lab's lattice kinetic Monte Carlo (LKMC) model to realistically simulate dendrite formation, built the Homepage,  Library and References pages. I plan to study materials science and engineering, working closely with technology to advance sustainability.",
    focus: ["Web design", "Science communication", "Simulation", "Literature review"],
    links: [{ kind: "email", href: "mailto:faye.tang.r@gmail.com" }],
  },
  {
    name: "Team Member",
    role: "Student Research Assistant",
    contribution: "Built ...",
    bio: "......",
    focus: ["Simulation", "WebAssembly"], //I just put some examples, you guys can change anything
    links: [{ kind: "github", href: "https://github.com" }],
  },
  {
    name: "Team Member",
    role: "Student Research Assistant",
    contribution: ".....",
    bio: "....",
    focus: ["Literature review", "Battery chemistry"],
    links: [{ kind: "linkedin", href: "https://www.linkedin.com" }],
  },
  {
    name: "Team Member",
    role: "Student Research Assistant",
    contribution: "...",
    bio: ".....",
    focus: ["Education", "Detection methods"],
    links: [{ kind: "email", href: "johndoe@gmail.com" }],
  },
]
