"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Sparkles, MessageCircle } from "lucide-react"
import { getProducts, getProductsByCategory } from "@/lib/products-db"
import { type Product } from "@/lib/products"
import RecipeChat from "@/components/recipe-chat"

export default function RecipePageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
      setProductsByCategory(getProductsByCategory(fetchedProducts))
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setShowChat(true)
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-[#C85A6E] mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-12 w-12 text-[#C85A6E] mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Recetas con IA</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Seleccioná tu corte favorito y nuestro chef virtual te creará recetas personalizadas
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Powered by Inteligencia Artificial</span>
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <RecipeChat product={selectedProduct} onClose={handleCloseChat} />
            </div>
          </div>
        )}

        {/* Products by Category */}
        <div className="space-y-8">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <Card key={category} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#C85A6E] flex items-center">
                  <span className="mr-3">{getCategoryIcon(category)}</span>
                  {category}
                </CardTitle>
                <CardDescription>Seleccioná un corte para recibir recetas personalizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {categoryProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center justify-center text-center hover:bg-[#C85A6E] hover:text-white transition-all duration-200 group bg-transparent"
                      onClick={() => handleProductSelect(product)}
                    >
                      <span className="font-medium text-sm leading-tight">{product.name}</span>
                      {product.minimum_kg && (
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs group-hover:bg-white group-hover:text-[#C85A6E]"
                        >
                          Min: {product.minimum_kg}kg
                        </Badge>
                      )}
                      <MessageCircle className="h-4 w-4 mt-2 opacity-60 group-hover:opacity-100" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-12 bg-gradient-to-r from-[#C85A6E]/10 to-orange-100 border-[#C85A6E]/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">¿Cómo funciona?</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#C85A6E] text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">
                    1
                  </div>
                  <p>
                    <strong>Elegí tu corte</strong>
                    <br />
                    Seleccioná el producto que querés cocinar
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#C85A6E] text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">
                    2
                  </div>
                  <p>
                    <strong>Conversá con el chef</strong>
                    <br />
                    Decile qué ingredientes tenés o pedí una receta sorpresa
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#C85A6E] text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">
                    3
                  </div>
                  <p>
                    <strong>Guardá tu receta</strong>
                    <br />
                    Descargala en PDF o compartila como texto
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case "vacuno":
      return "🥩"
    case "cerdo":
      return "🐷"
    case "pollo":
      return "🐔"
    case "cordero":
      return "🐑"
    default:
      return "🍖"
  }
}
