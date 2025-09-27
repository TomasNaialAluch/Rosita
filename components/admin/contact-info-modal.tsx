"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { type ContactInfo, getContactInfo, updateContactInfo } from "@/lib/contact-info"
import { MapPin, Phone, Clock, Info } from "lucide-react"

interface ContactInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactInfoModal({ isOpen, onClose }: ContactInfoModalProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    section: "location",
    title: "",
    content: "",
    phone: "",
    email: "",
    address: "",
    hours: {
      lunes_viernes: "",
      sabados: "",
      domingos: "",
    },
    extra_info: "",
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cargar información actual
  useEffect(() => {
    if (isOpen) {
      loadContactInfo()
    }
  }, [isOpen])

  const loadContactInfo = async () => {
    setLoading(true)
    try {
      const info = await getContactInfo()
      if (info) {
        setContactInfo(info)
      }
    } catch (error) {
      console.error("Error loading contact info:", error)
      toast.error("Error al cargar la información de contacto")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await updateContactInfo(contactInfo)
      if (success) {
        toast.success("Información de contacto actualizada correctamente")
        onClose()
      } else {
        toast.error("Error al guardar la información de contacto")
      }
    } catch (error) {
      console.error("Error saving contact info:", error)
      toast.error("Error al guardar la información de contacto")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof ContactInfo, value: any) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateHours = (day: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value,
      },
    }))
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rosita-pink"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rosita-black">Configurar Información de Contacto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-rosita-pink" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título de la Sección</Label>
                <Input
                  id="title"
                  value={contactInfo.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ej: Ubicación"
                />
              </div>
              <div>
                <Label htmlFor="content">Descripción</Label>
                <Textarea
                  id="content"
                  value={contactInfo.content || ""}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Descripción general sobre el contacto"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-rosita-orange" />
                Datos de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="info@rositacarniceria.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rosita-brown" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="address">Dirección Completa</Label>
                <Textarea
                  id="address"
                  value={contactInfo.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Calle, número, ciudad, código postal"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-rosita-red" />
                Horarios de Atención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lunes_viernes">Lunes a Viernes</Label>
                <Input
                  id="lunes_viernes"
                  value={contactInfo.hours?.lunes_viernes || ""}
                  onChange={(e) => updateHours("lunes_viernes", e.target.value)}
                  placeholder="8:00 - 20:00"
                />
              </div>
              <div>
                <Label htmlFor="sabados">Sábados</Label>
                <Input
                  id="sabados"
                  value={contactInfo.hours?.sabados || ""}
                  onChange={(e) => updateHours("sabados", e.target.value)}
                  placeholder="8:00 - 18:00"
                />
              </div>
              <div>
                <Label htmlFor="domingos">Domingos</Label>
                <Input
                  id="domingos"
                  value={contactInfo.hours?.domingos || ""}
                  onChange={(e) => updateHours("domingos", e.target.value)}
                  placeholder="9:00 - 14:00"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Extra */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="extra_info">Información Extra</Label>
                <Textarea
                  id="extra_info"
                  value={contactInfo.extra_info || ""}
                  onChange={(e) => updateField("extra_info", e.target.value)}
                  placeholder="Información adicional como certificaciones, respaldos, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-rosita-pink hover:bg-rosita-pink/90">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
