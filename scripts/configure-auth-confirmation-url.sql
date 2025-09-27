-- Configure authentication settings
-- Note: These settings need to be configured in the Supabase Dashboard
-- This script is for reference only

-- In Supabase Dashboard > Authentication > Settings:
-- Site URL: https://rositamercado.vercel.app
-- Redirect URLs (one per line):
-- https://rositamercado.vercel.app/auth/callback
-- https://rositamercado.vercel.app/NewUser
-- https://rositamercado.vercel.app/login
-- http://localhost:3000/auth/callback
-- http://localhost:3000/NewUser
-- http://localhost:3000/login

-- Email template for signup confirmation:
-- Subject: Confirma tu registro en Rosita Carnicería
-- Body:
-- <h2>¡Bienvenido a Rosita Carnicería Premium!</h2>
-- <p>Gracias por registrarte. Haz clic en el enlace para confirmar tu cuenta:</p>
-- <p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">Confirmar mi cuenta</a></p>
-- <p>Si no solicitaste esta cuenta, puedes ignorar este email.</p>

-- Create a function to log successful confirmations
CREATE OR REPLACE FUNCTION public.log_user_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user profile when email is confirmed
    UPDATE public.user_profiles 
    SET updated_at = NOW()
    WHERE id = NEW.id AND NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.log_user_confirmation();
