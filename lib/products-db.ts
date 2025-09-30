import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, Timestamp } from "firebase/firestore"
import { products as defaultProducts, type Product } from "@/lib/products"
import { cache } from "@/lib/cache"

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
  // Verificar caché primero
  const cached = cache.get<Product[]>("products");
  if (cached) {
    return cached;
  }

  try {
    const q = query(collection(db, "products"), orderBy("created_at", "desc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Retornar array vacío en lugar de productos hardcodeados
      cache.set("products", [], 2 * 60 * 1000);
      return []
    }

    const products = snapshot.docs.map((doc, index) => convertFirebaseProductToProduct(doc, index))

    cache.set("products", products, 5 * 60 * 1000);
    return products
  } catch (error) {
    console.error("Firebase error fetching products:", error)
    // Retornar array vacío en lugar de productos hardcodeados
    cache.set("products", [], 1 * 60 * 1000);
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Verificar caché primero
  const cached = cache.get<Product[]>("featured-products");
  if (cached) {
    return cached;
  }

  try {
    // Simplificar la query para evitar el error de índice
    const q = query(
      collection(db, "products"),
      where("featured", "==", true),
      orderBy("name", "asc")
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Retornar array vacío en lugar de productos hardcodeados
      cache.set("featured-products", [], 2 * 60 * 1000);
      return [];
    }

    const products = snapshot.docs
      .map((doc, index) => convertFirebaseProductToProduct(doc, index))
      .filter(product => product.inStock) // Filtrar inStock en el cliente

    cache.set("featured-products", products, 5 * 60 * 1000);
    return products
  } catch (error) {
    console.error("Critical error in getFeaturedProducts:", error)
    // Retornar array vacío en lugar de productos hardcodeados
    cache.set("featured-products", [], 1 * 60 * 1000);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Verificar caché primero
  const cacheKey = `products-${category}`;
  const cached = cache.get<Product[]>(cacheKey);
  if (cached) {
    console.log(`Using cached products for category: ${category}`);
    return cached;
  }

  try {
    let q
    if (category !== "all") {
      q = query(
        collection(db, "products"),
        where("category", "==", category),
        orderBy("name", "asc")
      )
    } else {
      q = query(collection(db, "products"), orderBy("name", "asc"))
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      const filteredProducts = defaultProducts.filter((p) => category === "all" || p.category === category);
      cache.set(cacheKey, filteredProducts, 5 * 60 * 1000);
      return filteredProducts;
    }

    const products = snapshot.docs.map((doc, index) => convertFirebaseProductToProduct(doc, index))
    cache.set(cacheKey, products, 5 * 60 * 1000);
    return products
  } catch (error) {
    console.error("Critical error in getProductsByCategory:", error)
    const filteredProducts = defaultProducts.filter((p) => category === "all" || p.category === category);
    cache.set(cacheKey, filteredProducts, 1 * 60 * 1000);
    return filteredProducts;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  // Verificar caché primero
  const cacheKey = `product-${id}`;
  const cached = cache.get<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Buscar en productos cargados primero
    const allProducts = await getProducts();
    const product = allProducts.find((p) => p.id === id);
    
    if (product) {
      cache.set(cacheKey, product, 10 * 60 * 1000); // Cache por 10 minutos
      return product;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
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
