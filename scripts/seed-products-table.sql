-- Insertar productos existentes en la base de datos
INSERT INTO products (id, name, category, price, price_per_kilo, image, description, weight, sell_by, bone_options, format_options, featured, in_stock) VALUES
-- VACUNO
('vacuno-asado-medio', 'Asado del Medio', 'vacuno', 8500, 8500, '/placeholder.svg?height=300&width=300', 'Corte tradicional argentino, ideal para asados familiares. Jugoso y sabroso.', '1.5-2 kg aprox.', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-2", "cortado-3"}', true, true),
('vacuno-vacio-premium', 'Vacío Premium', 'vacuno', 9200, 9200, '/placeholder.svg?height=300&width=300', 'Corte premium de vacío, tierno y jugoso. Perfecto para parrilla.', '1-1.5 kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "cortado-2", "cortado-3"}', true, true),
('vacuno-peceto', 'Peceto', 'vacuno', 7800, 7800, '/placeholder.svg?height=300&width=300', 'Corte magro y tierno, ideal para milanesas y escalopes.', '800g-1.2kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "milanesa-fina", "milanesa-gruesa", "cortado-1"}', false, true),
('vacuno-nalga-feteada', 'Nalga Feteada', 'vacuno', 7500, 7500, '/placeholder.svg?height=300&width=300', 'Corte versátil, perfecto para milanesas y bifes.', '1kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "milanesa-fina", "milanesa-gruesa"}', false, true),
('vacuno-bola-lomo', 'Bola de Lomo', 'vacuno', 8200, 8200, '/placeholder.svg?height=300&width=300', 'También conocida como Cuadrada. Corte tierno y jugoso.', '1.2-1.8kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "cortado-2", "cortado-3"}', false, true),
('vacuno-roastbeef', 'Roastbeef', 'vacuno', 8800, 8800, '/placeholder.svg?height=300&width=300', 'Corte premium ideal para hornear. Muy tierno y sabroso.', '1-1.5kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "cortado-2"}', false, true),
('vacuno-paleta', 'Paleta', 'vacuno', 6800, 6800, '/placeholder.svg?height=300&width=300', 'Corte económico ideal para guisos y estofados.', '1.5-2kg aprox.', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "picado", "cortado-3"}', false, true),
('vacuno-lomo-premium', 'Lomo Premium Ternera', 'vacuno', 15500, 15500, '/placeholder.svg?height=300&width=300', 'El corte más tierno y premium. Ideal para ocasiones especiales.', '800g-1.2kg aprox.', 'both', '{"sin-hueso"}', '{"entero", "cortado-1", "cortado-2"}', true, true),
('vacuno-entrania', 'Entraña', 'vacuno', 9800, 9800, '/placeholder.svg?height=300&width=300', 'Corte jugoso y sabroso, perfecto para la parrilla.', '600-900g aprox.', 'both', '{"sin-hueso"}', '{"entero"}', true, true),
('vacuno-bife-chorizo', 'Bife de Chorizo', 'vacuno', 12500, 12500, '/placeholder.svg?height=300&width=300', 'Corte clásico argentino, jugoso y con gran sabor.', '300-400g por unidad', 'both', '{"sin-hueso"}', '{"entero", "cortado-1"}', true, true),

-- CERDO
('cerdo-bondiola', 'Bondiola', 'cerdo', 6500, 6500, '/placeholder.svg?height=300&width=300', 'Corte jugoso y tierno, ideal para hornear o a la parrilla.', '1-1.5kg aprox.', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-2", "cortado-3"}', true, true),
('cerdo-churrasquito', 'Churrasquito de Cerdo', 'cerdo', 7200, 7200, '/placeholder.svg?height=300&width=300', 'También conocido como Solomillo. Corte tierno y magro.', '400-600g aprox.', 'both', '{"sin-hueso"}', '{"entero", "cortado-1", "cortado-2"}', false, true),
('cerdo-matambrito', 'Matambrito de Cerdo', 'cerdo', 5800, 5800, '/placeholder.svg?height=300&width=300', 'Corte tradicional, perfecto para arrollar y hornear.', '800g-1.2kg aprox.', 'both', '{"sin-hueso"}', '{"entero"}', false, true),
('cerdo-ribs', 'Ribs', 'cerdo', 6800, 6800, '/placeholder.svg?height=300&width=300', 'Costillas de cerdo, ideales para barbacoa y parrilla.', '1-1.5kg aprox.', 'both', '{"con-hueso"}', '{"entero", "cortado-2"}', true, true),
('cerdo-pechito', 'Pechito de Cerdo', 'cerdo', 5500, 5500, '/placeholder.svg?height=300&width=300', 'Corte graso y sabroso, perfecto para cocción lenta.', '1.2-1.8kg aprox.', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-3"}', false, true),
('cerdo-carre', 'Carré de Cerdo', 'cerdo', 7800, 7800, '/placeholder.svg?height=300&width=300', 'Corte premium, ideal para ocasiones especiales.', '1-1.5kg aprox.', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-1", "cortado-2"}', false, true),
('cerdo-chorizo-puro', 'Chorizo Puro Cerdo', 'cerdo', 4500, 4500, '/placeholder.svg?height=300&width=300', 'Chorizo artesanal 100% cerdo, sin aditivos.', '500g aprox.', 'both', '{"sin-hueso"}', '{"entero"}', false, true),
('cerdo-morcilla-criolla', 'Morcilla Tipo Criolla', 'cerdo', 3800, 3800, '/placeholder.svg?height=300&width=300', 'Morcilla tradicional argentina, sabor auténtico.', '400g aprox.', 'both', '{"sin-hueso"}', '{"entero"}', false, true),

-- POLLO
('pollo-suprema', 'Suprema de Pollo', 'pollo', 4200, 4200, '/placeholder.svg?height=300&width=300', 'Pechuga de pollo sin hueso, tierna y versátil.', '300-500g por unidad', 'both', '{"sin-hueso"}', '{"entero", "milanesa-fina", "milanesa-gruesa", "cortado-1"}', true, true),
('pollo-churrasquito', 'Churrasquito de Pollo', 'pollo', 3800, 3800, '/placeholder.svg?height=300&width=300', 'Corte tierno de pollo, ideal para parrilla.', '200-300g por unidad', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-1"}', false, true),
('pollo-pata-muslo', 'Pata y Muslo', 'pollo', 2800, 2800, '/placeholder.svg?height=300&width=300', 'Corte jugoso y económico, perfecto para guisos.', '400-600g por unidad', 'both', '{"con-hueso", "sin-hueso"}', '{"entero", "cortado-2"}', false, true),
('pollo-milanesa', 'Milanesa de Pollo', 'pollo', 4500, 4500, '/placeholder.svg?height=300&width=300', 'Milanesas de pollo ya preparadas, listas para cocinar.', '500g aprox.', 'both', '{"sin-hueso"}', '{"milanesa-fina", "milanesa-gruesa"}', false, true)

ON CONFLICT (id) DO NOTHING;
