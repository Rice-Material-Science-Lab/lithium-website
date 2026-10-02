import AboutClientView from "@/components/pages/about"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the Rice University researchers behind Dendrite Lab, an interactive guide to lithium dendrites and battery safety.",
}

export default function Page() {
  return <AboutClientView />
}
