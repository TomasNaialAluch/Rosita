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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

function DatabaseSetupBanner() {
  return (
    <div className="mb-4 space-y-3">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Configuración pendiente</span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          La base de datos aún no está configurada. Puedes usar la aplicación, pero los datos no se guardarán
          permanentemente.
        </p>
      </div>

      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Acceso de Administrador</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Para acceder como administrador, usa: <strong>ELTETE@gmail.com</strong> / <strong>DiosesUno33!</strong>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginWithGoogle, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message === "EMAIL_NOT_CONFIRMED") {
        toast({
          title: "Email no confirmado",
          description:
            "Hemos reenviado el email de confirmación. Por favor, revisa tu bandeja de entrada y confirma tu cuenta.",
          variant: "default",
          duration: 8000,
        })
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error al iniciar sesión",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const success = await loginWithGoogle()
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión con Google correctamente",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "No se pudo iniciar sesión con Google",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión con Google",
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
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-rosita-pink hover:text-rosita-pink/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex justify-center mb-4">
            <Image src="/images/logo-sin-fondo.png" alt="Rosita Carnicería" width={80} height={80} />
          </div>
          <h1 className="text-2xl font-bold text-rosita-black">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
        </div>

        <DatabaseSetupBanner />

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login - Enabled */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
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
                Continuar con Google
              </Button>

            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continúa con email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-rosita-pink hover:text-rosita-pink/80">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-rosita-pink hover:bg-rosita-pink/90" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">¿No tienes una cuenta? </span>
              <Link href="/register" className="text-rosita-pink hover:text-rosita-pink/80 font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
