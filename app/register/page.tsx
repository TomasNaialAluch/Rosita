"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Home, Building, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

function DatabaseSetupBanner() {
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 text-blue-800">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Configuración pendiente</span>
      </div>
      <p className="text-xs text-blue-700 mt-1">
        La base de datos aún no está configurada. Puedes registrarte, pero los datos no se guardarán permanentemente.
      </p>
    </div>
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    addressType: "" as "casa" | "departamento" | "",
    floor: "",
    buzzer: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, loginWithGoogle, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      })
      return false
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "El email es obligatorio",
        variant: "destructive",
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return false
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        addressType: formData.addressType || undefined,
        floor: formData.floor.trim() || undefined,
        buzzer: formData.buzzer.trim() || undefined,
        password: formData.password,
      })

      if (success) {
        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Redirigiendo a la página de confirmación...",
        })

        // Redirect to the new user confirmation page
        setTimeout(() => {
          router.push("/NewUser")
        }, 1500)
      } else {
        toast({
          title: "Error al crear cuenta",
          description: "No se pudo crear la cuenta. Verifica que el email no esté en uso.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    try {
      const success = await loginWithGoogle()
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Te has registrado con Google correctamente",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "No se pudo registrar con Google",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Google register error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrarse con Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rosita-pink/5 to-rosita-orange/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosita-pink mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rosita-pink/5 to-rosita-orange/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-rosita-pink hover:text-rosita-pink/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex justify-center mb-4">
            <Image src="/images/logo-sin-fondo.png" alt="Rosita Carnicería" width={80} height={80} />
          </div>
          <h1 className="text-2xl font-bold text-rosita-black">Crear cuenta</h1>
          <p className="text-gray-600">Únete a la familia Rosita</p>
        </div>

        <DatabaseSetupBanner />

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa tus datos para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Register - Enabled */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Registrarse con Google
              </Button>

            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Regístrate con email</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-rosita-black flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección de entrega
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección completa</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Calle, número, barrio"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressType">Tipo de vivienda</Label>
                  <Select value={formData.addressType} onValueChange={handleSelectChange} disabled={isLoading}>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="floor">Piso</Label>
                      <Input
                        id="floor"
                        name="floor"
                        type="text"
                        placeholder="Ej: 3°, PB"
                        value={formData.floor}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buzzer">Timbre</Label>
                      <Input
                        id="buzzer"
                        name="buzzer"
                        type="text"
                        placeholder="Ej: A, 15"
                        value={formData.buzzer}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-rosita-pink hover:bg-rosita-pink/90" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <Link href="/login" className="text-rosita-pink hover:text-rosita-pink/80 font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
