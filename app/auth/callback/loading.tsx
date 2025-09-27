import { Loader2 } from "lucide-react"

export default function AuthCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rosita-pink/10 to-rosita-orange/10">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-rosita-pink mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Confirmando tu cuenta...</h2>
          <p className="text-gray-600">Por favor espera mientras procesamos tu confirmación</p>
        </div>
      </div>
    </div>
  )
}
