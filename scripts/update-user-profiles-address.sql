-- Agregar campos adicionales de dirección a la tabla user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS address_type TEXT CHECK (address_type IN ('casa', 'departamento')),
ADD COLUMN IF NOT EXISTS floor TEXT,
ADD COLUMN IF NOT EXISTS buzzer TEXT;

-- Actualizar la función para manejar los nuevos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Intentar insertar el perfil del usuario
    INSERT INTO public.user_profiles (id, name, phone, address, address_type, floor, buzzer, avatar_url)
    VALUES (
        NEW.id, 
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name', 
            split_part(NEW.email, '@', 1),
            'Usuario'
        ),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        COALESCE(NEW.raw_user_meta_data->>'address', NULL),
        COALESCE(NEW.raw_user_meta_data->>'address_type', NULL),
        COALESCE(NEW.raw_user_meta_data->>'floor', NULL),
        COALESCE(NEW.raw_user_meta_data->>'buzzer', NULL),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    )
    ON CONFLICT (id) DO UPDATE SET
        name = COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            EXCLUDED.name
        ),
        avatar_url = COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            EXCLUDED.avatar_url
        ),
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log del error pero no fallar
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
