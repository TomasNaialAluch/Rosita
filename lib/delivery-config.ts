import { supabase } from "@/lib/supabase"

export interface DeliveryConfig {
  id: number
  day_of_week: number // 0=Domingo, 1=Lunes, 2=Martes, etc.
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  is_active: boolean
  max_orders?: number
  created_at: string
  updated_at: string
}

export interface DeliverySlot {
  day_of_week: number
  day_name: string
  start_time: string
  end_time: string
  is_active: boolean
  max_orders?: number
}

// Nombres de los días de la semana
const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

// Función para verificar si es el admin especial
const isSpecialAdmin = () => {
  if (typeof window === "undefined") return false
  const adminData = localStorage.getItem("special-admin")
  return adminData === "ELTETE@gmail.com"
}

// Configuración por defecto para el admin especial
const DEFAULT_DELIVERY_CONFIG: DeliverySlot[] = [
  {
    day_of_week: 2,
    day_name: "Martes",
    start_time: "09:00",
    end_time: "18:00",
    is_active: true,
  },
  {
    day_of_week: 5,
    day_name: "Viernes",
    start_time: "09:00",
    end_time: "18:00",
    is_active: true,
  },
]

export async function getDeliveryConfig(): Promise<DeliverySlot[]> {
  try {
    // Si es el admin especial, usar localStorage
    if (isSpecialAdmin()) {
      const stored = localStorage.getItem("delivery-config")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error("Error parsing stored delivery config:", e)
        }
      }
      // Guardar configuración por defecto
      localStorage.setItem("delivery-config", JSON.stringify(DEFAULT_DELIVERY_CONFIG))
      return DEFAULT_DELIVERY_CONFIG
    }

    // Para usuarios normales, usar Supabase
    const { data, error } = await supabase.from("delivery_config").select("*").order("day_of_week")

    if (error) {
      console.error("Error fetching delivery config:", error)
      return DEFAULT_DELIVERY_CONFIG
    }

    return (data || []).map((config) => ({
      day_of_week: config.day_of_week,
      day_name: DAY_NAMES[config.day_of_week],
      start_time: config.start_time.substring(0, 5), // HH:MM
      end_time: config.end_time.substring(0, 5), // HH:MM
      is_active: config.is_active,
      max_orders: config.max_orders,
    }))
  } catch (error) {
    console.error("Error in getDeliveryConfig:", error)
    return DEFAULT_DELIVERY_CONFIG
  }
}

export async function updateDeliveryConfig(config: DeliverySlot[]): Promise<{ success: boolean; error?: string }> {
  try {
    // Si es el admin especial, usar localStorage
    if (isSpecialAdmin()) {
      localStorage.setItem("delivery-config", JSON.stringify(config))
      return { success: true }
    }

    // Para usuarios normales, usar Supabase
    // Primero eliminar configuración existente
    const { error: deleteError } = await supabase.from("delivery_config").delete().neq("id", 0) // Eliminar todos

    if (deleteError) {
      console.error("Error deleting delivery config:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Insertar nueva configuración
    const configToInsert = config.map((slot) => ({
      day_of_week: slot.day_of_week,
      start_time: `${slot.start_time}:00`,
      end_time: `${slot.end_time}:00`,
      is_active: slot.is_active,
      max_orders: slot.max_orders || null,
    }))

    const { error: insertError } = await supabase.from("delivery_config").insert(configToInsert)

    if (insertError) {
      console.error("Error inserting delivery config:", insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateDeliveryConfig:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Función para calcular la próxima fecha de entrega disponible
export function getNextDeliveryDate(
  deliveryConfig: DeliverySlot[],
): { date: Date; dayName: string; timeSlot: string } | null {
  const activeSlots = deliveryConfig.filter((slot) => slot.is_active)
  if (activeSlots.length === 0) return null

  const today = new Date()
  const currentDay = today.getDay()
  const currentTime = today.getHours() * 60 + today.getMinutes() // minutos desde medianoche

  // Buscar el próximo slot disponible
  for (let i = 0; i < 14; i++) {
    // Buscar en los próximos 14 días
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() + i)
    const checkDay = checkDate.getDay()

    const availableSlot = activeSlots.find((slot) => slot.day_of_week === checkDay)
    if (!availableSlot) continue

    // Si es hoy, verificar si aún hay tiempo
    if (i === 0) {
      const slotEndTime =
        Number.parseInt(availableSlot.end_time.split(":")[0]) * 60 +
        Number.parseInt(availableSlot.end_time.split(":")[1])

      // Si ya pasó la hora límite de hoy, buscar el siguiente día
      if (currentTime >= slotEndTime - 120) {
        // 2 horas antes del cierre
        continue
      }
    }

    return {
      date: checkDate,
      dayName: availableSlot.day_name,
      timeSlot: `${availableSlot.start_time} - ${availableSlot.end_time}`,
    }
  }

  return null
}

// Función para formatear fecha de entrega para mostrar al usuario
export function formatDeliveryDate(deliveryInfo: { date: Date; dayName: string; timeSlot: string }): string {
  const { date, dayName, timeSlot } = deliveryInfo
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return `${dayName} ${day}/${month}/${year} entre ${timeSlot}`
}
