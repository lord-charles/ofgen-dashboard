import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "./session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ofgen Solar Dashboard",
  description: "Monitor solar installations across Kenya"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background overflow-x-hidden w-screen ${inter.className}`}>
        <NextAuthProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
