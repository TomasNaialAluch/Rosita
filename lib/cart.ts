export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
  vacuum_packed?: boolean
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const basePrice = item.price * item.quantity
    const vacuumPackingFee = item.vacuum_packed ? 500 : 0
    return total + basePrice + vacuumPackingFee
  }, 0)
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function addToCart(items: CartItem[], newItem: Omit<CartItem, "quantity">, quantity = 1): CartItem[] {
  const existingItemIndex = items.findIndex(
    (item) => item.id === newItem.id && item.vacuum_packed === newItem.vacuum_packed,
  )

  if (existingItemIndex > -1) {
    const updatedItems = [...items]
    updatedItems[existingItemIndex].quantity += quantity
    return updatedItems
  } else {
    return [...items, { ...newItem, quantity }]
  }
}

export function removeFromCart(items: CartItem[], itemId: number, vacuumPacked?: boolean): CartItem[] {
  return items.filter((item) => !(item.id === itemId && item.vacuum_packed === vacuumPacked))
}

export function updateCartItemQuantity(
  items: CartItem[],
  itemId: number,
  newQuantity: number,
  vacuumPacked?: boolean,
): CartItem[] {
  if (newQuantity <= 0) {
    return removeFromCart(items, itemId, vacuumPacked)
  }

  return items.map((item) =>
    item.id === itemId && item.vacuum_packed === vacuumPacked ? { ...item, quantity: newQuantity } : item,
  )
}

export function clearCart(): CartItem[] {
  return []
}
