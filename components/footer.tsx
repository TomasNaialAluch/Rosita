import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-rosita-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo-footer.png" alt="Rosita Carnicería" width={40} height={40} />
              <span className="font-bold text-xl">Rosita</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Carnicería premium con 4 generaciones de tradición familiar. Calidad certificada por Frigorífico La
              Trinidad S.A.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tienda" className="text-gray-300 hover:text-rosita-pink transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/recetas" className="text-gray-300 hover:text-rosita-pink transition-colors">
                  Recetas
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-300 hover:text-rosita-pink transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-rosita-pink transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-rosita-pink flex-shrink-0" />
                <span className="text-gray-300">C. Jose E. Rodo 6341, C1440 CABA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rosita-pink" />
                <span className="text-gray-300">+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rosita-pink" />
                <span className="text-gray-300">info@rositacarniceria.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Horarios</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rosita-pink" />
                <span>Lun - Vie: 8:00 - 20:00</span>
              </li>
              <li className="ml-6">Sáb: 8:00 - 18:00</li>
              <li className="ml-6">Dom: 9:00 - 14:00</li>
            </ul>
            <div className="mt-4 p-3 bg-rosita-pink/10 rounded-lg">
              <p className="text-xs text-gray-300">
                <strong className="text-white">Respaldados por:</strong>
                <br />
                Frigorífico La Trinidad S.A.
                <br />
                Certificación 5 Estrellas
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Rosita Carnicería Premium. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
