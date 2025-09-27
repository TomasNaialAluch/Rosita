import type { Metadata } from "next"
import NoticiasPage from "./news-page"

export const metadata: Metadata = {
  title: "Noticias - Rosita Carnicería Premium",
  description: "Mantente al día con las últimas noticias, consejos y novedades de Rosita Carnicería Premium.",
}

export default function Page() {
  return <NoticiasPage />
}
