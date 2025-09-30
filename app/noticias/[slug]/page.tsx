import { getNewsBySlug, getPublishedNews } from "@/lib/news"
import type { Metadata } from "next"
import NewsArticlePageClient from "./NewsArticlePageClient"

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const news = await getPublishedNews()
    return news.map((article) => ({
      slug: article.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    // Retornar array vacío si hay error
    return []
  }
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
