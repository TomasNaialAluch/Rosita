import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore"

export interface NewsArticle {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  author: string
  category: string
  tags: string[]
  is_featured: boolean
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface CreateNewsArticle {
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  author?: string
  category?: string
  tags?: string[]
  is_featured?: boolean
  is_published?: boolean
}

export interface UpdateNewsArticle extends Partial<CreateNewsArticle> {
  id: number
}

export interface Comment {
  id: number
  article_id: number
  user_id: string
  user_name: string
  content: string
  created_at: string
}

// Función para generar slug automáticamente
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Remover guiones duplicados
    .trim()
}

// Obtener todas las noticias publicadas
export async function getPublishedNews(): Promise<NewsArticle[]> {
  try {
    console.log("Fetching published news from Firebase...")
    
    const q = query(
      collection(db, "news"),
      where("is_published", "==", true),
      orderBy("published_at", "desc")
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.log("No news found in Firebase, returning default news.")
      return getDefaultNews()
    }

    const news = snapshot.docs.map((doc, index) => ({
      id: parseInt(doc.id) || (index + 1000),
      ...doc.data()
    })) as NewsArticle[]

    return news
  } catch (error) {
    console.error("Error fetching published news:", error)
    return getDefaultNews()
  }
}

// Obtener todas las noticias (para admin)
export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    console.log("Fetching all news...")

    // Verificar si estamos usando el admin especial
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const adminData = JSON.parse(adminUser)
        if (adminData.email === "ELTETE@gmail.com") {
          console.log("Using admin special - loading all from localStorage")
          const storedNews = localStorage.getItem("admin-news")
          if (storedNews) {
            return JSON.parse(storedNews)
          }
          // Inicializar con noticias por defecto
          const defaultNews = getDefaultNews()
          localStorage.setItem("admin-news", JSON.stringify(defaultNews))
          return defaultNews
        }
      }
    }

    // Intentar obtener de Supabase
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      console.log("Supabase error, using default news:", error.message)
      return getDefaultNews()
    }

    console.log("All news fetched successfully:", data?.length)
    return data || []
  } catch (error) {
    console.log("Error fetching all news, using defaults:", error)
    return getDefaultNews()
  }
}

// Obtener noticia por slug
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    console.log("Fetching news by slug from Firebase:", slug)
    
    const q = query(
      collection(db, "news"),
      where("slug", "==", slug),
      where("is_published", "==", true)
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.log("No news found with slug:", slug)
      const defaultNews = getDefaultNews()
      return defaultNews.find((article) => article.slug === slug) || null
    }

    const doc = snapshot.docs[0]
    const article = {
      id: parseInt(doc.id) || 1000,
      ...doc.data()
    } as NewsArticle

    return article
  } catch (error) {
    console.error("Error fetching news by slug:", error)
    const defaultNews = getDefaultNews()
    return defaultNews.find((article) => article.slug === slug) || null
  }
}

// Alias para compatibilidad
export const getArticleBySlug = getNewsBySlug

// Obtener comentarios de un artículo (función placeholder)
export async function getArticleComments(articleId: number): Promise<Comment[]> {
  // Por ahora retornamos un array vacío
  // En el futuro se puede implementar con Supabase
  return []
}

// Verificar si el usuario ha dado like a un artículo (función placeholder)
export async function hasUserLikedArticle(articleId: number, userId: string): Promise<boolean> {
  // Por ahora retornamos false
  // En el futuro se puede implementar con Supabase
  return false
}

// Crear nueva noticia
export async function createNews(newsData: CreateNewsArticle): Promise<NewsArticle | null> {
  try {
    console.log("Creating news:", newsData.title)

    // Verificar si estamos usando el admin especial
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const adminData = JSON.parse(adminUser)
        if (adminData.email === "ELTETE@gmail.com") {
          console.log("Using admin special - saving to localStorage")

          const storedNews = localStorage.getItem("admin-news")
          const currentNews = storedNews ? JSON.parse(storedNews) : getDefaultNews()

          const newArticle: NewsArticle = {
            id: Date.now(), // ID único basado en timestamp
            title: newsData.title,
            slug: newsData.slug || generateSlug(newsData.title),
            excerpt: newsData.excerpt || "",
            content: newsData.content,
            image_url: newsData.image_url || "",
            author: newsData.author || "Rosita Carnicería",
            category: newsData.category || "general",
            tags: newsData.tags || [],
            is_featured: newsData.is_featured || false,
            is_published: newsData.is_published !== false,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          currentNews.unshift(newArticle)
          localStorage.setItem("admin-news", JSON.stringify(currentNews))
          console.log("News created successfully in localStorage")
          return newArticle
        }
      }
    }

    // Intentar crear en Supabase
    const articleData = {
      ...newsData,
      slug: newsData.slug || generateSlug(newsData.title),
      author: newsData.author || "Rosita Carnicería",
      category: newsData.category || "general",
      tags: newsData.tags || [],
      is_featured: newsData.is_featured || false,
      is_published: newsData.is_published !== false,
    }

    const { data, error } = await supabase.from("news").insert([articleData]).select().single()

    if (error) {
      console.error("Error creating news:", error)
      return null
    }

    console.log("News created successfully in Supabase")
    return data
  } catch (error) {
    console.error("Error creating news:", error)
    return null
  }
}

// Actualizar noticia
export async function updateNews(newsData: UpdateNewsArticle): Promise<NewsArticle | null> {
  try {
    console.log("Updating news:", newsData.id)

    // Verificar si estamos usando el admin especial
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const adminData = JSON.parse(adminUser)
        if (adminData.email === "ELTETE@gmail.com") {
          console.log("Using admin special - updating in localStorage")

          const storedNews = localStorage.getItem("admin-news")
          const currentNews = storedNews ? JSON.parse(storedNews) : []

          const index = currentNews.findIndex((article: NewsArticle) => article.id === newsData.id)
          if (index === -1) {
            console.error("News not found for update")
            return null
          }

          const updatedArticle = {
            ...currentNews[index],
            ...newsData,
            updated_at: new Date().toISOString(),
          }

          currentNews[index] = updatedArticle
          localStorage.setItem("admin-news", JSON.stringify(currentNews))
          console.log("News updated successfully in localStorage")
          return updatedArticle
        }
      }
    }

    // Intentar actualizar en Supabase
    const { id, ...updateData } = newsData

    const { data, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating news:", error)
      return null
    }

    console.log("News updated successfully in Supabase")
    return data
  } catch (error) {
    console.error("Error updating news:", error)
    return null
  }
}

// Eliminar noticia
export async function deleteNews(id: number): Promise<boolean> {
  try {
    console.log("Deleting news:", id)

    // Verificar si estamos usando el admin especial
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const adminData = JSON.parse(adminUser)
        if (adminData.email === "ELTETE@gmail.com") {
          console.log("Using admin special - deleting from localStorage")

          const storedNews = localStorage.getItem("admin-news")
          const currentNews = storedNews ? JSON.parse(storedNews) : []

          const filteredNews = currentNews.filter((article: NewsArticle) => article.id !== id)
          localStorage.setItem("admin-news", JSON.stringify(filteredNews))
          console.log("News deleted successfully from localStorage")
          return true
        }
      }
    }

    // Intentar eliminar de Supabase
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error("Error deleting news:", error)
      return false
    }

    console.log("News deleted successfully from Supabase")
    return true
  } catch (error) {
    console.error("Error deleting news:", error)
    return false
  }
}

// Noticias por defecto
function getDefaultNews(): NewsArticle[] {
  return [
    {
      id: 1,
      title: "Nueva línea de cortes premium disponible",
      slug: "nueva-linea-cortes-premium",
      excerpt:
        "Descubre nuestra nueva selección de cortes premium, cuidadosamente seleccionados para los paladares más exigentes.",
      content:
        "En Rosita Carnicería Premium nos complace anunciar el lanzamiento de nuestra nueva línea de cortes premium. Estos cortes han sido cuidadosamente seleccionados de los mejores proveedores de la región, garantizando la máxima calidad y frescura.\n\nNuestra nueva línea incluye:\n- Bife de chorizo premium\n- Ojo de bife madurado\n- Entraña especial\n- Vacío premium\n\nCada corte pasa por un riguroso proceso de selección y maduración para asegurar la mejor experiencia gastronómica. Visitanos en nuestra tienda o realiza tu pedido online.",
      image_url: "/placeholder.svg?height=400&width=600",
      author: "Rosita Carnicería",
      category: "productos",
      tags: ["premium", "cortes", "carne", "calidad"],
      is_featured: true,
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Horarios especiales para las fiestas",
      slug: "horarios-especiales-fiestas",
      excerpt: "Conoce nuestros horarios especiales durante las fiestas navideñas y de fin de año.",
      content:
        "Durante las fiestas navideñas y de fin de año, Rosita Carnicería Premium tendrá horarios especiales para mejor atenderte:\n\n**Diciembre:**\n- 24 de diciembre: 8:00 a 14:00\n- 25 de diciembre: CERRADO\n- 31 de diciembre: 8:00 a 16:00\n\n**Enero:**\n- 1 de enero: CERRADO\n- A partir del 2 de enero: horarios normales\n\nTe recomendamos realizar tus pedidos con anticipación para garantizar la disponibilidad de todos los productos que necesitas para tus celebraciones.",
      image_url: "/placeholder.svg?height=400&width=600",
      author: "Rosita Carnicería",
      category: "avisos",
      tags: ["horarios", "fiestas", "navidad", "avisos"],
      is_featured: false,
      is_published: true,
      published_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      title: "Consejos para conservar la carne fresca",
      slug: "consejos-conservar-carne-fresca",
      excerpt: "Aprende los mejores métodos para mantener la carne fresca por más tiempo y conservar su sabor.",
      content:
        "La correcta conservación de la carne es fundamental para mantener su calidad, sabor y propiedades nutricionales. Aquí te compartimos algunos consejos esenciales:\n\n**Refrigeración:**\n- Mantén la carne entre 0°C y 4°C\n- Usa la carne fresca dentro de 2-3 días\n- Coloca la carne en la parte más fría del refrigerador\n\n**Congelación:**\n- La carne puede congelarse hasta 6 meses\n- Envuelve bien para evitar quemaduras por frío\n- Descongela lentamente en el refrigerador\n\n**Envasado al vacío:**\n- Extiende la vida útil hasta 3 veces más\n- Mantiene el sabor y la textura\n- Ideal para compras grandes\n\nEn Rosita Carnicería ofrecemos servicio de envasado al vacío para todos nuestros productos.",
      image_url: "/placeholder.svg?height=400&width=600",
      author: "Rosita Carnicería",
      category: "consejos",
      tags: ["conservación", "tips", "carne", "frescura"],
      is_featured: false,
      is_published: true,
      published_at: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]
}
