import AboutClientView from "@/components/pages/about"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the student team behind Battery Dendrites, an educational resource on lithium dendrites and battery safety, built in collaboration with Professor Ming Tang's Mesoscale Materials Science Group at Rice University.",
}

export default function Page() {
  return <AboutClientView />
}
