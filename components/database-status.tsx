"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AlertCircle, CheckCircle, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "not-configured">("checking")

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        // Intentar hacer una consulta simple a user_profiles
        const { error } = await supabase.from("user_profiles").select("id").limit(1)

        if (error) {
          setStatus("not-configured")
        } else {
          setStatus("connected")
        }
      } catch (error) {
        setStatus("not-configured")
      }
    }

    checkDatabaseStatus()
  }, [])

  if (status === "checking") {
    return (
      <Alert className="mb-4">
        <Database className="h-4 w-4" />
        <AlertDescription>Verificando conexión a la base de datos...</AlertDescription>
      </Alert>
    )
  }

  if (status === "not-configured") {
    return (
      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Base de datos no configurada:</strong> La aplicación funciona en modo temporal. Los datos no se
          guardarán permanentemente hasta que se configure Supabase.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "connected") {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Base de datos conectada:</strong> Todos los datos se guardan correctamente.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
