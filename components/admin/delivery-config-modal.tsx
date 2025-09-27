"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, Clock, Calendar, Truck, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getDeliveryConfig, updateDeliveryConfig, type DeliverySlot } from "@/lib/delivery-config"

interface DeliveryConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function DeliveryConfigModal({ isOpen, onClose }: DeliveryConfigModalProps) {
  const { toast } = useToast()
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar configuración actual
  useEffect(() => {
    if (isOpen) {
      loadDeliveryConfig()
    }
  }, [isOpen])

  const loadDeliveryConfig = async () => {
    setIsLoading(true)
    try {
      const config = await getDeliveryConfig()
      setDeliverySlots(config)
    } catch (error) {
      console.error("Error loading delivery config:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de entregas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addDeliverySlot = () => {
    const newSlot: DeliverySlot = {
      day_of_week: 1, // Lunes por defecto
      day_name: "Lunes",
      start_time: "09:00",
      end_time: "18:00",
      is_active: true,
    }
    setDeliverySlots([...deliverySlots, newSlot])
  }

  const removeDeliverySlot = (index: number) => {
    setDeliverySlots(deliverySlots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof DeliverySlot, value: any) => {
    const updatedSlots = [...deliverySlots]
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    }

    // Si se cambia el día, actualizar el nombre
    if (field === "day_of_week") {
      updatedSlots[index].day_name = DAY_NAMES[value]
    }

    setDeliverySlots(updatedSlots)
  }

  const handleSave = async () => {
    // Validaciones
    if (deliverySlots.length === 0) {
      toast({
        title: "Error",
        description: "Debe configurar al menos un día de entrega",
        variant: "destructive",
      })
      return
    }

    // Validar horarios
    for (let i = 0; i < deliverySlots.length; i++) {
      const slot = deliverySlots[i]
      if (slot.start_time >= slot.end_time) {
        toast({
          title: "Error",
          description: `La hora de inicio debe ser menor que la hora de fin en ${slot.day_name}`,
          variant: "destructive",
        })
        return
      }
    }

    setIsSaving(true)

    try {
      const result = await updateDeliveryConfig(deliverySlots)

      if (result.success) {
        toast({
          title: "Configuración guardada",
          description: "La configuración de entregas se actualizó correctamente",
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar la configuración",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving delivery config:", error)
      toast({
        title: "Error",
        description: "Error interno del servidor",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-rosita-pink" />
            Configuración de Entregas
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rosita-pink"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-rosita-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-rosita-black">¿Cómo funciona?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configura los días y horarios en que realizas entregas. Los clientes verán automáticamente cuándo
                      recibirán su pedido basado en cuándo lo realizaron.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de días de entrega */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-rosita-black">Días y Horarios de Entrega</h3>
                <Button onClick={addDeliverySlot} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Día
                </Button>
              </div>

              {deliverySlots.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay días configurados</h3>
                    <p className="text-gray-600 mb-4">Agrega al menos un día de entrega para comenzar</p>
                    <Button onClick={addDeliverySlot} className="bg-rosita-pink hover:bg-rosita-pink/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Día
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {deliverySlots.map((slot, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-6 gap-4 items-center">
                          {/* Día de la semana */}
                          <div>
                            <Label>Día</Label>
                            <select
                              value={slot.day_of_week}
                              onChange={(e) => updateSlot(index, "day_of_week", Number.parseInt(e.target.value))}
                              className="w-full p-2 border rounded-md"
                            >
                              {DAY_NAMES.map((day, dayIndex) => (
                                <option key={dayIndex} value={dayIndex}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Hora inicio */}
                          <div>
                            <Label>Desde</Label>
                            <Input
                              type="time"
                              value={slot.start_time}
                              onChange={(e) => updateSlot(index, "start_time", e.target.value)}
                            />
                          </div>

                          {/* Hora fin */}
                          <div>
                            <Label>Hasta</Label>
                            <Input
                              type="time"
                              value={slot.end_time}
                              onChange={(e) => updateSlot(index, "end_time", e.target.value)}
                            />
                          </div>

                          {/* Límite de pedidos */}
                          <div>
                            <Label>Máx. Pedidos</Label>
                            <Input
                              type="number"
                              placeholder="Sin límite"
                              value={slot.max_orders || ""}
                              onChange={(e) =>
                                updateSlot(
                                  index,
                                  "max_orders",
                                  e.target.value ? Number.parseInt(e.target.value) : undefined,
                                )
                              }
                            />
                          </div>

                          {/* Estado activo */}
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <Label className="text-sm">Activo</Label>
                              <div className="mt-1">
                                <Switch
                                  checked={slot.is_active}
                                  onCheckedChange={(checked) => updateSlot(index, "is_active", checked)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Eliminar */}
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDeliverySlot(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Preview del slot */}
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={slot.is_active ? "default" : "secondary"}
                              className={slot.is_active ? "bg-rosita-pink" : ""}
                            >
                              {slot.day_name}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {slot.start_time} - {slot.end_time}
                            </span>
                            {slot.max_orders && <Badge variant="outline">Máx. {slot.max_orders} pedidos</Badge>}
                            {!slot.is_active && <Badge variant="secondary">Inactivo</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen */}
            {deliverySlots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de Entregas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-rosita-black mb-2">Días Activos:</h4>
                      <div className="space-y-1">
                        {deliverySlots
                          .filter((slot) => slot.is_active)
                          .map((slot, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              • {slot.day_name}: {slot.start_time} - {slot.end_time}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-rosita-black mb-2">Estadísticas:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>• Total días configurados: {deliverySlots.length}</div>
                        <div>• Días activos: {deliverySlots.filter((s) => s.is_active).length}</div>
                        <div>• Días inactivos: {deliverySlots.filter((s) => !s.is_active).length}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-rosita-pink hover:bg-rosita-pink/90"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Configuración
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
