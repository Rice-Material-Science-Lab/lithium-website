import { Geist_Mono, Inter, Merriweather } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Rice University Dendrite Lab",
    default: "The Risks of Dendrite", 
  },
};


const merriweatherHeading = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        merriweatherHeading.variable
      )}
    >
      <body className="h-screen relative">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
