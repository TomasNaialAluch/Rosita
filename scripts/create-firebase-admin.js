#!/usr/bin/env node

/**
 * Script para crear usuario admin en Firebase
 */

console.log('🔧 Configurando usuario admin en Firebase...');

console.log(`
📋 INSTRUCCIONES PARA CREAR USUARIO ADMIN:

1. Ve a Firebase Console:
   https://console.firebase.google.com/project/rosita-b76eb/authentication/users

2. Haz clic en "Add user"

3. Configura el usuario:
   Email: admin@rosita.com
   Password: admin123456

4. Una vez creado, haz clic en el usuario y ve a "Custom claims"

5. Agrega esta claim:
   {
     "is_admin": true,
     "is_verified": true
   }

6. Haz clic en "Save"

🎯 ALTERNATIVA MÁS FÁCIL:
Si no funciona lo anterior, contacta al administrador del sistema
para obtener las credenciales de acceso.

✅ Una vez configurado, podrás hacer login en:
https://rosita-b76eb.web.app/login

Y luego acceder al admin en:
https://rosita-b76eb.web.app/admin
`);

console.log('✅ Instrucciones completadas.');
