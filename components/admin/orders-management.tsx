"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, User, Phone, MapPin, Calendar, Package, RefreshCw, Eye } from "lucide-react"
import { getOrders, updateOrderStatus, formatPrice, getStatusLabel, getStatusColor, type Order } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  const loadOrders = async () => {
    setLoading(true)
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingStatus(orderId)
    try {
      const success = await updateOrderStatus(orderId, newStatus)
      if (success) {
        await loadOrders()
        toast({
          title: "Estado actualizado",
          description: `El pedido se marcó como ${getStatusLabel(newStatus).toLowerCase()}`,
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del pedido",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Error inesperado al actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rosita-pink"></div>
        <span className="ml-2">Cargando pedidos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rosita-black">Gestión de Pedidos</h2>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} en total
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-600">Los pedidos aparecerán aquí cuando los clientes realicen compras.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lista de Pedidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Lista de Pedidos</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id ? "ring-2 ring-rosita-pink" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{order.user_name}</span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                        </div>
                        <div className="font-semibold text-rosita-pink">Total: {formatPrice(order.total_amount)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detalles del Pedido */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Detalles del Pedido</h3>
            {selectedOrder ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Pedido #{selectedOrder.id.slice(-8)}
                    </CardTitle>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Información del Cliente */}
                  <div>
                    <h4 className="font-semibold mb-2">Información del Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{selectedOrder.user_name}</span>
                      </div>
                      {selectedOrder.user_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{selectedOrder.user_phone}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>{selectedOrder.delivery_address}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Productos */}
                  <div>
                    <h4 className="font-semibold mb-2">Productos</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-gray-600">
                              {item.format_type} • {item.bone_type}
                              {item.vacuum_packing && " • Envasado al vacío"}
                            </div>
                            <div className="text-gray-600">Cantidad: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(item.unit_price * item.quantity)}</div>
                            <div className="text-gray-600 text-xs">{formatPrice(item.unit_price)} c/u</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-rosita-pink">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>

                  <Separator />

                  {/* Cambiar Estado */}
                  <div>
                    <h4 className="font-semibold mb-2">Cambiar Estado</h4>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value: Order["status"]) => handleStatusUpdate(selectedOrder.id, value)}
                      disabled={updatingStatus === selectedOrder.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="preparing">Preparando</SelectItem>
                        <SelectItem value="ready">Listo</SelectItem>
                        <SelectItem value="delivered">Entregado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOrder.notes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Notas</h4>
                        <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Selecciona un pedido para ver sus detalles</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
