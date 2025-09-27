-- Deshabilitar confirmación de email temporalmente para desarrollo
-- Ejecutar en el SQL Editor de Supabase

-- 1. Actualizar usuarios existentes para marcarlos como confirmados
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Crear función para auto-confirmar nuevos usuarios (solo para desarrollo)
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-confirmar el email del usuario
    UPDATE auth.users 
    SET email_confirmed_at = NOW(), 
        confirmed_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear trigger para auto-confirmar usuarios nuevos
DROP TRIGGER IF EXISTS auto_confirm_new_users ON auth.users;
CREATE TRIGGER auto_confirm_new_users
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- Nota: En producción, deberías deshabilitar esto y configurar correctamente 
-- el servicio de email en Supabase
