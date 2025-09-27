"use client"

import { useState, useMemo, useEffect } from "react"
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
// Remover: import { products, categories, boneTypes, type Product } from "@/lib/products"
import { categories, boneTypes, type Product } from "@/lib/products"
import { getProducts } from "@/lib/products-db"

export default function TiendaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBoneType, setSelectedBoneType] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // Agregar estados:
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar productos desde la base de datos
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const dbProducts = await getProducts()
      setProducts(dbProducts)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      const matchesBoneType =
        selectedBoneType === "all" || product.boneOptions.includes(selectedBoneType as "con-hueso" | "sin-hueso")

      return matchesSearch && matchesCategory && matchesBoneType
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedBoneType, sortBy, products])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedBoneType("all")
    setSortBy("name")
  }

  const activeFiltersCount = [selectedCategory !== "all", selectedBoneType !== "all", searchQuery !== ""].filter(
    Boolean,
  ).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rosita-black mb-2">Nuestra Tienda</h1>
          <p className="text-gray-600">Cortes premium seleccionados con 4 generaciones de experiencia</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-rosita-pink hover:bg-rosita-pink/90"
                      : "hover:bg-rosita-pink/10"
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rosita-pink">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <MobileFilters
                    selectedBoneType={selectedBoneType}
                    setSelectedBoneType={setSelectedBoneType}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile View Mode Buttons - AGREGAR ESTO */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-rosita-pink/10" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-rosita-pink/10" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4 mt-4 pt-4 border-t">
            <Select value={selectedBoneType} onValueChange={setSelectedBoneType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo de hueso" />
              </SelectTrigger>
              <SelectContent>
                {boneTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-low">Precio: Menor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor</SelectItem>
                <SelectItem value="featured">Destacados</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-rosita-pink/10" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-rosita-pink/10" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-rosita-pink">
                Limpiar ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-rosita-pink/10 text-rosita-pink">
                    Búsqueda: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-rosita-pink/10 text-rosita-pink">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedBoneType !== "all" && (
                  <Badge variant="secondary" className="bg-rosita-pink/10 text-rosita-pink">
                    {boneTypes.find((b) => b.id === selectedBoneType)?.name}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid - Cambiado a 2 columnas en mobile */}
        {filteredProducts.length > 0 ? (
          <div
            className={`grid mb-12 ${
              viewMode === "grid"
                ? "grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6"
                : "grid-cols-1 gap-6"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || `product-${index}`}
                product={product}
                viewMode={viewMode}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros o buscar con otros términos</p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Featured Products Section */}
        {selectedCategory === "all" && searchQuery === "" && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-rosita-black mb-6">Productos Destacados</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
              {products
                .filter((p) => p.featured)
                .slice(0, 4)
                .map((product, index) => (
                  <ProductCard
                    key={`featured-${product.id || index}`}
                    product={product}
                    viewMode="grid"
                    onSelect={() => setSelectedProduct(product)}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />
    </div>
  )
}

function MobileFilters({
  selectedBoneType,
  setSelectedBoneType,
  sortBy,
  setSortBy,
  onClearFilters,
}: {
  selectedBoneType: string
  setSelectedBoneType: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  onClearFilters: () => void
}) {
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-2 block">Tipo de Hueso</label>
        <Select value={selectedBoneType} onValueChange={setSelectedBoneType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {boneTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
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
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="price-low">Precio: Menor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor</SelectItem>
            <SelectItem value="featured">Destacados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onClearFilters} variant="outline" className="w-full">
        Limpiar Filtros
      </Button>
    </>
  )
}
