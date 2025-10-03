import { getNewsBySlug, getPublishedNews } from "@/lib/news"
import type { Metadata } from "next"
import NewsArticlePageClient from "./NewsArticlePageClient"

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  // Durante el build, retornar array vacío para evitar errores de Firebase
  // Las páginas se generarán dinámicamente cuando sea necesario
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug)

  if (!article) {
    return {
      title: "Artículo no encontrado - Rosita Carnicería Premium",
    }
  }

  return {
    title: `${article.title} - Rosita Carnicería Premium`,
    description: article.excerpt || article.content.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.image_url ? [article.image_url] : [],
    },
  }
}

export default async function NewsArticlePage({ params }: Props) {
  return <NewsArticlePageClient params={params} />
}
