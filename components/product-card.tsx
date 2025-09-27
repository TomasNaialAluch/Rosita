"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Plus } from "lucide-react"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  onSelect: () => void
}

export function ProductCard({ product, viewMode, onSelect }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
              {product.featured && (
                <Badge className="absolute -top-2 -right-2 bg-rosita-orange text-white">
                  <Star className="h-3 w-3" />
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-rosita-black truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="secondary" className="text-xs bg-rosita-pink/10 text-rosita-pink">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Badge>
                    {product.weight && (
                      <Badge variant="outline" className="text-xs">
                        {product.weight}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-rosita-pink">{formatPrice(product.price)}</div>
                  <div className="text-sm text-gray-500">
                    {product.sellBy === "both" ? "por kg/unidad" : `por ${product.sellBy}`}
                  </div>
                  <Button size="sm" className="mt-2 bg-rosita-pink hover:bg-rosita-pink/90">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onSelect}
    >
      <div className="relative aspect-square">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-rosita-orange text-white text-xs px-2 py-1 sm:top-2 sm:right-2 sm:text-xs sm:px-2 sm:py-1">
            <Star className="h-3 w-3 mr-1 sm:h-3 sm:w-3 sm:mr-1" />
            <span className="hidden sm:inline">Destacado</span>
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Sin Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 sm:mb-2">
          <h3 className="font-semibold text-sm leading-tight sm:text-lg text-rosita-black group-hover:text-rosita-pink transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1 hidden sm:block mt-1">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-1 mb-2 sm:gap-1 sm:mb-3">
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 bg-rosita-pink/10 text-rosita-pink sm:text-xs sm:px-2 sm:py-1"
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
          {product.weight && (
            <Badge variant="outline" className="text-xs px-2 py-1 hidden sm:inline-flex sm:text-xs sm:px-2 sm:py-1">
              {product.weight}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-rosita-pink sm:text-xl truncate">{formatPrice(product.price)}</div>
            <div className="text-xs text-gray-500 hidden sm:block sm:text-xs">
              {product.sellBy === "both" ? "por kg/unidad" : `por ${product.sellBy}`}
            </div>
          </div>

          <Button
            size="sm"
            className="bg-rosita-pink hover:bg-rosita-pink/90 h-8 w-8 p-0 sm:h-8 sm:w-auto sm:px-3 sm:py-2 ml-2"
            disabled={!product.inStock}
          >
            {/* Ícono Plus en mobile, ShoppingCart en desktop */}
            <Plus className="h-4 w-4 sm:hidden" />
            <ShoppingCart className="hidden sm:block h-4 w-4" />
            <span className="hidden sm:inline sm:ml-1">Agregar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
