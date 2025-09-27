"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useScroll } from "@/hooks/use-scroll"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const scrolled = useScroll()

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Tienda", href: "/tienda" },
    { name: "Recetas", href: "/recetas" },
    { name: "Noticias", href: "/noticias" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C85A6E]/20 bg-[#C85A6E] backdrop-blur supports-[backdrop-filter]:bg-[#C85A6E]/95">
      <div className="container flex h-16 items-center justify-between">
        {/* Lado Izquierdo */}
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              {/* Botón Menú Hamburguesa para Móvil y Tablet */}
              <Button variant="ghost" className="text-white hover:bg-white/10 xl:hidden p-3">
                <div className="flex items-center gap-2">
                  <Menu className="h-8 w-8" strokeWidth={3} />
                  <span className="text-lg font-medium">Menú</span>
                </div>
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Image src="/images/logo-sin-fondo.png" alt="Rosita Carnicería" width={40} height={40} />
                  <span className="font-bold text-lg text-rosita-pink">Rosita</span>
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-700 hover:text-rosita-pink transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Navegación para PC - Solo visible en pantallas muy grandes */}
          <nav className="hidden xl:flex items-center gap-6 ml-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-white hover:text-white/80 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logo Centrado - Aparece cuando se hace scroll en TODAS las pantallas */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-sin-fondo.png"
              alt="Rosita Carnicería"
              width={32}
              height={32}
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="font-bold text-lg md:text-xl text-white hidden sm:block">Rosita</span>
          </Link>
        </div>

        {/* Lado Derecho */}
        <div className="flex items-center gap-2">
          {/* Carrito - Solo visible si el usuario está logueado */}
          {user && (
            <Link href="/carrito">
              <Button variant="ghost" className="text-white hover:bg-white/10 relative px-3 py-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
                  <span className="hidden sm:block font-medium">Carrito</span>
                </div>
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-sm bg-white text-[#C85A6E]"
                  >
                    {itemCount}
                  </Badge>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 p-3">
                  <User className="h-7 w-7" />
                  <span className="sr-only">Perfil de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Mi Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos">Mis Pedidos</Link>
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Panel Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-[#D98E04] text-white hover:bg-[#D98E04]/90 font-medium text-sm">
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
