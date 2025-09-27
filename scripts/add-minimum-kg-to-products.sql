-- Agregar columna minimum_kg a la tabla products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS minimum_kg DECIMAL(5,2);

-- Asegurar que la tabla tenga un ID auto-generado si no lo tiene
-- Primero verificamos si la columna id existe y es del tipo correcto
DO $$
BEGIN
    -- Si la tabla no tiene una secuencia para el ID, la creamos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'id' 
        AND column_default LIKE 'nextval%'
    ) THEN
        -- Crear secuencia si no existe
        CREATE SEQUENCE IF NOT EXISTS products_id_seq;
        
        -- Alterar la columna para usar la secuencia
        ALTER TABLE products 
        ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
        
        -- Asignar la secuencia a la columna
        ALTER SEQUENCE products_id_seq OWNED BY products.id;
        
        -- Si hay registros existentes sin ID, asignarles IDs
        UPDATE products SET id = nextval('products_id_seq') WHERE id IS NULL;
    END IF;
    
    -- Ensure the id column is properly set up as auto-increment
    -- Check if id column exists and is properly configured
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'id'
    ) THEN
        -- Make sure id column has a default value (auto-increment)
        ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
        
        -- Create sequence if it doesn't exist
        CREATE SEQUENCE IF NOT EXISTS products_id_seq OWNED BY products.id;
        
        -- Set the sequence to start from the next available number
        SELECT setval('products_id_seq', COALESCE(MAX(id), 0) + 1, false) FROM products;
    END IF;
END $$;

-- Actualizar productos existentes con valores de minimum_kg de ejemplo
UPDATE products SET minimum_kg = 1.0 WHERE category = 'vacuno' AND minimum_kg IS NULL;
UPDATE products SET minimum_kg = 1.0 WHERE category = 'cerdo' AND minimum_kg IS NULL;
UPDATE products SET minimum_kg = 0.3 WHERE category = 'pollo' AND minimum_kg IS NULL;

-- Insert some example products if table is empty
INSERT INTO products (
    name, category, price, price_per_kilo, image, description, weight, 
    sell_by, bone_options, format_options, featured, in_stock, minimum_kg
) 
SELECT * FROM (VALUES
    ('Asado del Medio', 'vacuno', 8500, 8500, '/placeholder.svg?height=300&width=300', 
     'Corte tradicional argentino, ideal para asados familiares. Jugoso y sabroso.', 
     '1.5-2 kg aprox.', 'both', ARRAY['con-hueso', 'sin-hueso'], 
     ARRAY['entero', 'cortado-2', 'cortado-3'], true, true, 1.0),
    
    ('Vacío Premium', 'vacuno', 9200, 9200, '/placeholder.svg?height=300&width=300',
     'Corte premium de vacío, tierno y jugoso. Perfecto para parrilla.',
     '1-1.5 kg aprox.', 'both', ARRAY['sin-hueso'],
     ARRAY['entero', 'cortado-2', 'cortado-3'], true, true, 1.0),
     
    ('Bondiola', 'cerdo', 6500, 6500, '/placeholder.svg?height=300&width=300',
     'Corte jugoso y tierno, ideal para hornear o a la parrilla.',
     '1-1.5kg aprox.', 'both', ARRAY['con-hueso', 'sin-hueso'],
     ARRAY['entero', 'cortado-2', 'cortado-3'], true, true, 1.0),
     
    ('Suprema de Pollo', 'pollo', 4200, 4200, '/placeholder.svg?height=300&width=300',
     'Pechuga de pollo sin hueso, tierna y versátil.',
     '300-500g por unidad', 'both', ARRAY['sin-hueso'],
     ARRAY['entero', 'milanesa-fina', 'milanesa-gruesa', 'cortado-1'], true, true, 0.3)
) AS v(name, category, price, price_per_kilo, image, description, weight, sell_by, bone_options, format_options, featured, in_stock, minimum_kg)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Agregar algunos valores específicos basados en el nombre del producto
UPDATE products SET minimum_kg = 1.5 WHERE name LIKE '%Paleta%' AND minimum_kg IS NULL;
UPDATE products SET minimum_kg = 0.3 WHERE name LIKE '%Bife%' AND minimum_kg IS NULL;
UPDATE products SET minimum_kg = 0.6 WHERE name LIKE '%Entraña%' AND minimum_kg IS NULL;

-- Comentario sobre el campo
COMMENT ON COLUMN products.minimum_kg IS 'Cantidad mínima en kilogramos que se debe comprar de este producto';
