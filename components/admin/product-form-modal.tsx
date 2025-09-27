"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Save, Upload, Package, DollarSign, Settings, ImageIcon, Loader2, Scale } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/products"
import { createProduct, updateProduct } from "@/lib/products-db"
import { uploadImage, isValidImageUrl } from "@/lib/upload-image"
import { FormatOrderManager } from "./format-order-manager"

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  isCreating: boolean
  onSave?: () => void
}

// Opciones de formato disponibles
const availableFormats = [
  { id: "entero", label: "Entero" },
  { id: "picado", label: "Picado" },
  { id: "cortado-1", label: "Cortado 1 dedo" },
  { id: "cortado-2", label: "Cortado 2 dedos" },
  { id: "cortado-3", label: "Cortado 3 dedos" },
  { id: "cortado-4", label: "Cortado 4 dedos" },
  { id: "cortado-5", label: "Cortado 5 dedos" },
  { id: "milanesa-fina", label: "Milanesa Fina" },
  { id: "milanesa-gruesa", label: "Milanesa Gruesa" },
]

export function ProductFormModal({ isOpen, onClose, product, isCreating, onSave }: ProductFormModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "vacuno" as "vacuno" | "cerdo" | "pollo",
    price: "",
    pricePerKilo: "",
    description: "",
    weight: "",
    sellBy: "both" as "unidad" | "kilo" | "both",
    formatOptions: [] as string[],
    featured: false,
    inStock: true,
    image: "",
    minimumKg: "", // Nuevo campo
  })
  const [customFormat, setCustomFormat] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Cargar datos del producto al abrir el modal
  useEffect(() => {
    if (product && !isCreating) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        pricePerKilo: product.pricePerKilo?.toString() || "",
        description: product.description || "",
        weight: product.weight || "",
        sellBy: product.sellBy,
        formatOptions: [...product.formatOptions],
        featured: product.featured || false,
        inStock: product.inStock,
        image: product.image || "",
        minimumKg: product.minimumKg?.toString() || "",
      })
      setImagePreview(product.image || "")
    } else if (isCreating) {
      // Reset form for new product
      setFormData({
        name: "",
        category: "vacuno",
        price: "",
        pricePerKilo: "",
        description: "",
        weight: "",
        sellBy: "both",
        formatOptions: ["entero"], // Default format
        featured: false,
        inStock: true,
        image: "",
        minimumKg: "",
      })
      setImagePreview("")
    }
  }, [product, isCreating, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Si es el campo de imagen, actualizar preview
    if (field === "image") {
      setImagePreview(value)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)

    try {
      const result = await uploadImage(file)

      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, image: result.url! }))
        setImagePreview(result.url)
        toast({
          title: "Imagen subida",
          description: "La imagen se subió correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al subir la imagen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error interno al subir la imagen",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const addFormat = (formatId: string) => {
    if (!formData.formatOptions.includes(formatId)) {
      setFormData((prev) => ({
        ...prev,
        formatOptions: [...prev.formatOptions, formatId],
      }))
    }
  }

  const removeFormat = (formatId: string) => {
    setFormData((prev) => ({
      ...prev,
      formatOptions: prev.formatOptions.filter((f) => f !== formatId),
    }))
  }

  const addCustomFormat = () => {
    if (customFormat.trim() && !formData.formatOptions.includes(customFormat.trim())) {
      setFormData((prev) => ({
        ...prev,
        formatOptions: [...prev.formatOptions, customFormat.trim()],
      }))
      setCustomFormat("")
    }
  }

  const handleFormatReorder = (newOrder: string[]) => {
    setFormData((prev) => ({
      ...prev,
      formatOptions: newOrder,
    }))
  }

  const handleSave = async () => {
    // Validaciones
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (formData.formatOptions.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un formato de entrega",
        variant: "destructive",
      })
      return
    }

    // Validar URL de imagen si se proporcionó
    if (formData.image && !isValidImageUrl(formData.image)) {
      toast({
        title: "Error",
        description: "La URL de la imagen no es válida",
        variant: "destructive",
      })
      return
    }

    // Validar mínimo de kilogramos
    if (formData.minimumKg && Number.parseFloat(formData.minimumKg) <= 0) {
      toast({
        title: "Error",
        description: "El mínimo de kilogramos debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    let result

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number.parseFloat(formData.price),
        pricePerKilo: formData.pricePerKilo ? Number.parseFloat(formData.pricePerKilo) : undefined,
        image: formData.image || "/placeholder.svg?height=300&width=300",
        description: formData.description.trim() || "",
        weight: formData.weight.trim() || undefined,
        sellBy: formData.sellBy,
        boneOptions: ["sin-hueso"], // Default value since we removed bone selection
        formatOptions: formData.formatOptions, // Mantiene el orden establecido
        featured: formData.featured,
        inStock: formData.inStock,
        minimumKg: formData.minimumKg ? Number.parseFloat(formData.minimumKg) : undefined,
      }

      if (isCreating) {
        result = await createProduct(productData)
      } else if (product) {
        result = await updateProduct(product.id, productData)
      }

      if (result?.success) {
        toast({
          title: isCreating ? "Producto creado" : "Producto actualizado",
          description: `${formData.name} se ${isCreating ? "creó" : "actualizó"} correctamente`,
        })

        // Llamar al callback para actualizar la lista
        if (onSave) {
          onSave()
        }

        onClose()
      } else {
        toast({
          title: "Error",
          description: result?.error || "No se pudo guardar el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-rosita-pink" />
            {isCreating ? "Crear Nuevo Producto" : `Editar: ${product?.name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Asado del Medio"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacuno">🐄 Vacuno</SelectItem>
                      <SelectItem value="cerdo">🐷 Cerdo</SelectItem>
                      <SelectItem value="pollo">🐔 Pollo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe el producto..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso Aproximado</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="Ej: 1.5-2 kg aprox."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imagen del Producto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imagen del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview de la imagen */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón para subir imagen */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full"
                  >
                    {isUploadingImage ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subiendo...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Subir Imagen
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Formatos: JPG, PNG, GIF, WebP (máx. 5MB)</p>
                </div>

                <Separator />

                {/* URL manual */}
                <div>
                  <Label htmlFor="image">O ingresa URL de imagen</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Producto Destacado</Label>
                    <p className="text-sm text-gray-600">Aparecerá en la sección destacados</p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>En Stock</Label>
                    <p className="text-sm text-gray-600">Disponible para compra</p>
                  </div>
                  <Switch
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Precios y Venta */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Precios y Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sellBy">Forma de Venta *</Label>
                  <Select value={formData.sellBy} onValueChange={(value) => handleInputChange("sellBy", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidad">Solo por Unidad</SelectItem>
                      <SelectItem value="kilo">Solo por Kilo</SelectItem>
                      <SelectItem value="both">Por Kilo y Unidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Precio por Unidad *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="8500"
                  />
                </div>

                {(formData.sellBy === "kilo" || formData.sellBy === "both") && (
                  <div>
                    <Label htmlFor="pricePerKilo">Precio por Kilo</Label>
                    <Input
                      id="pricePerKilo"
                      type="number"
                      value={formData.pricePerKilo}
                      onChange={(e) => handleInputChange("pricePerKilo", e.target.value)}
                      placeholder="8500"
                    />
                  </div>
                )}

                {/* Nuevo campo: Mínimo de Kilogramos */}
                {(formData.sellBy === "kilo" || formData.sellBy === "both") && (
                  <div>
                    <Label htmlFor="minimumKg" className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Mínimo de Kilogramos
                    </Label>
                    <Input
                      id="minimumKg"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.minimumKg}
                      onChange={(e) => handleInputChange("minimumKg", e.target.value)}
                      placeholder="1.0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cantidad mínima en kilogramos que el cliente debe comprar de este producto
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selección de Formatos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Seleccionar Formatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Formatos Disponibles</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableFormats.map((format) => (
                      <Button
                        key={format.id}
                        variant={formData.formatOptions.includes(format.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (formData.formatOptions.includes(format.id)) {
                            removeFormat(format.id)
                          } else {
                            addFormat(format.id)
                          }
                        }}
                        className={
                          formData.formatOptions.includes(format.id) ? "bg-rosita-pink hover:bg-rosita-pink/90" : ""
                        }
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Formato Personalizado</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      placeholder="Ej: Cortado especial"
                    />
                    <Button variant="outline" size="icon" onClick={addCustomFormat} disabled={!customFormat.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Formatos Seleccionados ({formData.formatOptions.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.formatOptions.map((formatId) => {
                      const format = availableFormats.find((f) => f.id === formatId)
                      return (
                        <Badge
                          key={formatId}
                          variant="secondary"
                          className="bg-rosita-pink/10 text-rosita-pink flex items-center gap-1"
                        >
                          {format?.label || formatId}
                          <button onClick={() => removeFormat(formatId)} className="ml-1 hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                  {formData.formatOptions.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">Debe seleccionar al menos un formato</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orden de Formatos */}
          <div className="space-y-6">
            <FormatOrderManager
              formats={formData.formatOptions}
              availableFormats={availableFormats}
              onReorder={handleFormatReorder}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving || isUploadingImage}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploadingImage}
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
                {isCreating ? "Crear Producto" : "Guardar Cambios"}
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
