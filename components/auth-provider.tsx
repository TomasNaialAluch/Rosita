"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

type UserProfile = {
  id: string
  name: string
  phone?: string | null
  address?: string | null
  address_type?: "casa" | "departamento" | null
  floor?: string | null
  buzzer?: string | null
  is_admin: boolean
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

interface User extends UserProfile {
  email: string
}

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

  const getInitialSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
      }

      if (session?.user) {
        await fetchUserProfile(session.user)
      }
    } catch (error) {
      console.error("Error in getInitialSession:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user_profiles table exists and get profile
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (error) {
        console.log("Profile fetch error:", error.message)

        // If table doesn't exist or profile doesn't exist, create temporary user
        const tempUser: User = {
          id: supabaseUser.id,
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.email?.split("@")[0] ||
            "Usuario",
          email: supabaseUser.email || "",
          phone: supabaseUser.user_metadata?.phone || null,
          address: supabaseUser.user_metadata?.address || null,
          address_type: (supabaseUser.user_metadata?.addressType as "casa" | "departamento") || null,
          floor: supabaseUser.user_metadata?.floor || null,
          buzzer: supabaseUser.user_metadata?.buzzer || null,
          is_admin: supabaseUser.email === "admin@rositacarniceria.com",
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setUser(tempUser)
        return
      }

      if (profile) {
        setUser({
          ...profile,
          email: supabaseUser.email || "",
        })
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)

      // Create temporary user as fallback
      const tempUser: User = {
        id: supabaseUser.id,
        name:
          supabaseUser.user_metadata?.name ||
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.email?.split("@")[0] ||
          "Usuario",
        email: supabaseUser.email || "",
        phone: null,
        address: null,
        address_type: null,
        floor: null,
        buzzer: null,
        is_admin: false,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setUser(tempUser)
    }
  }

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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return false
      }

      return !!data.user
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Google login error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Google login exception:", error)
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
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: userData.name,
            full_name: userData.name,
            phone: userData.phone || null,
            address: userData.address || null,
            addressType: userData.addressType || null,
            floor: userData.floor || null,
            buzzer: userData.buzzer || null,
          },
        },
      })

      if (error) {
        console.error("Registration error:", error)
        return false
      }

      return !!data.user
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

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
      }
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

      const { error } = await supabase.from("user_profiles").update(userData).eq("id", user.id)

      if (error) {
        console.log("Profile update failed, updating local state only")
        // Update local state as fallback
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
        return true
      }

      // Update local state
      setUser((prev) => (prev ? { ...prev, ...userData } : null))
      return true
    } catch (error) {
      console.error("Profile update error:", error)
      // Update local state as fallback
      setUser((prev) => (prev ? { ...prev, ...userData } : null))
      return true
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

    // Si no hay admin especial, proceder con la sesión normal
    if (!checkSpecialAdmin()) {
      getInitialSession()
    }

    // Escuchar cambios de autenticación solo si no es admin especial
    let subscription: any = null
    if (!localStorage.getItem("special-admin")) {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email)

        if (event === "SIGNED_IN" && session?.user) {
          await fetchUserProfile(session.user)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
        setLoading(false)
      })
      subscription = authSubscription
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
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
