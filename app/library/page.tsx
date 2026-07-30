import LibraryClientView from "@/components/pages/library"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Library",
}

export default function Page() {
  return <LibraryClientView />
}