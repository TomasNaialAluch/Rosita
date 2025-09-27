export interface Product {
  id: number
  name: string
  price: number
  category: "vacuno" | "cerdo" | "pollo" | "cordero"
  description?: string
  image_url?: string
  image?: string
  featured?: boolean
  sale_format?: string
  stock?: number
  minimum_kg?: number
  minimumKg?: number
  pricePerKilo?: number
  weight?: string
  sellBy?: "unidad" | "kilo" | "both"
  boneOptions?: ("con-hueso" | "sin-hueso")[]
  formatOptions?: string[]
  inStock?: boolean
}

// Productos de demostración para cuando no hay base de datos
const demoProducts: Product[] = [
  {
    id: 1,
    name: "Asado de Tira",
    price: 2800,
    category: "vacuno",
    description: "Corte tradicional argentino, ideal para asado a la parrilla",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por kg",
    stock: 50,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 2,
    name: "Bife de Chorizo",
    price: 3200,
    category: "vacuno",
    description: "Corte premium, tierno y jugoso",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por kg",
    stock: 30,
    minimum_kg: 0.5,
    minimumKg: 0.5,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 3,
    name: "Vacío",
    price: 2900,
    category: "vacuno",
    description: "Corte magro y sabroso, perfecto para parrilla",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por kg",
    stock: 25,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 4,
    name: "Matambre",
    price: 2600,
    category: "vacuno",
    description: "Ideal para matambre relleno o a la pizza",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
    sale_format: "Por kg",
    stock: 20,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 5,
    name: "Costillas de Cerdo",
    price: 2200,
    category: "cerdo",
    description: "Costillas tiernas, perfectas para barbacoa",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por kg",
    stock: 35,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 6,
    name: "Bondiola",
    price: 2400,
    category: "cerdo",
    description: "Corte jugoso y sabroso del cerdo",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
    sale_format: "Por kg",
    stock: 28,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 7,
    name: "Pollo Entero",
    price: 1800,
    category: "pollo",
    description: "Pollo fresco de granja",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por unidad",
    stock: 40,
    minimum_kg: 1.5,
    minimumKg: 1.5,
    sellBy: "unidad",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 8,
    name: "Pechuga de Pollo",
    price: 2100,
    category: "pollo",
    description: "Pechuga sin hueso, ideal para milanesas",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
    sale_format: "Por kg",
    stock: 32,
    minimum_kg: 0.5,
    minimumKg: 0.5,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 9,
    name: "Cordero Patagónico",
    price: 3800,
    category: "cordero",
    description: "Cordero premium de la Patagonia",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    sale_format: "Por kg",
    stock: 15,
    minimum_kg: 2,
    minimumKg: 2,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
  {
    id: 10,
    name: "Chuletas de Cordero",
    price: 4200,
    category: "cordero",
    description: "Chuletas tiernas y sabrosas",
    image_url: "/placeholder.svg?height=300&width=300",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
    sale_format: "Por kg",
    stock: 12,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
  },
]

export async function getProducts(): Promise<Product[]> {
  try {
    const { db } = await import("./firebase")
    const { collection, getDocs, query, orderBy } = await import("firebase/firestore")
    
    const q = query(
      collection(db, "products"),
      orderBy("featured", "desc"),
      orderBy("name", "asc")
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn("No products found in database, using demo data")
      return demoProducts
    }

    const products = snapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    } as Product))

    return products || demoProducts
  } catch (error) {
    console.warn("Database not available, using demo products:", error)
    return demoProducts
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.featured)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.category === category)
}

export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts()
  return products.find((product) => product.id === id) || null
}

// Exportar productos por defecto para compatibilidad
export { demoProducts as products }

// Categorías disponibles
export const categories = [
  { id: "all", name: "Todos", icon: "🥩" },
  { id: "vacuno", name: "Vacuno", icon: "🐄" },
  { id: "cerdo", name: "Cerdo", icon: "🐷" },
  { id: "pollo", name: "Pollo", icon: "🐔" },
  { id: "cordero", name: "Cordero", icon: "🐑" },
]

// Tipos de hueso disponibles
export const boneTypes = [
  { id: "all", name: "Todos" },
  { id: "con-hueso", name: "Con hueso" },
  { id: "sin-hueso", name: "Sin hueso" },
]
