import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { generateUniqueFileName } from "@/lib/upload-image"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede ser mayor a 5MB" }, { status: 400 })
    }

    // Generar nombre único
    const fileName = generateUniqueFileName(file.name)

    // Subir a Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
