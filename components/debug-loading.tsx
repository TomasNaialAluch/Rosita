"use client"

import { Button } from "@/components/ui/button"

interface DebugLoadingProps {
  forceShowLoading: () => void
}

export function DebugLoading({ forceShowLoading }: DebugLoadingProps) {
  // Temporalmente siempre mostrar para debug
  // if (process.env.NODE_ENV !== 'development') {
  //   return null
  // }

  const handleClick = () => {
    console.log("🎬 Botón de animación clickeado!")
    forceShowLoading()
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white p-2 rounded-lg shadow-lg border-2 border-rosita-pink">
      <Button 
        onClick={handleClick}
        className="bg-rosita-pink hover:bg-rosita-pink/90 text-white font-bold text-lg px-6 py-3"
      >
        🎬 Probar Animación
      </Button>
    </div>
  )
}
