"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"

interface NavigationTimerProps {
  children: React.ReactNode
}

export function NavigationTimer({ children }: NavigationTimerProps) {
  const [navigationTime, setNavigationTime] = useState(0)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Solo contar tiempo en la página de inicio
    if (pathname !== "/") {
      return
    }

    // No contar tiempo si el usuario está logueado
    if (user || loading) {
      return
    }

    // Resetear contador en cada cambio de página
    setNavigationTime(0)

    const interval = setInterval(() => {
      setNavigationTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [user, loading, pathname])

  return <>{children}</>
}
