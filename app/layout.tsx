import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { RegistrationPrompt } from "@/components/registration-prompt"
import { NavigationTimer } from "@/components/navigation-timer"
import { AppWrapper } from "@/components/app-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rosita Carnicería Premium - Tradición familiar, calidad generación tras generación",
  description:
    "Carnicería premium con 4 generaciones de experiencia. Cortes selectos de vacuno, cerdo y pollo con entrega a domicilio en Buenos Aires.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="es" suppressHydrationWarning>
          <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <NavigationTimer>
                <AppWrapper>
                  {children}
                  <RegistrationPrompt />
                </AppWrapper>
                <Toaster />
              </NavigationTimer>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
