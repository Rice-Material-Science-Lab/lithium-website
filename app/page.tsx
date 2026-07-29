import HomepageClientView from "@/components/pages/home"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Home | Rice University Dendrite Lab",
  },
};

export default function Page() {
  return <HomepageClientView />
}
