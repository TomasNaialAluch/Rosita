import { db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export interface ContactInfo {
  id?: number
  section: string
  title?: string
  content?: string
  phone?: string
  email?: string
  address?: string
  hours?: {
    lunes_viernes?: string
    sabados?: string
    domingos?: string
  }
  extra_info?: string
}

// Función para obtener información de contacto
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        const stored = localStorage.getItem("admin-contact-info")
        if (stored) {
          return JSON.parse(stored)
        }
      }
    }

    // Para usuarios normales, usar Firebase
    const docRef = doc(db, "contact_info", "location")
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log("Contact info document doesn't exist, using default")
      return getDefaultContactInfo()
    }

    return { id: docSnap.id, ...docSnap.data() } as unknown as ContactInfo
  } catch (error) {
    console.error("Error in getContactInfo:", error)
    return getDefaultContactInfo()
  }
}

// Función para actualizar información de contacto
export async function updateContactInfo(contactInfo: ContactInfo): Promise<boolean> {
  try {
    // Para el admin especial, usar localStorage
    if (typeof window !== "undefined") {
      const adminUser = localStorage.getItem("admin-user")
      if (adminUser) {
        localStorage.setItem("admin-contact-info", JSON.stringify(contactInfo))
        return true
      }
    }

    // Para usuarios normales, usar Firebase
    const docRef = doc(db, "contact_info", "location")
    await setDoc(docRef, {
      section: "location",
      ...contactInfo,
    }, { merge: true })

    return true
  } catch (error) {
    console.error("Error in updateContactInfo:", error)
    return false
  }
}

// Información por defecto
function getDefaultContactInfo(): ContactInfo {
  return {
    section: "location",
    title: "Ubicación",
    content: "Trabajamos tanto de forma física como online para tu comodidad",
    phone: "+54 11 1234-5678",
    email: "info@rositacarniceria.com",
    address: "C. Jose E. Rodo 6341, C1440 Ciudad Autónoma de Buenos Aires",
    hours: {
      lunes_viernes: "8:00 - 20:00",
      sabados: "8:00 - 18:00",
      domingos: "9:00 - 14:00",
    },
    extra_info: "Respaldados por: Frigorífico La Trinidad S.A. - Certificación 5 Estrellas en Calidad",
  }
}
