import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, Timestamp } from "firebase/firestore"
import { cache } from "@/lib/cache"

export interface NewsArticle {
  id: string // Cambiado a string para Firebase
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
  slug?: string
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
  id: string
}

// Función para generar slug automáticamente
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Convertir documento de Firebase a NewsArticle
function convertFirebaseNewsToNews(doc: any): NewsArticle {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    image_url: data.image_url || "",
    author: data.author || "Rosita Carnicería",
    category: data.category || "general",
    tags: data.tags || [],
    is_featured: data.is_featured || false,
    is_published: data.is_published !== false,
    published_at: data.published_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
  }
}

// Obtener noticias publicadas
export async function getPublishedNews(): Promise<NewsArticle[]> {
  try {
    // Verificar caché primero
    const cached = cache.get<NewsArticle[]>("published-news");
    if (cached) {
      return cached;
    }

    const q = query(
      collection(db, "news"),
      where("is_published", "==", true),
      orderBy("published_at", "desc")
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      // Retornar array vacío en lugar de noticias de ejemplo
      cache.set("published-news", [], 2 * 60 * 1000);
      return []
    }

    const news = snapshot.docs.map(convertFirebaseNewsToNews)
    
    cache.set("published-news", news, 5 * 60 * 1000);
    return news
  } catch (error) {
    console.error("Firebase error fetching published news:", error)
    // Retornar array vacío en lugar de noticias de ejemplo
    cache.set("published-news", [], 1 * 60 * 1000);
    return []
  }
}

// Obtener todas las noticias (para admin)
export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    // Verificar caché primero
    const cached = cache.get<NewsArticle[]>("all-news");
    if (cached) {
      return cached;
    }

    const q = query(collection(db, "news"), orderBy("created_at", "desc"))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      // Retornar array vacío en lugar de noticias de ejemplo
      cache.set("all-news", [], 2 * 60 * 1000);
      return []
    }

    const news = snapshot.docs.map(convertFirebaseNewsToNews)
    
    cache.set("all-news", news, 5 * 60 * 1000);
    return news
  } catch (error) {
    console.error("Firebase error fetching all news:", error)
    // Retornar array vacío en lugar de noticias de ejemplo
    cache.set("all-news", [], 1 * 60 * 1000);
    return []
  }
}

// Obtener noticia por slug
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const q = query(collection(db, "news"), where("slug", "==", slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return null
    }

    return convertFirebaseNewsToNews(snapshot.docs[0])
  } catch (error) {
    console.error("Firebase error fetching news by slug:", error)
    return null
  }
}

// Crear nueva noticia
export async function createNews(newsData: CreateNewsArticle): Promise<NewsArticle | null> {
  try {
    const now = Timestamp.now()
    const slug = newsData.slug || generateSlug(newsData.title)
    
    const articleData = {
      title: newsData.title,
      slug,
      excerpt: newsData.excerpt || "",
      content: newsData.content,
      image_url: newsData.image_url || "",
      author: newsData.author || "Rosita Carnicería",
      category: newsData.category || "general",
      tags: newsData.tags || [],
      is_featured: newsData.is_featured || false,
      is_published: newsData.is_published !== false,
      published_at: newsData.is_published !== false ? now : null,
      created_at: now,
      updated_at: now,
    }

    const docRef = await addDoc(collection(db, "news"), articleData)
    
    // Limpiar cache
    cache.delete("published-news")
    cache.delete("all-news")
    
    const newArticle: NewsArticle = {
      id: docRef.id,
      title: articleData.title,
      slug: articleData.slug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      image_url: articleData.image_url,
      author: articleData.author,
      category: articleData.category,
      tags: articleData.tags,
      is_featured: articleData.is_featured,
      is_published: articleData.is_published,
      published_at: articleData.published_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      created_at: articleData.created_at.toDate().toISOString(),
      updated_at: articleData.updated_at.toDate().toISOString(),
    }

    return newArticle
  } catch (error) {
    console.error("Firebase error creating news:", error)
    return null
  }
}

// Actualizar noticia
export async function updateNews(newsData: UpdateNewsArticle): Promise<NewsArticle | null> {
  try {
    const now = Timestamp.now()
    const slug = newsData.slug || (newsData.title ? generateSlug(newsData.title) : undefined)
    
    const updateData: any = {
      updated_at: now,
    }

    if (newsData.title) updateData.title = newsData.title
    if (slug) updateData.slug = slug
    if (newsData.excerpt !== undefined) updateData.excerpt = newsData.excerpt
    if (newsData.content) updateData.content = newsData.content
    if (newsData.image_url !== undefined) updateData.image_url = newsData.image_url
    if (newsData.author) updateData.author = newsData.author
    if (newsData.category) updateData.category = newsData.category
    if (newsData.tags) updateData.tags = newsData.tags
    if (newsData.is_featured !== undefined) updateData.is_featured = newsData.is_featured
    if (newsData.is_published !== undefined) {
      updateData.is_published = newsData.is_published
      if (newsData.is_published && !updateData.published_at) {
        updateData.published_at = now
      }
    }

    await updateDoc(doc(db, "news", newsData.id), updateData)
    
    // Limpiar cache
    cache.delete("published-news")
    cache.delete("all-news")
    
    // Obtener la noticia actualizada
    const updatedNews = await getNewsBySlug(updateData.slug || newsData.id)
    return updatedNews
  } catch (error) {
    console.error("Firebase error updating news:", error)
    return null
  }
}

// Eliminar noticia
export async function deleteNews(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "news", id))
    
    // Limpiar cache
    cache.delete("published-news")
    cache.delete("all-news")
    
    return true
  } catch (error) {
    console.error("Firebase error deleting news:", error)
    return false
  }
}

// Noticias por defecto (fallback)
function getDefaultNews(): NewsArticle[] {
  return [
    {
      id: "1",
      title: "Nueva Línea de Cortes Premium",
      slug: "nueva-linea-cortes-premium",
      excerpt: "Descubre nuestra nueva selección de cortes premium seleccionados especialmente para ti.",
      content: `
        <h2>¡Presentamos nuestra nueva línea de cortes premium!</h2>
        <p>En Rosita Carnicería estamos orgullosos de presentar nuestra nueva selección de cortes premium, cuidadosamente seleccionados para ofrecerte la mejor calidad.</p>
        
        <h3>¿Qué incluye esta nueva línea?</h3>
        <ul>
          <li><strong>Cortes Angus:</strong> Carne de la más alta calidad</li>
          <li><strong>Cortes Wagyu:</strong> La experiencia gastronómica definitiva</li>
          <li><strong>Cortes Orgánicos:</strong> Sin conservantes ni aditivos</li>
        </ul>
        
        <p>Visita nuestra tienda y descubre estos increíbles cortes que elevarán tus comidas al siguiente nivel.</p>
      `,
      image_url: "/images/news/cortes-premium.jpg",
      author: "Rosita Carnicería",
      category: "productos",
      tags: ["cortes", "premium", "calidad"],
      is_featured: true,
      is_published: true,
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Horarios Especiales para las Fiestas",
      slug: "horarios-especiales-fiestas",
      excerpt: "Conoce nuestros horarios especiales durante las fiestas de fin de año.",
      content: `
        <h2>Horarios especiales para las fiestas</h2>
        <p>Durante las fiestas de fin de año, hemos ajustado nuestros horarios para brindarte el mejor servicio.</p>
        
        <h3>Horarios de atención:</h3>
        <ul>
          <li><strong>24 de Diciembre:</strong> 8:00 - 14:00</li>
          <li><strong>25 de Diciembre:</strong> Cerrado</li>
          <li><strong>31 de Diciembre:</strong> 8:00 - 14:00</li>
          <li><strong>1 de Enero:</strong> Cerrado</li>
        </ul>
        
        <p>¡Asegúrate de hacer tus pedidos con anticipación para las fiestas!</p>
      `,
      image_url: "/images/news/horarios-fiestas.jpg",
      author: "Rosita Carnicería",
      category: "avisos",
      tags: ["horarios", "fiestas", "navidad"],
      is_featured: false,
      is_published: true,
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Consejos para Conservar Carne Fresca",
      slug: "consejos-conservar-carne-fresca",
      excerpt: "Aprende las mejores técnicas para conservar la frescura y calidad de tu carne.",
      content: `
        <h2>Consejos para conservar carne fresca</h2>
        <p>La conservación adecuada de la carne es fundamental para mantener su sabor, textura y valor nutricional.</p>
        
        <h3>Consejos básicos:</h3>
        <ul>
          <li><strong>Refrigeración:</strong> Mantén la carne entre 0°C y 4°C</li>
          <li><strong>Congelación:</strong> Para almacenamiento prolongado, congela a -18°C</li>
          <li><strong>Embalaje:</strong> Usa papel de carnicería o bolsas herméticas</li>
          <li><strong>Tiempo:</strong> Consume dentro de los tiempos recomendados</li>
        </ul>
        
        <h3>Tiempos de conservación:</h3>
        <ul>
          <li><strong>Refrigerador:</strong> 3-5 días</li>
          <li><strong>Congelador:</strong> 6-12 meses</li>
        </ul>
      `,
      image_url: "/images/news/conservacion-carne.jpg",
      author: "Rosita Carnicería",
      category: "consejos",
      tags: ["conservación", "calidad", "frescura"],
      is_featured: false,
      is_published: true,
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
}