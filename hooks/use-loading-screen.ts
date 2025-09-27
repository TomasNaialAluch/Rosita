"use client"

import { useState, useEffect } from 'react'

export function useLoadingScreen() {
  const [showLoading, setShowLoading] = useState(false)
  const [hasShownToday, setHasShownToday] = useState(false)

  useEffect(() => {
    // Verificar si ya se mostró hoy
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem('rosita-loading-shown')
    
    if (lastShown !== today) {
      setShowLoading(true)
      setHasShownToday(true)
    }
  }, [])

  const completeLoading = () => {
    setShowLoading(false)
    // Guardar que ya se mostró hoy
    const today = new Date().toDateString()
    localStorage.setItem('rosita-loading-shown', today)
  }

  const forceShowLoading = () => {
    console.log("🔄 Forzando mostrar animación...")
    setShowLoading(true)
  }

  return {
    showLoading,
    completeLoading,
    forceShowLoading,
    hasShownToday
  }
}
