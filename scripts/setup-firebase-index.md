# 🔥 Configuración del Índice de Firebase

## 📋 Paso a Paso para Crear el Índice

### 1. **Abre Firebase Console**
Ve a: https://console.firebase.google.com/project/rosita-b76eb/firestore/indexes

### 2. **Crea el Índice Compuesto**
Haz clic en **"Create Index"** y configura:

**Collection ID:** `news`

**Fields:**
- `is_published` → **Ascending**
- `published_at` → **Descending**  
- `__name__` → **Ascending**

### 3. **Crear Índice Simple (opcional pero recomendado)**
También crea un índice simple para búsquedas por slug:

**Collection ID:** `news`

**Fields:**
- `slug` → **Ascending**

## 🚀 Alternativa Rápida

Si quieres hacerlo más rápido, haz clic directamente en este link:
https://console.firebase.google.com/v1/r/project/rosita-b76eb/firestore/indexes?create_composite=Cklwcm9qZWN0cy9yb3NpdGEtYjc2ZWIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL25ld3MvaW5kZXhlcy9fEAEaEAoMaXNfcHVibGlzaGVkEAEaEAoMcHVibGlzaGVkX2F0EAIaDAoIX19uYW1lX18QAg

## ✅ Verificación

Una vez creado el índice:
1. Ve a https://rosita-b76eb.web.app/admin
2. Activa el modo admin (sigue las instrucciones del script anterior)
3. Haz clic en "Gestionar Noticias"
4. Prueba crear, editar y eliminar noticias

## 🎯 Resultado Esperado

Después de crear el índice, deberías poder:
- ✅ Ver todas las noticias
- ✅ Crear nuevas noticias
- ✅ Editar noticias existentes
- ✅ Eliminar noticias
- ✅ Marcar como destacadas
- ✅ Publicar/despublicar
