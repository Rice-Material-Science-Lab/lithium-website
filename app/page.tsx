import HomepageClientView from "@/components/pages/homepage/home"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Battery Dendrites — An Educational Resource",
  },
};

export default function Page() {
  return <HomepageClientView />
}
