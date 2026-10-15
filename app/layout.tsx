import { Geist_Mono, Lato, Cormorant_Garamond } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Metadata } from "next";
import Navbar from "@/components/ui/navbar"

export const metadata: Metadata = {
  title: {
    template: "%s | Battery Dendrites",
    default: "Battery Dendrites — An Educational Resource",
  },
};


const cormorantHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-sans",
})

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
        lato.variable,
        cormorantHeading.variable
      )}
    >
      <body className="h-screen relative">
        <ThemeProvider>
          <TooltipProvider><Navbar />{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}