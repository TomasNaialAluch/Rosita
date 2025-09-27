-- Script para arreglar la estructura de la tabla products
-- Este script se ejecuta solo si hay problemas con la tabla actual

-- Crear tabla temporal con la estructura correcta
CREATE TABLE IF NOT EXISTS products_new (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('vacuno', 'cerdo', 'pollo')),
    price DECIMAL(10,2) NOT NULL,
    price_per_kilo DECIMAL(10,2),
    image TEXT,
    description TEXT,
    weight VARCHAR(100),
    sell_by VARCHAR(20) NOT NULL DEFAULT 'both' CHECK (sell_by IN ('unidad', 'kilo', 'both')),
    bone_options TEXT[] DEFAULT ARRAY['sin-hueso'],
    format_options TEXT[] DEFAULT ARRAY['entero'],
    featured BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    minimum_kg DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Si la tabla original existe y tiene datos, migrarlos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        -- Migrar datos existentes
        INSERT INTO products_new (
            name, category, price, price_per_kilo, image, description, 
            weight, sell_by, bone_options, format_options, featured, in_stock, minimum_kg
        )
        SELECT 
            name, category, price, price_per_kilo, image, description,
            weight, sell_by, bone_options, format_options, featured, in_stock, minimum_kg
        FROM products
        ON CONFLICT DO NOTHING;
        
        -- Eliminar tabla antigua
        DROP TABLE products;
    END IF;
END $$;

-- Renombrar tabla nueva
ALTER TABLE products_new RENAME TO products;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Crear trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar productos de ejemplo si la tabla está vacía
INSERT INTO products (
    name, category, price, price_per_kilo, image, description, weight, 
    sell_by, bone_options, format_options, featured, in_stock, minimum_kg
) VALUES
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
ON CONFLICT DO NOTHING;
