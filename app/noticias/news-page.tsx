"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NewsPageContent } from "./news-page-content"

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<div>Cargando noticias...</div>}>
        <NewsPageContent />
      </Suspense>
      <Footer />
    </div>
  )
}
