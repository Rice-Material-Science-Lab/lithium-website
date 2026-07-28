import SimPageClientView from "@/components/ui/pages/sim";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation",
};

export default function Page() {
  return <SimPageClientView />
}