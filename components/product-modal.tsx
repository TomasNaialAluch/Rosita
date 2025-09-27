"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Minus, Plus, ShoppingCart, Package, Scale, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()

  const [selectedFormat, setSelectedFormat] = useState("")
  const [selectedBone, setSelectedBone] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [weight, setWeight] = useState(1.0)
  const [sellByKilo, setSellByKilo] = useState(false)
  const [vacuumPack, setVacuumPack] = useState(false)
  const [weightError, setWeightError] = useState("")

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setSelectedFormat(product.formatOptions[0] || "")
      setSelectedBone(product.boneOptions[0] || "")
      setQuantity(1)
      setWeight(product.minimumKg || 1.0)
      setSellByKilo(product.sellBy === "kilo")
      setVacuumPack(false)
      setWeightError("")
    }
  }, [product])

  // Validate weight against minimum
  useEffect(() => {
    if (product && sellByKilo && product.minimumKg) {
      if (weight < product.minimumKg) {
        setWeightError(`El mínimo requerido es ${product.minimumKg} kg`)
      } else {
        setWeightError("")
      }
    } else {
      setWeightError("")
    }
  }, [weight, sellByKilo, product])

  if (!product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculatePrice = () => {
    if (sellByKilo && product.pricePerKilo) {
      return product.pricePerKilo * weight
    }
    return product.price * quantity
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleWeightChange = (delta: number) => {
    const newWeight = Math.max(product.minimumKg || 0.1, weight + delta)
    setWeight(Math.round(newWeight * 10) / 10)
  }

  const handleWeightInputChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setWeight(numValue)
    }
  }

  const canAddToCart = () => {
    if (sellByKilo && product.minimumKg && weight < product.minimumKg) {
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      toast({
        title: "Cantidad insuficiente",
        description: `El mínimo requerido es ${product.minimumKg} kg`,
        variant: "destructive",
      })
      return
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: sellByKilo && product.pricePerKilo ? product.pricePerKilo : product.price,
      image: product.image,
      quantity: sellByKilo ? weight : quantity,
      unit: sellByKilo ? "kg" : "unidad",
      format: selectedFormat,
      boneOption: selectedBone,
      vacuumPack,
      category: product.category,
    }

    addToCart(cartItem)

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    })

    onClose()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vacuno":
        return "🐄"
      case "cerdo":
        return "🐷"
      case "pollo":
        return "🐔"
      default:
        return "🥩"
    }
  }

  const minimumKgDisplay = product.minimumKg && (sellByKilo || product.sellBy === "both")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-rosita-pink" />
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>

            {/* Información básica */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {getCategoryIcon(product.category)} {product.category}
                </Badge>
                {product.featured && <Badge className="bg-rosita-pink">Destacado</Badge>}
                {!product.inStock && <Badge variant="destructive">Sin Stock</Badge>}
              </div>

              {product.description && <p className="text-gray-600">{product.description}</p>}

              {product.weight && <p className="text-sm text-gray-500">Peso: {product.weight}</p>}

              {/* Mostrar mínimo de kilogramos */}
              {minimumKgDisplay && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Mínimo requerido: <strong>{product.minimumKg} kg</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Configuración del producto */}
          <div className="space-y-6">
            {/* Precios */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-rosita-pink">{formatPrice(calculatePrice())}</p>
                  <p className="text-sm text-gray-600">
                    {sellByKilo ? `${weight} kg` : `${quantity} unidad${quantity > 1 ? "es" : ""}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Forma de venta */}
            {product.sellBy === "both" && (
              <div className="space-y-2">
                <Label>Forma de Venta</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="sell-by-kilo" checked={sellByKilo} onCheckedChange={setSellByKilo} />
                  <Label htmlFor="sell-by-kilo">
                    Vender por kilo {product.pricePerKilo && `(${formatPrice(product.pricePerKilo)}/kg)`}
                  </Label>
                </div>
              </div>
            )}

            {/* Cantidad/Peso */}
            <div className="space-y-2">
              <Label>{sellByKilo ? "Peso (kg)" : "Cantidad"}</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => (sellByKilo ? handleWeightChange(-0.1) : handleQuantityChange(-1))}
                  disabled={sellByKilo ? weight <= (product.minimumKg || 0.1) : quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                {sellByKilo ? (
                  <Input
                    type="number"
                    step="0.1"
                    min={product.minimumKg || 0.1}
                    value={weight}
                    onChange={(e) => handleWeightInputChange(e.target.value)}
                    className="text-center"
                  />
                ) : (
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center"
                  />
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => (sellByKilo ? handleWeightChange(0.1) : handleQuantityChange(1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Weight error message */}
              {weightError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {weightError}
                </div>
              )}
            </div>

            {/* Formato */}
            <div className="space-y-2">
              <Label>Formato de Entrega</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el formato" />
                </SelectTrigger>
                <SelectContent>
                  {product.formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opción de hueso */}
            {product.boneOptions.length > 1 && (
              <div className="space-y-2">
                <Label>Opción de Hueso</Label>
                <Select value={selectedBone} onValueChange={setSelectedBone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona opción de hueso" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.boneOptions.map((bone) => (
                      <SelectItem key={bone} value={bone}>
                        {bone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Envasado al vacío */}
            <div className="flex items-center space-x-2">
              <Switch id="vacuum-pack" checked={vacuumPack} onCheckedChange={setVacuumPack} />
              <Label htmlFor="vacuum-pack">Envasado al vacío (+$500)</Label>
            </div>

            <Separator />

            {/* Total y botón de agregar */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || !canAddToCart()}
              className="w-full bg-rosita-pink hover:bg-rosita-pink/90"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {!product.inStock
                ? "Sin Stock"
                : !canAddToCart()
                  ? `Mínimo ${product.minimumKg} kg`
                  : "Agregar al Carrito"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
