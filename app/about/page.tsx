import AboutClientView from "@/components/pages/about"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the Rice University researchers behind Battery Dendrites, an educational resource to lithium dendrites and battery safety.",
}

export default function Page() {
  return <AboutClientView />
}
