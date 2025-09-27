import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore"
import { products as defaultProducts, type Product } from "@/lib/products"

// Helper para convertir datos de Firebase al tipo Product
const convertFirebaseProductToProduct = (doc: any, index: number): Product => {
  const data = doc.data()
  // Usar index + 1000 como ID si doc.id no es un número válido
  const productId = parseInt(doc.id) || (index + 1000)
  
  return {
    id: productId,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    description: data.description || "",
    image_url: data.image_url || data.image,
    image: data.image || data.image_url,
    featured: data.featured || false,
    sale_format: data.sale_format,
    stock: data.stock,
    minimum_kg: data.minimum_kg,
    minimumKg: data.minimumKg || data.minimum_kg,
    sellBy: data.sellBy,
    boneOptions: data.boneOptions || ["sin-hueso"],
    formatOptions: data.formatOptions || ["entero"],
    inStock: data.inStock !== false
  } as Product
}

export async function getProducts(): Promise<Product[]> {
  try {
    console.log("Fetching products from Firebase...")
    const q = query(collection(db, "products"), orderBy("created_at", "desc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.log("No products found in Firebase, returning default products.")
      return defaultProducts
    }

    const products = snapshot.docs.map((doc, index) => convertFirebaseProductToProduct(doc, index))

    console.log(`Loaded ${products.length} products from Firebase.`)
    return products
  } catch (error) {
    console.error("Firebase error fetching products:", error)
    console.log("Falling back to default products due to Firebase error.")
    return defaultProducts
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("featured", "==", true),
      where("inStock", "==", true),
      orderBy("created_at", "desc")
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return defaultProducts.filter((p) => p.featured && p.inStock)
    }

    const products = snapshot.docs.map((doc, index) => convertFirebaseProductToProduct(doc, index))

    return products
  } catch (error) {
    console.error("Critical error in getFeaturedProducts:", error)
    return defaultProducts.filter((p) => p.featured && p.inStock)
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    let q
    if (category !== "all") {
      q = query(
        collection(db, "products"),
        where("category", "==", category),
        orderBy("created_at", "desc")
      )
    } else {
      q = query(collection(db, "products"), orderBy("created_at", "desc"))
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return defaultProducts.filter((p) => category === "all" || p.category === category)
    }

    const products = snapshot.docs.map((doc, index) => convertFirebaseProductToProduct(doc, index))

    return products
  } catch (error) {
    console.error("Critical error in getProductsByCategory:", error)
    return defaultProducts.filter((p) => category === "all" || p.category === category)
  }
}

// Funciones de administración
export async function createProduct(productData: Partial<Product>): Promise<void> {
  try {
    await addDoc(collection(db, "products"), {
      ...productData,
      created_at: new Date(),
      updated_at: new Date()
    })
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<void> {
  try {
    await updateDoc(doc(db, "products", productId), {
      ...productData,
      updated_at: new Date()
    })
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "products", productId))
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
