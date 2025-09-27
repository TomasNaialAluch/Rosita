"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDeliveryConfig } from "@/lib/delivery-config"

interface DeliveryConfig {
  id: string
  day_of_week: number
  day_name: string
  start_time: string
  end_time: string
  is_active: boolean
  max_orders?: number
}

export function DeliveryInfo() {
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig[]>([])
  const [nextDelivery, setNextDelivery] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeliveryInfo()
  }, [])

  const loadDeliveryInfo = async () => {
    try {
      const config = await getDeliveryConfig()
      setDeliveryConfig(config)

      // Calcular próxima entrega
      const next = calculateNextDelivery(config)
      setNextDelivery(next)
    } catch (error) {
      console.log("Error loading delivery config:", error)
      // Usar configuración por defecto
      const defaultConfig = [
        {
          id: "default-1",
          day_of_week: 2,
          day_name: "Martes",
          start_time: "09:00",
          end_time: "18:00",
          is_active: true,
        },
        {
          id: "default-2",
          day_of_week: 5,
          day_name: "Viernes",
          start_time: "09:00",
          end_time: "18:00",
          is_active: true,
        },
      ]
      setDeliveryConfig(defaultConfig)
      setNextDelivery(calculateNextDelivery(defaultConfig))
    } finally {
      setLoading(false)
    }
  }

  const calculateNextDelivery = (config: DeliveryConfig[]) => {
    const today = new Date()
    const currentDay = today.getDay()
    const currentTime = today.getHours() * 100 + today.getMinutes()

    // Filtrar días activos y ordenar
    const activeDays = config.filter((day) => day.is_active).sort((a, b) => a.day_of_week - b.day_of_week)

    if (activeDays.length === 0) {
      return "Consultar disponibilidad"
    }

    // Buscar el próximo día de entrega
    for (const day of activeDays) {
      const dayOfWeek = day.day_of_week === 0 ? 7 : day.day_of_week // Convertir domingo
      const startTime = Number.parseInt(day.start_time.replace(":", ""))

      if (dayOfWeek > currentDay || (dayOfWeek === currentDay && currentTime < startTime)) {
        const daysUntil = dayOfWeek > currentDay ? dayOfWeek - currentDay : 7 - currentDay + dayOfWeek
        const deliveryDate = new Date(today)
        deliveryDate.setDate(today.getDate() + daysUntil)

        return `${day.day_name} ${deliveryDate.getDate()}/${deliveryDate.getMonth() + 1} entre ${day.start_time} y ${day.end_time}hs`
      }
    }

    // Si no hay entregas esta semana, buscar la próxima
    const firstDay = activeDays[0]
    const daysUntil = 7 - currentDay + firstDay.day_of_week
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + daysUntil)

    return `${firstDay.day_name} ${deliveryDate.getDate()}/${deliveryDate.getMonth() + 1} entre ${firstDay.start_time} y ${firstDay.end_time}hs`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Información de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Información de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Próxima Entrega */}
        <div className="bg-rosita-pink/5 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-rosita-pink" />
            <span className="font-medium text-rosita-pink">Próxima Entrega</span>
          </div>
          <p className="text-sm font-semibold">{nextDelivery}</p>
        </div>

        {/* Días de Entrega */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Días de Entrega Disponibles
          </h4>
          <div className="space-y-2">
            {deliveryConfig
              .filter((day) => day.is_active)
              .map((day) => (
                <div key={day.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{day.day_name}</span>
                  <Badge variant="outline">
                    {day.start_time} - {day.end_time}hs
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Los pedidos se procesan según disponibilidad</p>
          <p>• Confirmaremos el horario exacto por WhatsApp</p>
          <p>• Zona de entrega: CABA y GBA Norte</p>
        </div>
      </CardContent>
    </Card>
  )
}
