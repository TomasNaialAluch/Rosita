"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Home,
  Building,
  Shield,
  Package,
  CheckCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function PerfilPage() {
  const { user, loading, updateProfile, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    addressType: "" as "casa" | "departamento" | "",
    floor: "",
    buzzer: "",
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        addressType: user.address_type || "",
        floor: user.floor || "",
        buzzer: user.buzzer || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      addressType: value as "casa" | "departamento",
    })
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      const success = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        address_type: formData.addressType || null,
        floor: formData.floor.trim() || null,
        buzzer: formData.buzzer.trim() || null,
      })

      if (success) {
        setIsEditing(false)
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido guardados correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el perfil",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        addressType: user.address_type || "",
        floor: user.floor || "",
        buzzer: user.buzzer || "",
      })
    }
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // El useEffect redirigirá
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url || "/placeholder.svg"}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full border-4 border-rosita-pink/20"
              />
            ) : (
              <div className="w-20 h-20 bg-rosita-pink/10 rounded-full flex items-center justify-center border-4 border-rosita-pink/20">
                <User className="h-10 w-10 text-rosita-pink" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-rosita-black mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
          {user.is_admin && (
            <Badge className="mt-2 bg-rosita-orange">
              <Shield className="h-3 w-3 mr-1" />
              Administrador
            </Badge>
          )}
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Información Personal */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tus datos personales y de contacto</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información básica */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        value={user.email}
                        className="pl-10 bg-gray-50"
                        disabled
                        title="El email no se puede modificar"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+54 11 1234-5678"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                {/* Dirección */}
                <div className="space-y-4">
                  <h3 className="font-medium text-rosita-black flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección de entrega
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección completa</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle, número, barrio"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressType">Tipo de vivienda</Label>
                      <Select value={formData.addressType} onValueChange={handleSelectChange} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casa">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              Casa
                            </div>
                          </SelectItem>
                          <SelectItem value="departamento">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Departamento
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.addressType === "departamento" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="floor">Piso</Label>
                          <Input
                            id="floor"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="Ej: 3°, PB"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buzzer">Timbre</Label>
                          <Input
                            id="buzzer"
                            name="buzzer"
                            value={formData.buzzer}
                            onChange={handleChange}
                            placeholder="Ej: A, 15"
                            disabled={!isEditing}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Información de cuenta */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-rosita-black">Información de cuenta</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Miembro desde:</span>
                      <p className="font-medium">
                        {new Date(user.created_at).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Última actualización:</span>
                      <p className="font-medium">
                        {new Date(user.updated_at).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mis Pedidos */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>Historial de tus compras y estado de pedidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
                  <p className="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
                  <Button asChild className="bg-rosita-pink hover:bg-rosita-pink/90">
                    <Link href="/tienda">Explorar productos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de cuenta</CardTitle>
                  <CardDescription>Configura tus preferencias y notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notificaciones por email</h4>
                      <p className="text-sm text-gray-600">Recibe actualizaciones sobre tus pedidos</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activado
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Ofertas y promociones</h4>
                      <p className="text-sm text-gray-600">Recibe información sobre descuentos especiales</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activado
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Zona de peligro</CardTitle>
                  <CardDescription>Acciones irreversibles de cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-900">Cerrar sesión</h4>
                        <p className="text-sm text-red-700">Cerrar sesión en este dispositivo</p>
                      </div>
                      <Button onClick={handleLogout} variant="destructive" size="sm">
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
