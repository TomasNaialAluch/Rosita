import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, ShoppingBag, Heart } from "lucide-react"

export default function NewUserPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rosita-pink/10 via-white to-rosita-orange/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image src="/images/logo-completo.png" alt="Rosita Carnicería Premium" fill className="object-contain" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 h-20 w-20 text-green-500/20 animate-ping">
                <CheckCircle className="h-20 w-20" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-rosita-black mb-4">¡Bienvenido a la familia!</h1>

            <p className="text-xl text-gray-600 mb-2">Tu cuenta ha sido confirmada exitosamente</p>

            <p className="text-lg text-rosita-brown">Ya puedes disfrutar de nuestros productos premium</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-rosita-pink hover:bg-rosita-pink/90 text-white">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Ir al Inicio
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-rosita-orange text-rosita-orange hover:bg-rosita-orange hover:text-white bg-transparent"
            >
              <Link href="/tienda" className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Explorar Productos
              </Link>
            </Button>
          </div>

          {/* Welcome Card */}
          <Card className="border-rosita-pink/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-rosita-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-rosita-black mb-2">¡Gracias por elegirnos!</h3>
                  <p className="text-gray-600 mb-4">
                    En Rosita Carnicería Premium nos enorgullecemos de ofrecer las mejores carnes y productos gourmet de
                    la ciudad. Con más de 30 años de experiencia, garantizamos calidad y frescura en cada compra.
                  </p>
                  <div className="bg-rosita-orange/10 p-4 rounded-lg">
                    <p className="text-sm text-rosita-brown">
                      <strong>¿Sabías que?</strong> Todos nuestros productos son seleccionados cuidadosamente por
                      expertos carniceros y ofrecemos servicio de delivery gratuito en compras superiores a $15.000.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm">
              ¿Tienes alguna pregunta?{" "}
              <Link href="/contacto" className="text-rosita-pink hover:underline">
                Contáctanos aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
