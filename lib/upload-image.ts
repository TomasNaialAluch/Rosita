// Función para subir imagen a Vercel Blob
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validar el archivo
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "El archivo debe ser una imagen" }
    }

    // Validar el tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "La imagen no puede ser mayor a 5MB" }
    }

    // Crear FormData
    const formData = new FormData()
    formData.append("file", file)

    // Subir a Vercel Blob
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || "Error al subir la imagen" }
    }

    const data = await response.json()
    return { success: true, url: data.url }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Función para validar URL de imagen
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const pathname = urlObj.pathname.toLowerCase()

    // Permitir placeholder URLs
    if (pathname.includes("placeholder.svg")) {
      return true
    }

    // Validar extensiones de imagen
    return validExtensions.some((ext) => pathname.endsWith(ext))
  } catch {
    return false
  }
}

// Función para generar nombre único de archivo
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split(".").pop()
  return `product-${timestamp}-${randomString}.${extension}`
}
