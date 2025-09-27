"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"

export function useRegistrationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasShownPrompt, setHasShownPrompt] = useState(false)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Solo mostrar en la página de inicio
    if (pathname !== "/") {
      setShowPrompt(false)
      return
    }

    // No mostrar si el usuario está logueado, si está cargando, o si ya se mostró
    if (user || loading || hasShownPrompt) {
      return
    }

    // Verificar si ya se mostró en esta sesión
    const promptShown = sessionStorage.getItem("registration-prompt-shown")
    if (promptShown) {
      setHasShownPrompt(true)
      return
    }

    // Configurar timer de 15 segundos
    const timer = setTimeout(() => {
      setShowPrompt(true)
      setHasShownPrompt(true)
      sessionStorage.setItem("registration-prompt-shown", "true")
    }, 15000) // 15 segundos

    return () => clearTimeout(timer)
  }, [user, loading, hasShownPrompt, pathname])

  const closePrompt = () => {
    setShowPrompt(false)
  }

  const dismissForSession = () => {
    setShowPrompt(false)
    sessionStorage.setItem("registration-prompt-dismissed", "true")
  }

  return {
    showPrompt,
    closePrompt,
    dismissForSession,
  }
}
