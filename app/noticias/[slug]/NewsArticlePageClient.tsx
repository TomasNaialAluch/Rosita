"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Tag, Share2, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getNewsBySlug, getPublishedNews, type NewsArticle } from "@/lib/news"
import { Suspense } from "react"
import { notFound } from "next/navigation"

interface Props {
  params: {
    slug: string
  }
}

export default function NewsArticlePageClient({ params }: Props) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getNewsBySlug(params.slug)
        if (!fetchedArticle) {
          notFound()
          return
        }
        setArticle(fetchedArticle)

        const allNews = await getPublishedNews()
        const related = allNews
          .filter((news) => news.id !== fetchedArticle.id && news.category === fetchedArticle.category)
          .slice(0, 3)
        setRelatedNews(related)
      } catch (error) {
        console.error("Failed to fetch article:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

    return formatDate(dateString)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      productos: "bg-rosita-pink text-white",
      avisos: "bg-rosita-orange text-white",
      consejos: "bg-rosita-brown text-white",
      promociones: "bg-rosita-red text-white",
      general: "bg-gray-500 text-white",
    }
    return colors[category] || colors.general
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert("URL copiada al portapapeles")
    }
  }

  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((paragraph, index) => {
        if (paragraph.trim() === "") return null

        // Títulos (líneas que empiezan con **)
        if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
          const title = paragraph.slice(2, -2)
          return (
            <h3 key={index} className="text-xl font-bold text-rosita-black mt-6 mb-3">
              {title}
            </h3>
          )
        }

        // Listas (líneas que empiezan con -)
        if (paragraph.startsWith("- ")) {
          const listItem = paragraph.slice(2)
          return (
            <li key={index} className="ml-4 mb-2">
              {listItem}
            </li>
          )
        }

        // Párrafos normales
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        )
      })
      .filter(Boolean)
  }

  if (loading) {
    return <div>Cargando artículo...</div>
  }

  if (!article) {
    return <div>Artículo no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<div>Cargando artículo...</div>}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Botón volver */}
          <Button variant="ghost" asChild className="text-rosita-pink hover:text-rosita-pink/80 mb-6">
            <Link href="/noticias" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a noticias
            </Link>
          </Button>

          {/* Artículo principal */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Imagen hero */}
            {article.image_url && (
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={article.image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <Clock className="h-4 w-4" />
                  {getTimeAgo(article.published_at)}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </div>
              </div>

              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-rosita-black mb-4">{article.title}</h1>

              {/* Excerpt */}
              {article.excerpt && <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>}

              {/* Botón compartir */}
              <div className="flex justify-end mb-6">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>

              {/* Contenido */}
              <div className="prose prose-lg max-w-none">{formatContent(article.content)}</div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Noticias relacionadas */}
          {relatedNews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-rosita-black mb-6">Noticias Relacionadas</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedArticle.image_url && (
                      <div className="relative h-32 w-full">
                        <Image
                          src={relatedArticle.image_url || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <Badge className={getCategoryColor(relatedArticle.category)} size="sm" className="w-fit mb-2">
                        {relatedArticle.category}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2 hover:text-rosita-pink transition-colors">
                        <Link href={`/noticias/${relatedArticle.slug}`}>{relatedArticle.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {relatedArticle.excerpt && (
                        <CardDescription className="line-clamp-2 mb-3">{relatedArticle.excerpt}</CardDescription>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">{getTimeAgo(relatedArticle.published_at)}</div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/noticias/${relatedArticle.slug}`}>Leer</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Suspense>
      <Footer />
    </div>
  )
}
