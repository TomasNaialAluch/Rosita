"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Download, Share2, Sparkles, ChefHat, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateRecipe, generateSurpriseRecipe } from "@/lib/recipe-generator"
import { generateRecipePDF, shareRecipeText } from "@/lib/pdf-generator"
import type { Product } from "@/lib/products"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface RecipeChatProps {
  product: Product
  onClose: () => void
}

export default function RecipeChat({ product, onClose }: RecipeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Mensaje inicial del chef
    const welcomeMessage: Message = {
      id: "1",
      role: "assistant",
      content: `¡Hola! Soy tu chef virtual especializado en carnes argentinas. Veo que elegiste **${product.name}** - ¡excelente elección! 

¿Qué te gustaría hacer?

🎲 **Receta Sorpresa**: Te creo una receta tradicional argentina con este corte
🍳 **Receta Personalizada**: Decime qué ingredientes tenés o qué tipo de preparación preferís

¿Cómo empezamos?`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [product])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSurpriseRecipe = async () => {
    setIsLoading(true)
    try {
      const recipe = await generateSurpriseRecipe(product.name)
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: recipe,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setCurrentRecipe(recipe)
    } catch (error) {
      console.error("Error generating surprise recipe:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Disculpá, hubo un problema generando la receta. ¿Podés intentar de nuevo?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const recipe = await generateRecipe(product.name, input, messages)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: recipe,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setCurrentRecipe(recipe)
    } catch (error) {
      console.error("Error generating recipe:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Disculpá, hubo un problema generando la receta. ¿Podés intentar de nuevo?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDownloadPDF = () => {
    if (currentRecipe) {
      generateRecipePDF(currentRecipe, product.name)
    }
  }

  const handleShareText = () => {
    if (currentRecipe) {
      shareRecipeText(currentRecipe, product.name)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#C85A6E] to-[#D98E04] text-white">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-bold">Chef Virtual</h2>
            <p className="text-sm opacity-90">{product.name}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-[#C85A6E] text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">El chef está preparando tu receta...</span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            onClick={handleSurpriseRecipe}
            disabled={isLoading}
            size="sm"
            className="bg-gradient-to-r from-[#C85A6E] to-red-500 hover:from-[#C85A6E]/90 hover:to-red-500/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Receta Sorpresa
          </Button>
          {currentRecipe && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareText}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribí tu mensaje... ej: 'Tengo cebolla y ajo, ¿qué me recomendás?'"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="bg-[#C85A6E] hover:bg-[#C85A6E]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
