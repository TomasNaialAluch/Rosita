"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { getSiteMessage, type SiteMessage } from "@/lib/site-messages"

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [timeOnSite, setTimeOnSite] = useState(0)
  const [welcomeMessage, setWelcomeMessage] = useState<SiteMessage | null>(null)
  const [usersMessage, setUsersMessage] = useState<SiteMessage | null>(null)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Cargar mensajes editables
    loadMessages()

    // Solo mostrar en la página de inicio
    if (pathname !== "/") {
      setIsVisible(false)
      return
    }

    // No mostrar si el usuario está logueado o cargando
    if (user || loading) {
      setIsVisible(false)
      return
    }

    // Verificar si ya se cerró en esta sesión
    const bannerClosed = sessionStorage.getItem("welcome-banner-closed")
    if (bannerClosed) {
      setIsVisible(false)
      return
    }

    // Mostrar banner después del delay configurado
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, welcomeMessage?.display_conditions?.delay || 5000)

    // Contador de tiempo en el sitio
    const timeInterval = setInterval(() => {
      setTimeOnSite((prev) => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(timeInterval)
    }
  }, [user, loading, pathname, welcomeMessage])

  const loadMessages = async () => {
    try {
      const welcome = await getSiteMessage("welcome_banner")
      const users = await getSiteMessage("shopping_users")
      setWelcomeMessage(welcome)
      setUsersMessage(users)
    } catch (error) {
      console.error("Error loading banner messages:", error)
    }
  }

  const closeBanner = () => {
    setIsVisible(false)
    sessionStorage.setItem("welcome-banner-closed", "true")
  }

  if (!isVisible || !welcomeMessage?.is_active) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <Card className="p-4 shadow-lg border-l-4 border-l-rosita-pink bg-white">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-rosita-pink/10 text-rosita-pink">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(timeOnSite)}
          </Badge>
          <button onClick={closeBanner} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-rosita-black text-sm">{welcomeMessage.title}</h3>
            {welcomeMessage.content && <p className="text-xs text-gray-600 mt-1">{welcomeMessage.content}</p>}
          </div>

          {usersMessage?.is_active && usersMessage.content && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>{usersMessage.content}</span>
            </div>
          )}

          <div className="flex gap-2">
            {welcomeMessage.button_text && welcomeMessage.button_link && (
              <Button asChild size="sm" className="flex-1 bg-rosita-pink hover:bg-rosita-pink/90 text-xs">
                <Link href={welcomeMessage.button_link}>{welcomeMessage.button_text}</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
              <Link href="/tienda">Ver productos</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
