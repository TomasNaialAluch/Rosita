"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react"
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  generateSlug,
  type NewsArticle,
  type CreateNewsArticle,
} from "@/lib/news"

interface NewsManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

const categoryOptions = [
  { value: "productos", label: "Productos" },
  { value: "avisos", label: "Avisos" },
  { value: "consejos", label: "Consejos" },
  { value: "promociones", label: "Promociones" },
  { value: "general", label: "General" },
]

const categoryColors = {
  productos: "bg-rosita-pink text-white",
  avisos: "bg-rosita-orange text-white",
  consejos: "bg-rosita-brown text-white",
  general: "bg-gray-500 text-white",
  promociones: "bg-rosita-red text-white",
}

export function NewsManagementModal({ isOpen, onClose }: NewsManagementModalProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState<CreateNewsArticle>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "Rosita Carnicería",
    category: "general",
    tags: [],
    is_featured: false,
    is_published: true,
  })

  useEffect(() => {
    if (isOpen) {
      loadNews()
    }
  }, [isOpen])

  const loadNews = async () => {
    setLoading(true)
    try {
      const newsData = await getAllNews()
      setNews(newsData || [])
    } catch (error) {
      console.error("Error loading news:", error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingNews) {
        const updated = await updateNews({ ...formData, id: editingNews.id })
        if (updated) {
          setNews(news.map((item) => (item.id === editingNews.id ? updated : item)))
        }
      } else {
        const created = await createNews(formData)
        if (created) {
          setNews([created, ...news])
        }
      }
      resetForm()
    } catch (error) {
      console.error("Error saving news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      image_url: article.image_url || "",
      author: article.author,
      category: article.category,
      tags: article.tags,
      is_featured: article.is_featured,
      is_published: article.is_published,
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta noticia?")) {
      setLoading(true)
      try {
        const success = await deleteNews(id)
        if (success) {
          setNews(news.filter((item) => item.id !== id))
        }
      } catch (error) {
        console.error("Error deleting news:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      author: "Rosita Carnicería",
      category: "general",
      tags: [],
      is_featured: false,
      is_published: true,
    })
    setEditingNews(null)
    setIsFormOpen(false)
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setFormData({ ...formData, tags })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Noticias</DialogTitle>
          <DialogDescription>Administra las noticias y artículos del sitio web</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Noticias</TabsTrigger>
            <TabsTrigger value="form" onClick={() => setIsFormOpen(true)}>
              {editingNews ? "Editar Noticia" : "Nueva Noticia"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Noticias Publicadas</h3>
              <Button
                onClick={() => {
                  resetForm()
                  setIsFormOpen(true)
                }}
                className="bg-rosita-pink hover:bg-rosita-pink/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Noticia
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rosita-pink"></div>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No hay noticias disponibles
                        </TableCell>
                      </TableRow>
                    ) : (
                      news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{article.title}</div>
                              {article.is_featured && (
                                <Badge className="mt-1 bg-rosita-red text-white text-xs">Destacada</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                categoryColors[article.category as keyof typeof categoryColors] ||
                                categoryColors.general
                              }
                            >
                              {article.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {article.author}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(article.published_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={article.is_published ? "default" : "secondary"}>
                              {article.is_published ? "Publicada" : "Borrador"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/noticias/${article.slug}`, "_blank")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(article.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{editingNews ? "Editar Noticia" : "Nueva Noticia"}</CardTitle>
                <CardDescription>
                  {editingNews ? "Modifica los datos de la noticia" : "Completa los datos para crear una nueva noticia"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Título de la noticia"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="url-de-la-noticia"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumen</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Breve descripción de la noticia"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Contenido completo de la noticia"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">URL de Imagen</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Nombre del autor"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (separados por comas)</Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(", ")}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Noticia destacada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                      <Label htmlFor="is_published">Publicar inmediatamente</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading} className="bg-rosita-pink hover:bg-rosita-pink/90">
                      {loading ? "Guardando..." : editingNews ? "Actualizar" : "Crear Noticia"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm()
                        setIsFormOpen(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
