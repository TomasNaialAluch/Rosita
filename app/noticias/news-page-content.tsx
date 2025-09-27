"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, User, Tag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublishedNews, type NewsArticle } from "@/lib/news"

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

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Hace menos de 1 hora"
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? "s" : ""}`

  return formatDate(dateString)
}

export function NewsPageContent() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    async function loadNews() {
      try {
        const newsData = await getPublishedNews()
        setNews(newsData)
        setFilteredNews(newsData)
      } catch (error) {
        console.error("Error loading news:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    let filtered = news

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredNews(filtered)
  }, [news, searchTerm, selectedCategory])

  const categories = Array.from(new Set(news.map((article) => article.category)))
  const featuredNews = news.filter((article) => article.is_featured)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando noticias...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-rosita-black mb-4">Noticias y Novedades</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mantente al día con las últimas noticias, consejos y novedades de Rosita Carnicería Premium
        </p>
      </div>

      {/* Noticias Destacadas */}
      {featuredNews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-rosita-black mb-6">Noticias Destacadas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNews.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={article.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-rosita-red text-white">Destacada</Badge>
                  <Badge
                    className={`absolute top-3 right-3 ${
                      categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                    }`}
                  >
                    {article.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getTimeAgo(article.published_at)}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-rosita-pink hover:bg-rosita-pink/90">
                    <Link href={`/noticias/${article.slug}`}>
                      Leer más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-rosita-pink hover:bg-rosita-pink/90" : ""}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? `${categoryColors[category as keyof typeof categoryColors] || categoryColors.general}`
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Noticias */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No se encontraron noticias que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={article.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-3 right-3 ${
                    categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                  }`}
                >
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{getTimeAgo(article.published_at)}</span>
                  </div>
                </div>
                {article.tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-4">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex gap-1 flex-wrap">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/noticias/${article.slug}`}>
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
