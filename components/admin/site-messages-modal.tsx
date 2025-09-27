"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  type SiteMessage,
  getSiteMessages,
  updateSiteMessage,
  createSiteMessage,
  deleteSiteMessage,
} from "@/lib/site-messages"
import { MessageSquare, Plus, Edit, Trash2, Eye, EyeOff, Users, UserCheck, Globe } from "lucide-react"

interface SiteMessagesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SiteMessagesModal({ isOpen, onClose }: SiteMessagesModalProps) {
  const [messages, setMessages] = useState<SiteMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [editingMessage, setEditingMessage] = useState<SiteMessage | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Cargar mensajes
  useEffect(() => {
    if (isOpen) {
      loadMessages()
    }
  }, [isOpen])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const data = await getSiteMessages()
      setMessages(data)
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Error al cargar los mensajes")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (message: SiteMessage) => {
    setEditingMessage({ ...message })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingMessage({
      message_key: "",
      title: "",
      content: "",
      button_text: "",
      button_link: "",
      is_active: true,
      message_type: "info",
      target_audience: "all",
      display_conditions: {},
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editingMessage) return

    try {
      const success = editingMessage.id
        ? await updateSiteMessage(editingMessage)
        : await createSiteMessage(editingMessage)

      if (success) {
        toast.success("Mensaje guardado correctamente")
        setIsEditing(false)
        setEditingMessage(null)
        loadMessages()
      } else {
        toast.error("Error al guardar el mensaje")
      }
    } catch (error) {
      console.error("Error saving message:", error)
      toast.error("Error al guardar el mensaje")
    }
  }

  const handleDelete = async (messageKey: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return

    try {
      const success = await deleteSiteMessage(messageKey)
      if (success) {
        toast.success("Mensaje eliminado correctamente")
        loadMessages()
      } else {
        toast.error("Error al eliminar el mensaje")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Error al eliminar el mensaje")
    }
  }

  const toggleActive = async (message: SiteMessage) => {
    try {
      const updated = { ...message, is_active: !message.is_active }
      const success = await updateSiteMessage(updated)
      if (success) {
        toast.success(`Mensaje ${updated.is_active ? "activado" : "desactivado"}`)
        loadMessages()
      } else {
        toast.error("Error al actualizar el mensaje")
      }
    } catch (error) {
      console.error("Error toggling message:", error)
      toast.error("Error al actualizar el mensaje")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "promo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "guests":
        return <Users className="h-4 w-4" />
      case "users":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rosita-pink"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-rosita-black flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-rosita-pink" />
              Gestionar Mensajes del Sitio
            </DialogTitle>
            <Button onClick={handleCreate} className="bg-rosita-pink hover:bg-rosita-pink/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mensaje
            </Button>
          </div>
        </DialogHeader>

        {isEditing && editingMessage ? (
          <Card>
            <CardHeader>
              <CardTitle>{editingMessage.id ? "Editar Mensaje" : "Crear Nuevo Mensaje"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="message_key">Clave del Mensaje</Label>
                  <Input
                    id="message_key"
                    value={editingMessage.message_key}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        message_key: e.target.value,
                      })
                    }
                    placeholder="welcome_banner"
                    disabled={!!editingMessage.id}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={editingMessage.title || ""}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        title: e.target.value,
                      })
                    }
                    placeholder="Título del mensaje"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={editingMessage.content || ""}
                  onChange={(e) =>
                    setEditingMessage({
                      ...editingMessage,
                      content: e.target.value,
                    })
                  }
                  placeholder="Contenido del mensaje"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Texto del Botón</Label>
                  <Input
                    id="button_text"
                    value={editingMessage.button_text || ""}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        button_text: e.target.value,
                      })
                    }
                    placeholder="Registrarse"
                  />
                </div>
                <div>
                  <Label htmlFor="button_link">Enlace del Botón</Label>
                  <Input
                    id="button_link"
                    value={editingMessage.button_link || ""}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        button_link: e.target.value,
                      })
                    }
                    placeholder="/register"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="message_type">Tipo de Mensaje</Label>
                  <Select
                    value={editingMessage.message_type}
                    onValueChange={(value: any) =>
                      setEditingMessage({
                        ...editingMessage,
                        message_type: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="promo">Promoción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target_audience">Audiencia</Label>
                  <Select
                    value={editingMessage.target_audience}
                    onValueChange={(value: any) =>
                      setEditingMessage({
                        ...editingMessage,
                        target_audience: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="guests">Solo Invitados</SelectItem>
                      <SelectItem value="users">Solo Usuarios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={editingMessage.is_active}
                    onCheckedChange={(checked) =>
                      setEditingMessage({
                        ...editingMessage,
                        is_active: checked,
                      })
                    }
                  />
                  <Label htmlFor="is_active">Activo</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingMessage(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-rosita-pink hover:bg-rosita-pink/90">
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.message_key}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-rosita-black">{message.title || message.message_key}</h3>
                        <Badge className={getTypeColor(message.message_type)}>{message.message_type}</Badge>
                        <div className="flex items-center gap-1">
                          {getAudienceIcon(message.target_audience)}
                          <span className="text-xs text-gray-500">{message.target_audience}</span>
                        </div>
                        {message.is_active ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                      <div className="text-xs text-gray-400">Clave: {message.message_key}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleActive(message)}>
                        {message.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(message)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message.message_key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
