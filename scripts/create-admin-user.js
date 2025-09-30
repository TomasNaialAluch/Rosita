#!/usr/bin/env node

/**
 * Script para crear un usuario admin temporal para testing
 */

console.log('🔧 Creando usuario admin temporal...');

// Crear usuario admin en localStorage para testing
const adminUser = {
  id: "admin-temp",
  name: "Admin Rosita",
  email: "admin@rosita.com",
  is_admin: true,
  is_verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  phone: "+54 9 11 1234-5678",
  address: "Calle Admin 123",
  addressType: "casa",
  floor: "",
  buzzer: ""
};

// Instrucciones para el usuario
console.log(`
📋 INSTRUCCIONES PARA ACTIVAR EL MODO ADMIN:

1. Abre tu navegador y ve a: https://rosita-b76eb.web.app/admin

2. Abre las DevTools (F12) y ve a la consola

3. Ejecuta este código en la consola:
   localStorage.setItem('special-admin', JSON.stringify(${JSON.stringify(adminUser)}));
   localStorage.setItem('admin-user', JSON.stringify(${JSON.stringify(adminUser)}));
   window.location.reload();

4. ¡Ya deberías poder acceder al panel de admin!

🔑 Credenciales alternativas:
- Email: admin@rosita.com
- Password: admin123

📝 Nota: Este es un usuario temporal para testing.
`);

console.log('✅ Script completado. Sigue las instrucciones arriba.');
