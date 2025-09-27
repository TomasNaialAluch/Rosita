import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Clock, Award, Users, Heart } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { WelcomeBanner } from "@/components/welcome-banner"
import { RegistrationPrompt } from "@/components/registration-prompt"
import { FloatingCTA } from "@/components/floating-cta"
import { getFeaturedProducts } from "@/lib/products-db"

export default async function HomePage() {
  // Usar la función optimizada con caché
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen">
      <WelcomeBanner />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rosita-pink via-pink-700 to-rosita-pink text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  <Award className="w-4 h-4 mr-2" />
                  Carnicería Premium desde 1985
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  La mejor carne de
                  <span className="text-yellow-400"> Buenos Aires</span>
                </h1>
                <p className="text-xl text-red-100 leading-relaxed">
                  Tradición familiar, calidad premium y el sabor auténtico que buscás. Más de 35 años llevando lo mejor
                  a tu mesa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Link href="/tienda">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ver Productos
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-red-900 bg-transparent"
                >
                  <Link href="/nosotros">Nuestra Historia</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-red-100">4.9/5 (500+ reseñas)</span>
                </div>
                <div className="flex items-center gap-2 text-red-100">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">+2000 clientes satisfechos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/images/logo-completo.png"
                  alt="Rosita Carnicería Premium"
                  width={500}
                  height={400}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Los Favoritos
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los cortes más elegidos por nuestros clientes, seleccionados por su calidad excepcional
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Cargando productos destacados...</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/tienda">Ver Todos los Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Rosita?</h2>
            <p className="text-xl text-gray-600">Más de tres décadas de experiencia nos respaldan</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Calidad Premium</h3>
              <p className="text-gray-600">
                Seleccionamos cuidadosamente cada corte para garantizar la máxima calidad y frescura
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Entrega Rápida</h3>
              <p className="text-gray-600">Delivery en el día en CABA y GBA. Tu pedido fresco y en tiempo récord</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Tradición Familiar</h3>
              <p className="text-gray-600">
                Tres generaciones dedicadas al arte de la carnicería, con el amor de siempre
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Nuestra Historia
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Desde 1985, la tradición continúa</h2>
              <p className="text-lg text-gray-600 mb-6">
                Todo comenzó con la abuela Rosita y su pasión por ofrecer la mejor carne del barrio. Hoy, tres
                generaciones después, seguimos con el mismo compromiso de calidad y el trato familiar que nos
                caracteriza.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Cada corte es seleccionado personalmente, cada cliente es tratado como familia, y cada entrega lleva el
                sello de calidad que nos distingue desde hace más de 35 años.
              </p>
              <Button asChild size="lg">
                <Link href="/nosotros">Conocé Nuestra Historia Completa</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/abuela-rosita-nueva.png"
                alt="La historia de Rosita Carnicería"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <RegistrationPrompt />
      <FloatingCTA />
    </div>
  )
}
