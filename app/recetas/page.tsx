import type { Metadata } from "next"
import RecipePageContent from "./recipe-page-content"

export const metadata: Metadata = {
  title: "Recetas - Rosita Carnicería Premium",
  description:
    "Descubre recetas tradicionales argentinas con nuestros mejores cortes de carne. Chef virtual con IA para recetas personalizadas.",
}

export default function RecipesPage() {
  return <RecipePageContent />
}
