import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import RecipePageContent from "./recipe-page-content"

export const metadata: Metadata = {
  title: "Recetas - Rosita Carnicería Premium",
  description:
    "Descubre recetas tradicionales argentinas con nuestros mejores cortes de carne. Chef virtual con IA para recetas personalizadas.",
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <RecipePageContent />
      <Footer />
    </div>
  )
}
