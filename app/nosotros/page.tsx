import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Heart, Award, Users, MapPin } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="text-rosita-pink hover:text-rosita-pink/80">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      {/* Main Content - Replicating the exact design from the image */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo-completo.png"
              alt="Rosita Carnicería Premium"
              width={400}
              height={300}
              className="w-80 h-auto md:w-96"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-medium text-rosita-orange mb-8">
            Tradición familiar, calidad generación tras generación.
          </h2>
        </div>

        {/* Story Content - Exact text from the image */}
        <div className="space-y-8 text-center max-w-3xl mx-auto">
          <p className="text-lg md:text-xl leading-relaxed text-rosita-black font-medium">
            Desde hace 4 generaciones, nuestra familia ha dedicado su vida a la carne. Hoy, con la misma pasión de
            siempre, llevamos la tradición de Rosita al mundo digital. Nuestra abuela Rosita, con sus 92 años, sigue
            siendo nuestra inspiración y guía. Su legado de calidad y sabor auténtico se mantiene vivo en cada corte que
            seleccionamos.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-rosita-black font-medium">
            En Nuestra Tienda Online Rosita, creemos que la carne es más que un alimento: es una experiencia. Por eso,
            seleccionamos solo los mejores cortes, directamente del mayorista, y los llevamos a tu puerta con la misma
            frescura que si los hubieras elegido tú mismo en la carnicería. Nuestra abuela Rosita nos enseñó que la
            calidad no tiene precio, y ese es el compromiso que asumimos con cada cliente.
          </p>
        </div>

        {/* Grandmother Photo Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-rosita-pink mb-8">Conoce a nuestra fundadora</h3>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/abuela-rosita-nueva.png"
                alt="Abuela Rosita - Fundadora"
                width={400}
                height={400}
                className="w-64 h-64 md:w-80 md:h-80 object-contain"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-rosita-pink/5 to-rosita-orange/5 p-6 rounded-lg max-w-2xl mx-auto">
            <p className="text-lg text-rosita-black italic mb-4">
              "La calidad no tiene precio, y el sabor auténtico se logra con amor y dedicación."
            </p>
            <p className="text-rosita-pink font-semibold">- Rosita, 92 años, Fundadora</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-rosita-pink/10">
            <Heart className="h-12 w-12 text-rosita-pink mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-rosita-black mb-2">Tradición Familiar</h4>
            <p className="text-gray-600">
              4 generaciones transmitiendo el amor por la carne de calidad y el servicio excepcional.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-rosita-orange/10">
            <Award className="h-12 w-12 text-rosita-orange mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-rosita-black mb-2">Calidad Premium</h4>
            <p className="text-gray-600">
              Respaldados por Frigorífico La Trinidad S.A. con certificación de 5 estrellas.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-rosita-brown/10">
            <Users className="h-12 w-12 text-rosita-brown mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-rosita-black mb-2">Compromiso</h4>
            <p className="text-gray-600">
              Cada cliente es parte de nuestra familia. Tu satisfacción es nuestro mayor logro.
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-16 bg-gradient-to-r from-rosita-pink to-rosita-orange text-white p-8 rounded-lg text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Visítanos</h3>
          <p className="text-lg mb-2">C. Jose E. Rodo 6341</p>
          <p className="text-lg mb-6">C1440 Ciudad Autónoma de Buenos Aires</p>
          <p className="text-sm opacity-90">
            También trabajamos de forma online para llevarte la mejor carne directamente a tu hogar
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-rosita-black mb-4">¿Listo para probar la diferencia?</h3>
          <p className="text-gray-600 mb-6">Descubre por qué 4 generaciones de familias confían en nosotros</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-rosita-pink hover:bg-rosita-pink/90">
              <Link href="/tienda">Explorar Productos</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-rosita-pink text-rosita-pink hover:bg-rosita-pink hover:text-white"
            >
              <Link href="/contacto">Contactanos</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
