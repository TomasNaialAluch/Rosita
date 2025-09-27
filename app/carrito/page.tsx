"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DeliveryInfo } from "@/components/delivery-info"
import { createOrder } from "@/lib/orders"

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, toggleVacuumPacking, clearCart, total, itemCount } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)
  const [isSendingOrder, setIsSendingOrder] = useState(false)
  const [orderSent, setOrderSent] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatOptions = [
    { value: "entero", label: "Entero" },
    { value: "picado", label: "Picado" },
    { value: "cortado-1", label: "Cortado 1 dedo" },
    { value: "cortado-2", label: "Cortado 2 dedos" },
    { value: "cortado-3", label: "Cortado 3 dedos" },
    { value: "cortado-4", label: "Cortado 4 dedos" },
    { value: "cortado-5", label: "Cortado 5 dedos" },
    { value: "milanesa-fina", label: "Milanesa Fina" },
    { value: "milanesa-gruesa", label: "Milanesa Gruesa" },
  ]

  const getFormatLabel = (format: string) => {
    const option = formatOptions.find((o) => o.value === format)
    return option?.label || format
  }

  const handleClearCart = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simular delay
    clearCart()
    setIsClearing(false)
    toast({
      title: "Carrito vaciado",
      description: "Se eliminaron todos los productos del carrito",
    })
  }

  const handleSendOrder = async () => {
    if (!user) return

    setIsSendingOrder(true)

    try {
      const orderData = {
        user_id: user.id,
        user_name: user.name,
        user_phone: user.phone,
        user_address: user.address,
        total_amount: total + deliveryCost,
        delivery_address: user.address || "Dirección no especificada",
        delivery_phone: user.phone,
        notes: null,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          bone_type: item.boneType || "con-hueso",
          format_type: item.format || "entero",
          vacuum_packing: item.vacuumPacking || false,
        })),
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setOrderSent(true)
        clearCart()
        toast({
          title: "¡Pedido enviado exitosamente!",
          description: "Nos contactaremos contigo por WhatsApp para enviarte la factura.",
        })
      } else {
        toast({
          title: "Error al enviar el pedido",
          description: result.error || "Hubo un problema al procesar tu pedido. Inténtalo nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending order:", error)
      toast({
        title: "Error inesperado",
        description: "Hubo un problema al enviar tu pedido. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSendingOrder(false)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vacuumPackingCost = items.reduce((sum, item) => sum + (item.vacuumPacking ? 500 * item.quantity : 0), 0)
  const deliveryCost = subtotal > 15000 ? 0 : 2500 // Envío gratis por compras mayores a $15,000

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión para ver tu carrito</h1>
            <p className="text-gray-600 mb-6">
              Necesitas estar registrado para agregar productos al carrito y realizar compras.
            </p>
            <Button asChild className="bg-rosita-pink hover:bg-rosita-pink/90">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-6">Agrega algunos productos deliciosos de nuestra carnicería premium.</p>
            <Button asChild className="bg-rosita-pink hover:bg-rosita-pink/90">
              <Link href="/tienda">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ir a la Tienda
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
            <p className="text-gray-600 mt-1">
              {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? "Vaciando..." : "Vaciar Carrito"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Imagen del Producto */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    {/* Información del Producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="bg-rosita-pink/10 text-rosita-pink">
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Badge>
                            <Badge variant="outline">{getFormatLabel(item.format)}</Badge>
                            <Badge variant="outline">Por {item.sellBy}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Controles de Cantidad y Precio */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                          <div className="font-bold text-lg text-rosita-pink">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>

                      {/* Envasado al Vacío */}
                      <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                          id={`vacuum-${item.id}`}
                          checked={item.vacuumPacking || false}
                          onCheckedChange={() => toggleVacuumPacking(item.id)}
                        />
                        <label
                          htmlFor={`vacuum-${item.id}`}
                          className="text-sm font-medium cursor-pointer flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          Envasado al vacío (+{formatPrice(500)} por unidad)
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            {/* Información de Entrega */}
            <DeliveryInfo />

            {/* Resumen de Precios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} productos)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {vacuumPackingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Envasado al vacío</span>
                    <span>{formatPrice(vacuumPackingCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Costo de envío</span>
                  <span>
                    {deliveryCost === 0 ? (
                      <span className="text-green-600 font-medium">¡Gratis!</span>
                    ) : (
                      formatPrice(deliveryCost)
                    )}
                  </span>
                </div>

                {subtotal < 15000 && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    💡 Agrega {formatPrice(15000 - subtotal)} más para envío gratis
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-rosita-pink">{formatPrice(total + deliveryCost)}</span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  * Los precios son referenciales. El valor final puede variar al momento del pesado.
                </div>

                {orderSent ? (
                  <div className="text-center py-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h3 className="text-green-800 font-semibold mb-2">¡Pedido enviado exitosamente!</h3>
                      <p className="text-green-700 text-sm">
                        Nos contactaremos contigo por WhatsApp para enviarte la factura y coordinar la entrega.
                      </p>
                    </div>
                    <Button asChild className="w-full bg-rosita-pink hover:bg-rosita-pink/90">
                      <Link href="/tienda">Seguir Comprando</Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleSendOrder}
                    disabled={isSendingOrder}
                    className="w-full bg-rosita-pink hover:bg-rosita-pink/90 text-white py-3"
                    size="lg"
                  >
                    {isSendingOrder ? "Enviando pedido..." : "Enviar pedido"}
                  </Button>
                )}

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/tienda">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Seguir Comprando
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Productos frescos seleccionados diariamente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Garantía de calidad premium</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Entrega en horarios programados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
