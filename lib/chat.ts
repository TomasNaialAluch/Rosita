import { ref, push, onValue, off, set, get, query, orderByChild, equalTo } from 'firebase/database'
import { database } from '@/lib/firebase'
import type { User } from '@/lib/firebase-auth'

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'customer' | 'admin'
  message: string
  timestamp: number
  read: boolean
  conversationId: string
}

export interface ChatConversation {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  adminId?: string
  adminName?: string
  lastMessage: string
  lastMessageTime: number
  status: 'open' | 'closed' | 'pending'
  unreadCount: number
  createdAt: number
}

// Crear nueva conversación
export async function createConversation(customer: User): Promise<string> {
  const conversationRef = ref(database, 'conversations')
  const newConversation = {
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    status: 'pending',
    unreadCount: 0,
    createdAt: Date.now(),
    lastMessage: '',
    lastMessageTime: 0
  }
  
  const newConversationRef = push(conversationRef, newConversation)
  return newConversationRef.key!
}

// Enviar mensaje
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderType: 'customer' | 'admin',
  message: string
): Promise<void> {
  const messageRef = ref(database, `messages/${conversationId}`)
  const newMessage = {
    senderId,
    senderName,
    senderType,
    message,
    timestamp: Date.now(),
    read: false
  }
  
  await push(messageRef, newMessage)
  
  // Actualizar conversación
  const conversationRef = ref(database, `conversations/${conversationId}`)
  await set(ref(database, `conversations/${conversationId}/lastMessage`), message)
  await set(ref(database, `conversations/${conversationId}/lastMessageTime`), Date.now())
  
  if (senderType === 'customer') {
    // Incrementar contador de no leídos para admin
    const conversation = await get(conversationRef)
    if (conversation.exists()) {
      const data = conversation.val()
      await set(ref(database, `conversations/${conversationId}/unreadCount`), (data.unreadCount || 0) + 1)
    }
  } else {
    // Marcar como leído cuando admin responde
    await set(ref(database, `conversations/${conversationId}/unreadCount`), 0)
  }
}

// Obtener conversaciones para admin
export async function getAdminConversations(): Promise<ChatConversation[]> {
  const conversationsRef = ref(database, 'conversations')
  const snapshot = await get(query(conversationsRef, orderByChild('lastMessageTime')))
  
  if (!snapshot.exists()) {
    return []
  }
  
  const conversations: ChatConversation[] = []
  snapshot.forEach((childSnapshot) => {
    conversations.push({
      id: childSnapshot.key!,
      ...childSnapshot.val()
    })
  })
  
  return conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
}

// Obtener conversación del cliente
export async function getCustomerConversation(customerId: string): Promise<ChatConversation | null> {
  const conversationsRef = ref(database, 'conversations')
  const snapshot = await get(query(conversationsRef, orderByChild('customerId'), equalTo(customerId)))
  
  if (!snapshot.exists()) {
    return null
  }
  
  const childSnapshot = snapshot.val()
  const conversationId = Object.keys(childSnapshot)[0]
  const conversation = childSnapshot[conversationId]
  
  return {
    id: conversationId,
    ...conversation
  }
}

// Obtener mensajes de una conversación
export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const messagesRef = ref(database, `messages/${conversationId}`)
  const snapshot = await get(messagesRef)
  
  if (!snapshot.exists()) {
    return []
  }
  
  const messages: ChatMessage[] = []
  snapshot.forEach((childSnapshot) => {
    messages.push({
      id: childSnapshot.key!,
      conversationId,
      ...childSnapshot.val()
    })
  })
  
  return messages.sort((a, b) => a.timestamp - b.timestamp)
}

// Escuchar mensajes en tiempo real
export function listenToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const messagesRef = ref(database, `messages/${conversationId}`)
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([])
      return
    }
    
    const messages: ChatMessage[] = []
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key!,
        conversationId,
        ...childSnapshot.val()
      })
    })
    
    callback(messages.sort((a, b) => a.timestamp - b.timestamp))
  })
  
  return () => off(messagesRef, 'value', unsubscribe)
}

// Marcar mensajes como leídos
export async function markMessagesAsRead(conversationId: string, adminId: string): Promise<void> {
  const messagesRef = ref(database, `messages/${conversationId}`)
  const snapshot = await get(messagesRef)
  
  if (!snapshot.exists()) {
    return
  }
  
  const updates: { [key: string]: boolean } = {}
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val()
    if (message.senderType === 'customer' && !message.read) {
      updates[`${childSnapshot.key}/read`] = true
    }
  })
  
  if (Object.keys(updates).length > 0) {
    await set(messagesRef, updates)
    await set(ref(database, `conversations/${conversationId}/unreadCount`), 0)
  }
}

// Cerrar conversación
export async function closeConversation(conversationId: string, adminId: string, adminName: string): Promise<void> {
  const conversationRef = ref(database, `conversations/${conversationId}`)
  await set(ref(database, `conversations/${conversationId}/status`), 'closed')
  await set(ref(database, `conversations/${conversationId}/adminId`), adminId)
  await set(ref(database, `conversations/${conversationId}/adminName`), adminName)
}
