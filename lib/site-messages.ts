import { db } from "./firebase"
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, where } from "firebase/firestore"

export interface SiteMessage {
  id?: number
  message_key: string
  title?: string
  content?: string
  button_text?: string
  button_link?: string
  is_active: boolean
  message_type: "info" | "success" | "warning" | "error" | "promo"
  target_audience: "all" | "guests" | "users"
  display_conditions: {
    delay?: number
    showOnPages?: string[]
    maxViews?: number
    [key: string]: any
  }
}

// Función para verificar si la colección existe
async function checkCollectionExists(): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(db, "site_messages"))
    return true
  } catch {
    return false
  }
}

// Función para obtener todos los mensajes
export async function getSiteMessages(): Promise<SiteMessage[]> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const stored = localStorage.getItem("admin-site-messages")
        if (stored) {
          return JSON.parse(stored)
        } else {
          // Inicializar con mensajes por defecto para admin especial
          const defaultMessages = getDefaultMessages()
          localStorage.setItem("admin-site-messages", JSON.stringify(defaultMessages))
          return defaultMessages
        }
      }
    }

    // Verificar si la colección existe antes de hacer la consulta
    const collectionExists = await checkCollectionExists()
    if (!collectionExists) {
      console.log("Collection site_messages doesn't exist, using default messages")
      return getDefaultMessages()
    }

    // Para usuarios normales, usar Firebase
    const q = query(collection(db, "site_messages"), orderBy("message_key"))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.log("No messages found, using default messages")
      return getDefaultMessages()
    }

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as SiteMessage))
    return messages || getDefaultMessages()
  } catch (error) {
    console.error("Error in getSiteMessages:", error)
    return getDefaultMessages()
  }
}

// Función para obtener un mensaje específico
export async function getSiteMessage(messageKey: string): Promise<SiteMessage | null> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const stored = localStorage.getItem("admin-site-messages")
        let messages: SiteMessage[]

        if (stored) {
          messages = JSON.parse(stored)
        } else {
          // Inicializar con mensajes por defecto
          messages = getDefaultMessages()
          localStorage.setItem("admin-site-messages", JSON.stringify(messages))
        }

        return messages.find((m: SiteMessage) => m.message_key === messageKey) || null
      }
    }

    // Verificar si la colección existe antes de hacer la consulta
    const collectionExists = await checkCollectionExists()
    if (!collectionExists) {
      console.log("Collection site_messages doesn't exist, using default message for:", messageKey)
      const defaults = getDefaultMessages()
      return defaults.find((m) => m.message_key === messageKey) || null
    }

    // Para usuarios normales, usar Firebase
    const q = query(
      collection(db, "site_messages"),
      where("message_key", "==", messageKey),
      where("is_active", "==", true)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.log("Message not found, using default for:", messageKey)
      const defaults = getDefaultMessages()
      return defaults.find((m) => m.message_key === messageKey) || null
    }

    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as unknown as SiteMessage
  } catch (error) {
    console.log("Error in getSiteMessage, using default:", error)
    const defaults = getDefaultMessages()
    return defaults.find((m) => m.message_key === messageKey) || null
  }
}

// Función para actualizar un mensaje
export async function updateSiteMessage(message: SiteMessage): Promise<boolean> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const stored = localStorage.getItem("admin-site-messages")
        const messages = stored ? JSON.parse(stored) : getDefaultMessages()

        const index = messages.findIndex((m: SiteMessage) => m.message_key === message.message_key)
        if (index >= 0) {
          messages[index] = { ...messages[index], ...message }
        } else {
          messages.push(message)
        }

        localStorage.setItem("admin-site-messages", JSON.stringify(messages))
        console.log("Message updated in localStorage:", message.message_key)
        return true
      }
    }

    // Verificar si la colección existe
    const collectionExists = await checkCollectionExists()
    if (!collectionExists) {
      console.log("Collection doesn't exist, cannot save to database")
      return false
    }

    // Para usuarios normales, usar Firebase
    const docRef = doc(db, "site_messages", message.message_key)
    await setDoc(docRef, message, { merge: true })

    return true
  } catch (error) {
    console.error("Error in updateSiteMessage:", error)
    return false
  }
}

// Función para crear un nuevo mensaje
export async function createSiteMessage(message: Omit<SiteMessage, "id">): Promise<boolean> {
  return updateSiteMessage(message as SiteMessage)
}

// Función para eliminar un mensaje
export async function deleteSiteMessage(messageKey: string): Promise<boolean> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const stored = localStorage.getItem("admin-site-messages")
        if (stored) {
          let messages = JSON.parse(stored)
          messages = messages.filter((m: SiteMessage) => m.message_key !== messageKey)
          localStorage.setItem("admin-site-messages", JSON.stringify(messages))
          return true
        }
      }
    }

    // Verificar si la colección existe
    const collectionExists = await checkCollectionExists()
    if (!collectionExists) {
      console.log("Collection doesn't exist, cannot delete from database")
      return false
    }

    // Para usuarios normales, usar Firebase
    const docRef = doc(db, "site_messages", messageKey)
    await deleteDoc(docRef)

    return true
  } catch (error) {
    console.error("Error in deleteSiteMessage:", error)
    return false
  }
}

// Mensajes por defecto
function getDefaultMessages(): SiteMessage[] {
  return [
    {
      message_key: "welcome_banner",
      title: "¡Bienvenido a Rosita! 👋",
      content: "Únete a más de 1,000 familias que confían en nosotros",
      button_text: "Registrarse",
      button_link: "/register",
      is_active: true,
      message_type: "promo",
      target_audience: "guests",
      display_conditions: { delay: 5000, showOnPages: ["/"] },
    },
    {
      message_key: "shopping_users",
      title: "",
      content: "23 personas comprando ahora",
      button_text: "",
      button_link: "",
      is_active: true,
      message_type: "info",
      target_audience: "all",
      display_conditions: {},
    },
    {
      message_key: "floating_cta_title",
      title: "¿Necesitas ayuda?",
      content: "",
      button_text: "Contactar",
      button_link: "/contacto",
      is_active: true,
      message_type: "info",
      target_audience: "all",
      display_conditions: {},
    },
    {
      message_key: "floating_cta_subtitle",
      title: "",
      content: "Estamos aquí para ayudarte",
      button_text: "",
      button_link: "",
      is_active: true,
      message_type: "info",
      target_audience: "all",
      display_conditions: {},
    },
    {
      message_key: "delivery_promo",
      title: "",
      content: "🚚 Envío gratis en compras mayores a $15,000",
      button_text: "Ver productos",
      button_link: "/tienda",
      is_active: true,
      message_type: "success",
      target_audience: "all",
      display_conditions: {},
    },
    {
      message_key: "quality_guarantee",
      title: "",
      content: "✅ Garantía de calidad - Certificación 5 estrellas",
      button_text: "",
      button_link: "",
      is_active: true,
      message_type: "success",
      target_audience: "all",
      display_conditions: {},
    },
  ]
}
