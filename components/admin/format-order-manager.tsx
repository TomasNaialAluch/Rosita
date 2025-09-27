"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react"

interface FormatOrderManagerProps {
  formats: string[]
  availableFormats: { id: string; label: string }[]
  onReorder: (newOrder: string[]) => void
}

export function FormatOrderManager({ formats, availableFormats, onReorder }: FormatOrderManagerProps) {
  const [orderedFormats, setOrderedFormats] = useState(formats)

  const moveFormat = (index: number, direction: "up" | "down") => {
    const newFormats = [...orderedFormats]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newFormats.length) {
      // Intercambiar elementos
      ;[newFormats[index], newFormats[targetIndex]] = [newFormats[targetIndex], newFormats[index]]
      setOrderedFormats(newFormats)
      onReorder(newFormats)
    }
  }

  const getFormatLabel = (formatId: string) => {
    const format = availableFormats.find((f) => f.id === formatId)
    return format?.label || formatId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Orden de Formatos</CardTitle>
        <p className="text-xs text-gray-600">Arrastra o usa las flechas para reordenar cómo aparecen al usuario</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {orderedFormats.map((formatId, index) => (
          <div
            key={formatId}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border hover:bg-gray-100 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />

            <Badge variant="secondary" className="flex-1 justify-start">
              <span className="text-xs text-gray-500 mr-2">{index + 1}.</span>
              {getFormatLabel(formatId)}
            </Badge>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveFormat(index, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveFormat(index, "down")}
                disabled={index === orderedFormats.length - 1}
                className="h-6 w-6 p-0"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {orderedFormats.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No hay formatos seleccionados</p>
        )}
      </CardContent>
    </Card>
  )
}
