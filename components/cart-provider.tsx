"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: "vacuno" | "cerdo" | "pollo"
  boneType: "con-hueso" | "sin-hueso"
  format:
    | "entero"
    | "picado"
    | "cortado-1"
    | "cortado-2"
    | "cortado-3"
    | "cortado-4"
    | "cortado-5"
    | "milanesa-fina"
    | "milanesa-gruesa"
  sellBy: "unidad" | "kilo"
  quantity: number
  vacuumPacking?: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleVacuumPacking: (id: string) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("rosita-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("rosita-cart", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.format === newItem.format && item.boneType === newItem.boneType,
      )

      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id && item.format === existingItem.format && item.boneType === existingItem.boneType
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const toggleVacuumPacking = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, vacuumPacking: !item.vacuumPacking } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => {
    const basePrice = item.price * item.quantity
    const vacuumCost = item.vacuumPacking ? 500 * item.quantity : 0 // $500 por envasado al vacío
    return sum + basePrice + vacuumCost
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleVacuumPacking,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
