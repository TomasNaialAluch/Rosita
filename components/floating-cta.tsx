"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, X, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Solo mostrar en la página de inicio
    if (pathname !== "/") {
      setIsVisible(false)
      return
    }

    // No mostrar si el usuario está logueado
    if (user || loading) {
      setIsVisible(false)
      return
    }

    // Verificar si ya se interactuó
    const ctaDismissed = sessionStorage.getItem("floating-cta-dismissed")
    if (ctaDismissed) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const scrolled = window.scrollY > 300
      setHasScrolled(scrolled)

      // Mostrar después de hacer scroll y esperar 3 segundos
      if (scrolled && !isVisible) {
        setTimeout(() => {
          setIsVisible(true)
        }, 3000)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [user, loading, isVisible, pathname])

  const dismissCTA = () => {
    setIsVisible(false)
    sessionStorage.setItem("floating-cta-dismissed", "true")
  }

  if (!isVisible || !hasScrolled) return null

  return (
    <div className="fixed bottom-20 left-4 z-50 animate-in slide-in-from-left-5 duration-500">
      <div className="relative">
        <div className="bg-gradient-to-r from-rosita-pink to-rosita-orange p-4 rounded-lg shadow-lg text-white max-w-xs">
          <button
            onClick={dismissCTA}
            className="absolute -top-2 -right-2 bg-white text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" />
            <Badge className="bg-white/20 text-white text-xs">¡Oferta especial!</Badge>
          </div>

          <h3 className="font-bold text-sm mb-1">15% OFF primera compra</h3>
          <p className="text-xs opacity-90 mb-3">Regístrate y obtén descuento en cortes premium</p>

          <Button asChild size="sm" className="w-full bg-white text-rosita-pink hover:bg-gray-100">
            <Link href="/register" className="flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" />
              Crear cuenta
            </Link>
          </Button>
        </div>

        {/* Indicador pulsante */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rosita-orange rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rosita-orange rounded-full"></div>
      </div>
    </div>
  )
}
