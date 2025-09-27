import type { Metadata } from "next"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NewsPageContent } from "./news-page-content"

export const metadata: Metadata = {
  title: "Noticias - Rosita Carnicería Premium",
  description: "Mantente al día con las últimas noticias, consejos y novedades de Rosita Carnicería Premium.",
}

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <NewsPageContent />
      </Suspense>
      <Footer />
    </div>
  )
}
