"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { type ContactInfo, getContactInfo } from "@/lib/contact-info"

export default function ContactoPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      const info = await getContactInfo()
      setContactInfo(info)
    } catch (error) {
      console.error("Error loading contact info:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-rosita-black mb-4">Contactanos</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos por cualquier consulta sobre nuestros productos o servicios.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rosita-pink">
                    <MapPin className="h-5 w-5" />
                    {contactInfo?.title || "Ubicación"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{contactInfo?.address}</p>
                  <p className="text-sm text-gray-600">{contactInfo?.content}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rosita-orange">
                    <Clock className="h-5 w-5" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-700">
                    {contactInfo?.hours?.lunes_viernes && (
                      <div className="flex justify-between">
                        <span>Lunes a Viernes:</span>
                        <span>{contactInfo.hours.lunes_viernes}</span>
                      </div>
                    )}
                    {contactInfo?.hours?.sabados && (
                      <div className="flex justify-between">
                        <span>Sábados:</span>
                        <span>{contactInfo.hours.sabados}</span>
                      </div>
                    )}
                    {contactInfo?.hours?.domingos && (
                      <div className="flex justify-between">
                        <span>Domingos:</span>
                        <span>{contactInfo.hours.domingos}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rosita-brown">
                    <Phone className="h-5 w-5" />
                    Contacto Directo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contactInfo?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-rosita-pink" />
                      <span className="text-gray-700">{contactInfo.phone}</span>
                    </div>
                  )}
                  {contactInfo?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-rosita-pink" />
                      <span className="text-gray-700">{contactInfo.email}</span>
                    </div>
                  )}
                  {contactInfo?.phone && (
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-4 w-4 text-rosita-pink" />
                      <span className="text-gray-700">WhatsApp: {contactInfo.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {contactInfo?.extra_info && (
                <div className="bg-rosita-pink/10 p-6 rounded-lg">
                  <p className="text-rosita-black whitespace-pre-line">{contactInfo.extra_info}</p>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-rosita-black">Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input id="nombre" placeholder="Tu nombre" required />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input id="apellido" placeholder="Tu apellido" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" required />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" type="tel" placeholder="+54 11 1234-5678" />
                  </div>

                  <div>
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input id="asunto" placeholder="¿En qué podemos ayudarte?" required />
                  </div>

                  <div>
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-rosita-pink hover:bg-rosita-pink/90">
                    Enviar Mensaje
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    * Campos obligatorios. Nos pondremos en contacto contigo dentro de las 24 horas.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
