"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X, ShoppingCart, Star, Gift, Truck } from "lucide-react"
import { useRegistrationPrompt } from "@/hooks/use-registration-prompt"

export function RegistrationPrompt() {
  const { showPrompt, closePrompt, dismissForSession } = useRegistrationPrompt()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      closePrompt()
      setIsClosing(false)
    }, 200)
  }

  const handleDismiss = () => {
    setIsClosing(true)
    setTimeout(() => {
      dismissForSession()
      setIsClosing(false)
    }, 200)
  }

  return (
    <Dialog open={showPrompt} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-md mx-auto transition-all duration-200 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo-sin-fondo.png" alt="Rosita Carnicería" width={60} height={60} />
          </div>
          <DialogTitle className="text-2xl font-bold text-rosita-pink">¡Únete a la familia Rosita! 🥩</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Descubre los mejores cortes premium con 4 generaciones de tradición familiar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Beneficios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-rosita-pink/5 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-rosita-pink" />
              <span className="text-sm font-medium">Carrito guardado</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-rosita-orange/5 rounded-lg">
              <Truck className="h-5 w-5 text-rosita-orange" />
              <span className="text-sm font-medium">Envío gratis</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-rosita-brown/5 rounded-lg">
              <Star className="h-5 w-5 text-rosita-brown" />
              <span className="text-sm font-medium">Ofertas exclusivas</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-rosita-red/5 rounded-lg">
              <Gift className="h-5 w-5 text-rosita-red" />
              <span className="text-sm font-medium">Descuentos VIP</span>
            </div>
          </div>

          {/* Oferta especial */}
          <div className="bg-gradient-to-r from-rosita-pink to-rosita-orange p-4 rounded-lg text-white text-center">
            <Badge className="bg-white text-rosita-pink mb-2">¡Oferta de Bienvenida!</Badge>
            <p className="font-semibold">15% OFF en tu primera compra</p>
            <p className="text-sm opacity-90">Válido solo para nuevos usuarios</p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-rosita-pink hover:bg-rosita-pink/90 text-white" size="lg">
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-rosita-pink text-rosita-pink hover:bg-rosita-pink hover:text-white"
            >
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>

          {/* Opciones de cierre */}
          <div className="flex justify-center gap-4 pt-2">
            <button onClick={handleClose} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Recordar más tarde
            </button>
            <button onClick={handleDismiss} className="text-sm text-gray-500 hover:text-gray-700 underline">
              No mostrar más
            </button>
          </div>
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>
      </DialogContent>
    </Dialog>
  )
}
