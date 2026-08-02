import SimPageClientView from "@/components/pages/sim-page/sim";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation",
};

export default function Page() {
  return <SimPageClientView />
}