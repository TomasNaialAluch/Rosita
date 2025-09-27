import { Suspense } from "react"
import { getProducts } from "@/lib/products-db"
import { TiendaClient } from "./tienda-client"

export default async function TiendaPage() {
  // Cargar productos en el servidor (más rápido)
  const products = await getProducts()

    return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
    }>
      <TiendaClient products={products} />
    </Suspense>
  )
}