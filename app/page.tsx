import HomepageClientView from "@/components/ui/pages/home"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};
export default function Page() {
  return <HomepageClientView />
}
