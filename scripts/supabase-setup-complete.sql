-- Configuración completa de Supabase para Rosita Carnicería
-- Ejecutar en el SQL Editor de Supabase

-- 1. Habilitar Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 2. Crear tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    address_type TEXT CHECK (address_type IN ('casa', 'departamento')),
    floor TEXT,
    buzzer TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vacuno', 'cerdo', 'pollo')),
    price DECIMAL(10, 2) NOT NULL,
    price_per_kilo DECIMAL(10, 2),
    image TEXT,
    description TEXT,
    weight TEXT,
    sell_by TEXT NOT NULL CHECK (sell_by IN ('unidad', 'kilo', 'both')),
    bone_options TEXT[] NOT NULL,
    format_options TEXT[] NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla de items de pedidos
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    bone_type TEXT NOT NULL,
    format_type TEXT NOT NULL,
    vacuum_packing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla de carrito de compras
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    bone_type TEXT NOT NULL,
    format_type TEXT NOT NULL,
    vacuum_packing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- 8. Configurar Row Level Security (RLS)

-- Políticas para user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para products (público para lectura, admin para escritura)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
CREATE POLICY "Only admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Políticas para orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Políticas para order_items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create order items for own orders" ON public.order_items;
CREATE POLICY "Users can create order items for own orders" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Políticas para cart_items
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

-- 9. Crear función mejorada para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- 10. Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Crear función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Crear triggers para updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Auto-confirmar usuarios para desarrollo
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 14. Función para auto-confirmar nuevos usuarios (solo para desarrollo)
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

-- 15. Trigger para auto-confirmar usuarios nuevos
DROP TRIGGER IF EXISTS auto_confirm_new_users ON auth.users;
CREATE TRIGGER auto_confirm_new_users
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- 16. Habilitar RLS en todas las tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 17. Insertar productos de ejemplo
INSERT INTO public.products (id, name, category, price, price_per_kilo, image, description, weight, sell_by, bone_options, format_options, featured, in_stock) VALUES
-- VACUNO
('vacuno-asado-medio', 'Asado del Medio', 'vacuno', 8500, 8500, '/placeholder.svg?height=300&width=300', 'Corte tradicional argentino, ideal para asados familiares. Jugoso y sabroso.', '1.5-2 kg aprox.', 'both', ARRAY['con-hueso', 'sin-hueso'], ARRAY['entero', 'cortado-2', 'cortado-3'], true, true),
('vacuno-vacio-premium', 'Vacío Premium', 'vacuno', 9200, 9200, '/placeholder.svg?height=300&width=300', 'Corte premium de vacío, tierno y jugoso. Perfecto para parrilla.', '1-1.5 kg aprox.', 'both', ARRAY['sin-hueso'], ARRAY['entero', 'cortado-2', 'cortado-3'], true, true),
('vacuno-peceto', 'Peceto', 'vacuno', 7800, 7800, '/placeholder.svg?height=300&width=300', 'Corte magro y tierno, ideal para milanesas y escalopes.', '800g-1.2kg aprox.', 'both', ARRAY['sin-hueso'], ARRAY['entero', 'milanesa-fina', 'milanesa-gruesa', 'cortado-1'], false, true),
('vacuno-bife-chorizo', 'Bife de Chorizo', 'vacuno', 12500, 12500, '/placeholder.svg?height=300&width=300', 'Corte clásico argentino, jugoso y con gran sabor.', '300-400g por unidad', 'both', ARRAY['sin-hueso'], ARRAY['entero', 'cortado-1'], true, true),
('vacuno-entrania', 'Entraña', 'vacuno', 9800, 9800, '/placeholder.svg?height=300&width=300', 'Corte jugoso y sabroso, perfecto para la parrilla.', '600-900g aprox.', 'both', ARRAY['sin-hueso'], ARRAY['entero'], true, true),

-- CERDO
('cerdo-bondiola', 'Bondiola', 'cerdo', 6500, 6500, '/placeholder.svg?height=300&width=300', 'Corte jugoso y tierno, ideal para hornear o a la parrilla.', '1-1.5kg aprox.', 'both', ARRAY['con-hueso', 'sin-hueso'], ARRAY['entero', 'cortado-2', 'cortado-3'], true, true),
('cerdo-ribs', 'Ribs', 'cerdo', 6800, 6800, '/placeholder.svg?height=300&width=300', 'Costillas de cerdo, ideales para barbacoa y parrilla.', '1-1.5kg aprox.', 'both', ARRAY['con-hueso'], ARRAY['entero', 'cortado-2'], true, true),
('cerdo-matambrito', 'Matambrito de Cerdo', 'cerdo', 5800, 5800, '/placeholder.svg?height=300&width=300', 'Corte tradicional, perfecto para arrollar y hornear.', '800g-1.2kg aprox.', 'both', ARRAY['sin-hueso'], ARRAY['entero'], false, true),
('cerdo-chorizo-puro', 'Chorizo Puro Cerdo', 'cerdo', 4500, 4500, '/placeholder.svg?height=300&width=300', 'Chorizo artesanal 100% cerdo, sin aditivos.', '500g aprox.', 'both', ARRAY['sin-hueso'], ARRAY['entero'], false, true),

-- POLLO
('pollo-suprema', 'Suprema de Pollo', 'pollo', 4200, 4200, '/placeholder.svg?height=300&width=300', 'Pechuga de pollo sin hueso, tierna y versátil.', '300-500g por unidad', 'both', ARRAY['sin-hueso'], ARRAY['entero', 'milanesa-fina', 'milanesa-gruesa', 'cortado-1'], true, true),
('pollo-churrasquito', 'Churrasquito de Pollo', 'pollo', 3800, 3800, '/placeholder.svg?height=300&width=300', 'Corte tierno de pollo, ideal para parrilla.', '200-300g por unidad', 'both', ARRAY['con-hueso', 'sin-hueso'], ARRAY['entero', 'cortado-1'], false, true),
('pollo-pata-muslo', 'Pata y Muslo', 'pollo', 2800, 2800, '/placeholder.svg?height=300&width=300', 'Corte jugoso y económico, perfecto para guisos.', '400-600g por unidad', 'both', ARRAY['con-hueso', 'sin-hueso'], ARRAY['entero', 'cortado-2'], false, true),
('pollo-milanesa', 'Milanesa de Pollo', 'pollo', 4500, 4500, '/placeholder.svg?height=300&width=300', 'Milanesas de pollo ya preparadas, listas para cocinar.', '500g aprox.', 'both', ARRAY['sin-hueso'], ARRAY['milanesa-fina', 'milanesa-gruesa'], false, true)
ON CONFLICT (id) DO NOTHING;
