"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  onAuthStateChange,
  updateUserProfile,
  type User,
  type UserProfile
} from "@/lib/firebase-auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
    addressType?: "casa" | "departamento"
    floor?: string
    buzzer?: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<UserProfile>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Verificar si son las credenciales del administrador especial
      if (email.toLowerCase() === "eltete@gmail.com" && password === "DiosesUno33!") {
        // Guardar en localStorage para persistir la sesión
        localStorage.setItem("special-admin", "ELTETE@gmail.com")

        // Crear usuario administrador temporal
        const adminUser: User = {
          id: "admin-eltete",
          name: "Administrador ELTETE",
          email: "ELTETE@gmail.com",
          phone: null,
          address: null,
          address_type: null,
          floor: null,
          buzzer: null,
          is_admin: true,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setUser(adminUser)
        return true
      }

      const result = await loginWithEmail(email, password)
      if (result.success && result.user) {
        setUser(result.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithGoogleAuth = async (): Promise<boolean> => {
    try {
      const result = await loginWithGoogle()
      if (result.success && result.user) {
        setUser(result.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
    addressType?: "casa" | "departamento"
    floor?: string
    buzzer?: string
  }): Promise<boolean> => {
    try {
      const result = await registerWithEmail(userData)
      if (result.success && result.user) {
        setUser(result.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Si es el usuario administrador especial, limpiar localStorage
      if (user?.id === "admin-eltete") {
        localStorage.removeItem("special-admin")
        localStorage.removeItem("admin-products") // También limpiar productos del admin
        setUser(null)
        return
      }

      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false

    try {
      // Si es el admin especial, solo actualizar estado local
      if (user.id === "admin-eltete") {
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
        return true
      }

      const success = await updateUserProfile(user.id, userData)
      if (success) {
        // Update local state
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  useEffect(() => {
    // Verificar si hay un admin especial guardado
    const checkSpecialAdmin = () => {
      const adminData = localStorage.getItem("special-admin")
      if (adminData === "ELTETE@gmail.com") {
        const adminUser: User = {
          id: "admin-eltete",
          name: "Administrador ELTETE",
          email: "ELTETE@gmail.com",
          phone: null,
          address: null,
          address_type: null,
          floor: null,
          buzzer: null,
          is_admin: true,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUser(adminUser)
        setLoading(false)
        return true
      }
      return false
    }

    // Si no hay admin especial, proceder con Firebase Auth
    if (!checkSpecialAdmin()) {
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle: loginWithGoogleAuth,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}