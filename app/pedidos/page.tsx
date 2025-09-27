"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Eye,
  RotateCcw,
  AlertCircle,
  Star,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"

// Tipos para los pedidos
interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  bone_type: string
  format_type: string
  vacuum_packing: boolean
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  delivery_address: string
  delivery_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

// Datos de ejemplo para mostrar la funcionalidad
const mockOrders: Order[] = [
  {
    id: "order-001",
    user_id: "user-1",
    total_amount: 15750,
    status: "delivered",
    delivery_address: "Av. Corrientes 1234, CABA",
    delivery_phone: "+54 11 1234-5678",
    notes: "Tocar timbre A",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T16:45:00Z",
    items: [
      {
        id: "item-1",
        product_id: "vacuno-asado-medio",
        product_name: "Asado del Medio",
        quantity: 1,
        unit_price: 8500,
        bone_type: "con-hueso",
        format_type: "entero",
        vacuum_packing: false,
      },
      {
        id: "item-2",
        product_id: "vacuno-vacio-premium",
        product_name: "Vacío Premium",
        quantity: 1,
        unit_price: 7250,
        bone_type: "sin-hueso",
        format_type: "cortado-2",
        vacuum_packing: true,
      },
    ],
  },
  {
    id: "order-002",
    user_id: "user-1",
    total_amount: 12300,
    status: "preparing",
    delivery_address: "Av. Corrientes 1234, CABA",
    delivery_phone: "+54 11 1234-5678",
    notes: null,
    created_at: "2024-01-20T14:15:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    items: [
      {
        id: "item-3",
        product_id: "cerdo-bondiola",
        product_name: "Bondiola",
        quantity: 2,
        unit_price: 6150,
        bone_type: "sin-hueso",
        format_type: "entero",
        vacuum_packing: false,
      },
    ],
  },
  {
    id: "order-003",
    user_id: "user-1",
    total_amount: 8400,
    status: "confirmed",
    delivery_address: "Av. Corrientes 1234, CABA",
    delivery_phone: "+54 11 1234-5678",
    notes: "Entregar después de las 18hs",
    created_at: "2024-01-22T09:00:00Z",
    updated_at: "2024-01-22T09:15:00Z",
    items: [
      {
        id: "item-4",
        product_id: "pollo-suprema",
        product_name: "Suprema de Pollo",
        quantity: 2,
        unit_price: 4200,
        bone_type: "sin-hueso",
        format_type: "milanesa-fina",
        vacuum_packing: false,
      },
    ],
  },
]

function getStatusInfo(status: Order["status"]) {
  const statusMap = {
    pending: {
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      description: "Tu pedido está siendo procesado",
    },
    confirmed: {
      label: "Confirmado",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle,
      description: "Tu pedido ha sido confirmado",
    },
    preparing: {
      label: "Preparando",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Package,
      description: "Estamos preparando tu pedido",
    },
    ready: {
      label: "Listo",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle,
      description: "Tu pedido está listo para entrega",
    },
    delivered: {
      label: "Entregado",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      description: "Tu pedido ha sido entregado",
    },
    cancelled: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
      description: "Tu pedido ha sido cancelado",
    },
  }
  return statusMap[status]
}

function getOrderProgress(status: Order["status"]) {
  const progressMap = {
    pending: 20,
    confirmed: 40,
    preparing: 60,
    ready: 80,
    delivered: 100,
    cancelled: 0,
  }
  return progressMap[status]
}

export default function PedidosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Simular carga de pedidos
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
        setIsLoading(false)
      }, 1000)
    }
  }, [user])

  // Filtrar pedidos
  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) => item.product_name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rosita-black mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">Historial y seguimiento de tus compras</p>
        </div>

        {orders.length === 0 ? (
          // Estado vacío
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
              <p className="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
              <Button asChild className="bg-rosita-pink hover:bg-rosita-pink/90">
                <Link href="/tienda">Explorar productos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Activos ({orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completados ({orders.filter((o) => o.status === "delivered").length})
                </TabsTrigger>
              </TabsList>

              {/* Filtros */}
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar pedidos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="preparing">Preparando</SelectItem>
                    <SelectItem value="ready">Listo</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de todos los pedidos */}
            <TabsContent value="all" className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No se encontraron pedidos con los filtros aplicados</p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
                ))
              )}
            </TabsContent>

            {/* Pedidos activos */}
            <TabsContent value="active" className="space-y-4">
              {filteredOrders
                .filter((order) => !["delivered", "cancelled"].includes(order.status))
                .map((order) => (
                  <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
                ))}
            </TabsContent>

            {/* Pedidos completados */}
            <TabsContent value="completed" className="space-y-4">
              {filteredOrders
                .filter((order) => order.status === "delivered")
                .map((order) => (
                  <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
                ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Modal de detalles del pedido */}
        {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      </div>

      <Footer />
    </div>
  )
}

// Componente para cada tarjeta de pedido
function OrderCard({ order, onViewDetails }: { order: Order; onViewDetails: (order: Order) => void }) {
  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon
  const progress = getOrderProgress(order.status)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Información principal */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-rosita-black">Pedido #{order.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-rosita-pink">{formatPrice(order.total_amount)}</p>
                <p className="text-sm text-gray-600">{order.items.length} producto(s)</p>
              </div>
            </div>

            {/* Estado y progreso */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${statusInfo.color} border`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-gray-600">{statusInfo.description}</span>
              </div>
              {order.status !== "cancelled" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rosita-pink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Productos */}
            <div className="space-y-2 mb-4">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-rosita-pink/10 rounded flex items-center justify-center">
                    <Package className="h-4 w-4 text-rosita-pink" />
                  </div>
                  <span className="flex-1">
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-gray-500 ml-11">+{order.items.length - 2} producto(s) más</p>
              )}
            </div>

            {/* Dirección */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{order.delivery_address}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2 lg:w-40">
            <Button onClick={() => onViewDetails(order)} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
            {order.status === "delivered" && (
              <Button
                variant="outline"
                size="sm"
                className="text-rosita-pink border-rosita-pink hover:bg-rosita-pink hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reordenar
              </Button>
            )}
            {order.status === "delivered" && (
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white"
              >
                <Star className="h-4 w-4 mr-2" />
                Calificar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Modal de detalles del pedido
function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pedido #{order.id.slice(-6)}</CardTitle>
              <CardDescription>{formatDate(order.created_at)}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <StatusIcon className="h-8 w-8 text-rosita-pink" />
            <div>
              <Badge className={`${statusInfo.color} border mb-1`}>{statusInfo.label}</Badge>
              <p className="text-sm text-gray-600">{statusInfo.description}</p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-4">Productos</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-rosita-pink/10 rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-rosita-pink" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Cantidad: {item.quantity}</p>
                      <p>Tipo: {item.bone_type}</p>
                      <p>Formato: {item.format_type}</p>
                      {item.vacuum_packing && <Badge variant="outline">Envasado al vacío</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.unit_price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.unit_price)} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Información de entrega */}
          <div>
            <h3 className="font-semibold mb-4">Información de entrega</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{order.delivery_address}</span>
              </div>
              {order.delivery_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{order.delivery_phone}</span>
                </div>
              )}
              {order.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Notas:</strong> {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-rosita-pink">{formatPrice(order.total_amount)}</span>
          </div>

          {/* Acciones */}
          <div className="flex gap-3">
            {order.status === "delivered" && (
              <>
                <Button className="flex-1 bg-rosita-pink hover:bg-rosita-pink/90">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reordenar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Star className="h-4 w-4 mr-2" />
                  Calificar
                </Button>
              </>
            )}
            {["pending", "confirmed"].includes(order.status) && (
              <Button variant="destructive" className="flex-1">
                Cancelar pedido
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
