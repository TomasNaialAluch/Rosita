"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Tag, Share2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { NewsArticle } from "@/lib/news"

const categoryColors = {
  productos: "bg-rosita-pink text-white",
  avisos: "bg-rosita-orange text-white",
  consejos: "bg-rosita-brown text-white",
  general: "bg-gray-500 text-white",
  promociones: "bg-rosita-red text-white",
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n- /g, "</p><ul><li>")
    .replace(/\n/g, "<br>")
}

interface Props {
  article: NewsArticle
  relatedNews: NewsArticle[]
}

export function NewsArticleContent({ article, relatedNews }: Props) {
  const handleShare = async () => {
    if (navigator.share) {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-rosita-pink hover:text-rosita-pink/80">
          <Link href="/noticias" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a noticias
          </Link>
        </Button>
      </div>

      {/* Artículo Principal */}
      <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
        {/* Imagen Hero */}
        {article.image_url && (
          <div className="relative h-64 md:h-96">
            <Image
              src={article.image_url || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge
                className={`${
                  categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                }`}
              >
                {article.category}
              </Badge>
              {article.is_featured && <Badge className="bg-rosita-red text-white">Destacada</Badge>}
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Header del Artículo */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-rosita-black mb-4">{article.title}</h1>

            {article.excerpt && <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1 bg-transparent"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Contenido del Artículo */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: `<p>${formatContent(article.content)}</p>`,
              }}
              className="text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      </article>

      {/* Artículos Relacionados */}
      {relatedNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-rosita-black mb-6">Artículos Relacionados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedNews.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={relatedArticle.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={relatedArticle.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      categoryColors[relatedArticle.category as keyof typeof categoryColors] || categoryColors.general
                    }`}
                  >
                    {relatedArticle.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{relatedArticle.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{relatedArticle.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{relatedArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(relatedArticle.published_at)}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/noticias/${relatedArticle.slug}`}>
                      Leer más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
