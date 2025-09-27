"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Shield,
  Truck,
  Mail,
  MessageSquare,
  Newspaper,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { DeliveryConfigModal } from "@/components/admin/delivery-config-modal"
import { ContactInfoModal } from "@/components/admin/contact-info-modal"
import { SiteMessagesModal } from "@/components/admin/site-messages-modal"
import { NewsManagementModal } from "@/components/admin/news-management-modal"
import { OrdersManagement } from "@/components/admin/orders-management"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isDeliveryConfigOpen, setIsDeliveryConfigOpen] = useState(false)
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false)
  const [isSiteMessagesOpen, setIsSiteMessagesOpen] = useState(false)
  const [isNewsManagementOpen, setIsNewsManagementOpen] = useState(false)

  // Redirigir si no está autenticado o no es admin
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando panel de administración...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !user.is_admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="text-rosita-pink hover:text-rosita-pink/80">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-rosita-pink" />
            <div>
              <h1 className="text-3xl font-bold text-rosita-black">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona productos, pedidos y configuraciones de la tienda</p>
            </div>
          </div>
          <Badge className="bg-rosita-orange">Bienvenido, {user.name}</Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-rosita-black">24</p>
                </div>
                <Package className="h-8 w-8 text-rosita-pink" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
                  <p className="text-2xl font-bold text-rosita-black">12</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-rosita-orange" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-rosita-black">156</p>
                </div>
                <Users className="h-8 w-8 text-rosita-brown" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventas del Mes</p>
                  <p className="text-2xl font-bold text-rosita-black">$485K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-rosita-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="productos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          {/* Productos Tab */}
          <TabsContent value="productos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Productos</CardTitle>
                    <CardDescription>Administra el catálogo de productos de la carnicería</CardDescription>
                  </div>
                  <Button asChild className="bg-rosita-pink hover:bg-rosita-pink/90">
                    <Link href="/admin/productos">
                      <Package className="h-4 w-4 mr-2" />
                      Gestionar Productos
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-rosita-black mb-2">Productos Activos</h3>
                    <p className="text-2xl font-bold text-rosita-pink">21</p>
                    <p className="text-sm text-gray-600">En stock y disponibles</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-rosita-black mb-2">Sin Stock</h3>
                    <p className="text-2xl font-bold text-rosita-orange">3</p>
                    <p className="text-sm text-gray-600">Requieren reposición</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-rosita-black mb-2">Destacados</h3>
                    <p className="text-2xl font-bold text-rosita-brown">8</p>
                    <p className="text-sm text-gray-600">Productos promocionados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pedidos Tab */}
          <TabsContent value="pedidos">
            <OrdersManagement />
          </TabsContent>

          {/* Usuarios Tab */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios registrados en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Usuarios</h3>
                  <p className="text-gray-600 mb-4">Funcionalidad en desarrollo</p>
                  <Button variant="outline" disabled>
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reportes Tab */}
          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
                <CardDescription>Analiza el rendimiento de la tienda y las ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes y Analytics</h3>
                  <p className="text-gray-600 mb-4">Funcionalidad en desarrollo</p>
                  <Button variant="outline" disabled>
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-rosita-black mb-4">Acciones Rápidas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/admin/productos/nuevo">
                <Plus className="h-6 w-6" />
                Agregar Producto
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/admin/productos">
                <Settings className="h-6 w-6" />
                Configurar Productos
              </Link>
            </Button>
            <Button onClick={() => setIsDeliveryConfigOpen(true)} variant="outline" className="h-20 flex-col gap-2">
              <Truck className="h-6 w-6" />
              Configurar Entregas
            </Button>
            <Button onClick={() => setIsContactInfoOpen(true)} variant="outline" className="h-20 flex-col gap-2">
              <Mail className="h-6 w-6" />
              Configurar Contacto
            </Button>
            <Button onClick={() => setIsSiteMessagesOpen(true)} variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              Gestionar Mensajes
            </Button>
            <Button onClick={() => setIsNewsManagementOpen(true)} variant="outline" className="h-20 flex-col gap-2">
              <Newspaper className="h-6 w-6" />
              Gestionar Noticias
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" disabled>
              <Users className="h-6 w-6" />
              Gestionar Usuarios
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeliveryConfigModal isOpen={isDeliveryConfigOpen} onClose={() => setIsDeliveryConfigOpen(false)} />
      <ContactInfoModal isOpen={isContactInfoOpen} onClose={() => setIsContactInfoOpen(false)} />
      <SiteMessagesModal isOpen={isSiteMessagesOpen} onClose={() => setIsSiteMessagesOpen(false)} />
      <NewsManagementModal isOpen={isNewsManagementOpen} onClose={() => setIsNewsManagementOpen(false)} />

      <Footer />
    </div>
  )
}
