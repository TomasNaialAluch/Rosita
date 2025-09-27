"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import type { Product } from "@/lib/products"

// Definir categorías y tipos de hueso localmente para evitar problemas de importación
const categories = [
  { id: "all", name: "Todos", icon: "🥩" },
  { id: "vacuno", name: "Vacuno", icon: "🐄" },
  { id: "cerdo", name: "Cerdo", icon: "🐷" },
  { id: "pollo", name: "Pollo", icon: "🐔" },
  { id: "cordero", name: "Cordero", icon: "🐑" },
]

const boneTypes = [
  { id: "all", name: "Todos" },
  { id: "con-hueso", name: "Con hueso" },
  { id: "sin-hueso", name: "Sin hueso" },
]

interface TiendaClientProps {
  products: Product[]
}

export function TiendaClient({ products }: TiendaClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBoneType, setSelectedBoneType] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesBoneType =
        selectedBoneType === "all" ||
        (product.boneOptions && product.boneOptions.includes(selectedBoneType))

      return matchesSearch && matchesCategory && matchesBoneType
    })

    // Ordenar productos
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [products, searchQuery, selectedCategory, selectedBoneType, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedBoneType("all")
    setSortBy("name")
  }

  const activeFiltersCount = [searchQuery, selectedCategory !== "all", selectedBoneType !== "all"].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestra Tienda</h1>
          <p className="text-gray-600">Descubre los mejores cortes de carne frescos y de calidad premium</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categoría</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de hueso</label>
                      <Select value={selectedBoneType} onValueChange={setSelectedBoneType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {boneTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Nombre (A-Z)</SelectItem>
                          <SelectItem value="price-asc">Precio (menor a mayor)</SelectItem>
                          <SelectItem value="price-desc">Precio (mayor a menor)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      Limpiar filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Grid de productos */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
