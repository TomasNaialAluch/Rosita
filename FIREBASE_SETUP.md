# Configuración de Firebase

Para migrar completamente a Firebase, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Opcional: Usar emuladores de Firebase en desarrollo
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Pasos para configurar Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Firestore Database
4. Habilita Authentication (si planeas usar autenticación)
5. Ve a "Project Settings" > "General" > "Your apps"
6. Agrega una nueva app web
7. Copia las credenciales de configuración y pégales en tu archivo `.env.local`

## Colecciones de Firestore necesarias:

- `products` - Para los productos de la carnicería
- `site_messages` - Para los mensajes del sitio
- `contact_info` - Para la información de contacto
- `orders` - Para los pedidos (si planeas usar esta funcionalidad)
- `news` - Para las noticias (si planeas usar esta funcionalidad)

## Estructura de datos:

### Products
```json
{
  "name": "Asado de Tira",
  "price": 2800,
  "category": "Vacuno",
  "description": "Corte tradicional argentino",
  "image_url": "/placeholder.svg",
  "featured": true,
  "sale_format": "Por kg",
  "stock": 50,
  "minimum_kg": 1
}
```

### Site Messages
```json
{
  "message_key": "welcome_banner",
  "title": "¡Bienvenido a Rosita!",
  "content": "Únete a más de 1,000 familias",
  "button_text": "Registrarse",
  "button_link": "/register",
  "is_active": true,
  "message_type": "promo",
  "target_audience": "guests",
  "display_conditions": {
    "delay": 5000,
    "showOnPages": ["/"]
  }
}
```

### Contact Info
```json
{
  "section": "location",
  "title": "Ubicación",
  "content": "Trabajamos tanto de forma física como online",
  "phone": "+54 11 1234-5678",
  "email": "info@rositacarniceria.com",
  "address": "C. Jose E. Rodo 6341, C1440 Ciudad Autónoma de Buenos Aires",
  "hours": {
    "lunes_viernes": "8:00 - 20:00",
    "sabados": "8:00 - 18:00",
    "domingos": "9:00 - 14:00"
  }
}
```

## Reglas de seguridad de Firestore:

Para desarrollo, puedes usar reglas permisivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas reglas son solo para desarrollo. Para producción, debes implementar reglas de seguridad apropiadas.
