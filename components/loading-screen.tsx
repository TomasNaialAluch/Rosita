"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [animationPhase, setAnimationPhase] = useState(0) // 0: inicio, 1: transformación, 2: persiana
  const [showBlinds, setShowBlinds] = useState(false)
  const [showLight, setShowLight] = useState(false)

  useEffect(() => {
    // Fase 1: Mostrar Rosita (4 segundos)
    const phase1Timer = setTimeout(() => {
      setAnimationPhase(1)
    }, 4000)

    // Fase 2: Transición suave a la rosa (5 segundos)
    const phase2Timer = setTimeout(() => {
      setAnimationPhase(2)
      setShowBlinds(true)
      // Efecto de luz cuando se levanta la persiana
      setTimeout(() => setShowLight(true), 500)
    }, 9000)

    // Fase 3: Completar animación (2 segundos)
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 11000)

    return () => {
      clearTimeout(phase1Timer)
      clearTimeout(phase2Timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-rosita-pink flex items-center justify-center z-50 overflow-hidden">
      
          {/* Contenido principal */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Contenedor de la imagen - sin círculo, sin movimiento */}
            <div className="relative w-80 h-80 mb-8">
              {/* Rosita - solo se muestra en fase 0 y 1 */}
              <div
                className={`flex items-center justify-center transition-all duration-1500 ease-in-out ${
                  animationPhase <= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <Image
                  src="/images/abuela-rosita-nueva.png"
                  alt="Rosita"
                  width={280}
                  height={280}
                  className="rounded-full object-cover"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                    backgroundColor: 'transparent',
                    mixBlendMode: 'normal'
                  }}
                />
              </div>

              {/* Rosa del logo - solo se muestra en fase 2 */}
              <div
                className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
                  animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <Image
                  src="/images/logo-sin-fondo.png"
                  alt="Rosa Rosita"
                  width={320}
                  height={320}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>

        {/* Texto elegante que aparece progresivamente */}
        <div className="text-center space-y-6 max-w-md">
          {/* Nombre Rosita - siempre visible */}
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Rosita
          </h1>
          
          {/* Subtítulo que cambia según la fase */}
          <div className="space-y-3">
            <p 
              className={`text-white/90 text-xl font-light drop-shadow-md transition-all duration-1000 ${
                animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {animationPhase <= 1 ? 'En honor a nuestra fundadora' : 'Carnicería Premium'}
            </p>
            
            <p 
              className={`text-white/70 text-lg font-light drop-shadow-md transition-all duration-1000 delay-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {animationPhase <= 1 ? '4 generaciones de tradición familiar' : 'Tradición familiar desde 1950'}
            </p>
          </div>
        </div>

      </div>

      {/* Persiana metálica rosa de carnicería */}
      <div 
        className={`absolute inset-0 transition-transform duration-1500 ease-out ${
          showBlinds ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{
          transformOrigin: 'top',
          background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
          boxShadow: showBlinds ? '0 -15px 40px rgba(0,0,0,0.4)' : '0 0 0 rgba(0,0,0,0)'
        }}
      >
        {/* Textura metálica de la persiana */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />
        </div>
        
        {/* Láminas de la persiana */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full bg-gradient-to-r from-white/20 via-white/10 to-white/20"
              style={{ 
                top: `${i * 5}%`,
                height: '5%',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                borderTop: '1px solid rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </div>

        {/* Agujeros de la persiana metálica */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-black/20 rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Efecto de luz al levantar */}
        <div 
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-opacity duration-1000 ${
            showBlinds ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Luz del día que entra cuando se levanta la persiana */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-yellow-100/30 via-transparent to-transparent transition-opacity duration-2000 ${
          showLight ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
