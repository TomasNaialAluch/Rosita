// Sistema de órdenes simplificado sin Supabase

export interface Order {
  id: string
  user_id: string
  user_name: string
  user_phone: string | null
  user_address: string | null
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  delivery_address: string
  delivery_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  bone_type: string
  format_type: string
  vacuum_packing: boolean
  created_at: string
}

export async function checkTablesExist(): Promise<{
  usersExist: boolean
  productsExist: boolean
  ordersExist: boolean
}> {
  try {
    // Verificar tabla de user_profiles
    const { error: usersError } = await supabase.from("user_profiles").select("id").limit(1)

    // Verificar tabla de products
    const { error: productsError } = await supabase.from("products").select("id").limit(1)

    // Verificar tabla de orders
    const { error: ordersError } = await supabase.from("orders").select("id").limit(1)

    return {
      usersExist: !usersError,
      productsExist: !productsError,
      ordersExist: !ordersError,
    }
  } catch (error) {
    console.error("Error checking tables:", error)
    return {
      usersExist: false,
      productsExist: false,
      ordersExist: false,
    }
  }
}

export async function createOrder(orderData: {
  user_id: string
  user_name: string
  user_phone: string | null
  user_address: string | null
  total_amount: number
  delivery_address: string
  delivery_phone: string | null
  notes: string | null
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    bone_type: string
    format_type: string
    vacuum_packing: boolean
  }>
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Verificar que las tablas existan
    const tablesCheck = await checkTablesExist()
    if (!tablesCheck.usersExist || !tablesCheck.productsExist || !tablesCheck.ordersExist) {
      return {
        success: false,
        error: "Las tablas de la base de datos no están configuradas correctamente",
      }
    }

    // Crear el pedido principal
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        user_name: orderData.user_name,
        user_phone: orderData.user_phone,
        user_address: orderData.user_address,
        total_amount: orderData.total_amount,
        status: "pending",
        delivery_address: orderData.delivery_address,
        delivery_phone: orderData.delivery_phone,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return {
        success: false,
        error: "Error al crear el pedido",
      }
    }

    // Crear los items del pedido
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      bone_type: item.bone_type,
      format_type: item.format_type,
      vacuum_packing: item.vacuum_packing,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Intentar eliminar el pedido si falló la creación de items
      await supabase.from("orders").delete().eq("id", order.id)
      return {
        success: false,
        error: "Error al crear los items del pedido",
      }
    }

    return {
      success: true,
      orderId: order.id,
    }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return {
      success: false,
      error: "Error inesperado al crear el pedido",
    }
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
      return []
    }

    return orders.map((order) => ({
      ...order,
      items: order.order_items || [],
    }))
  } catch (error) {
    console.error("Error in getOrders:", error)
    return []
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateOrderStatus:", error)
    return false
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getStatusLabel(status: Order["status"]): string {
  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    ready: "Listo",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }
  return statusLabels[status] || status
}

export function getStatusColor(status: Order["status"]): string {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-green-100 text-green-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  }
  return statusColors[status] || "bg-gray-100 text-gray-800"
}
