-- Insertar datos de prueba en Supabase
-- Ejecutar después de supabase-setup.sql

-- 1. Insertar productos de ejemplo
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
('pollo-milanesa', 'Milanesa de Pollo', 'pollo', 4500, 4500, '/placeholder.svg?height=300&width=300', 'Milanesas de pollo ya preparadas, listas para cocinar.', '500g aprox.', 'both', ARRAY['sin-hueso'], ARRAY['milanesa-fina', 'milanesa-gruesa'], false, true);

-- 2. Crear usuario administrador (esto se debe hacer manualmente en Supabase Auth)
-- Después de crear el usuario admin en Supabase Auth, actualizar su perfil:
-- UPDATE public.user_profiles SET is_admin = true WHERE id = 'USER_ID_DEL_ADMIN';
