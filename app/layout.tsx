import type React from "react"
import type { Metadata } from "next"
import { Nunito, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { GameProvider } from "@/contexts/game-context"

const nunito = Nunito({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VirtuPals - Virtual Pet Care & Financial Learning",
  description: "Learn financial responsibility while caring for your virtual pet!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GameProvider>{children}</GameProvider>
        <Analytics />
      </body>
    </html>
  )
}
