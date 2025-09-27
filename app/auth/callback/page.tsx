import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get("next") ?? "/"

  // Callback simplificado para Firebase Auth
  // Firebase maneja la autenticación automáticamente
  return NextResponse.redirect(`${origin}${next}`)
}

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Procesando autenticación...</h1>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  )
}