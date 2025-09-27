-- Crear tabla de noticias
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author VARCHAR(100) DEFAULT 'Rosita Carnicería',
  category VARCHAR(50) DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar noticias de ejemplo
INSERT INTO news (title, slug, excerpt, content, image_url, category, tags, is_featured) VALUES
(
  'Nueva línea de cortes premium disponible',
  'nueva-linea-cortes-premium',
  'Descubre nuestra nueva selección de cortes premium, cuidadosamente seleccionados para los paladares más exigentes.',
  'En Rosita Carnicería Premium nos complace anunciar el lanzamiento de nuestra nueva línea de cortes premium. Estos cortes han sido cuidadosamente seleccionados de los mejores proveedores de la región, garantizando la máxima calidad y frescura.

Nuestra nueva línea incluye:
- Bife de chorizo premium
- Ojo de bife madurado
- Entraña especial
- Vacío premium

Cada corte pasa por un riguroso proceso de selección y maduración para asegurar la mejor experiencia gastronómica. Visitanos en nuestra tienda o realiza tu pedido online.',
  '/placeholder.svg?height=400&width=600',
  'productos',
  ARRAY['premium', 'cortes', 'carne', 'calidad'],
  TRUE
),
(
  'Horarios especiales para las fiestas',
  'horarios-especiales-fiestas',
  'Conoce nuestros horarios especiales durante las fiestas navideñas y de fin de año.',
  'Durante las fiestas navideñas y de fin de año, Rosita Carnicería Premium tendrá horarios especiales para mejor atenderte:

**Diciembre:**
- 24 de diciembre: 8:00 a 14:00
- 25 de diciembre: CERRADO
- 31 de diciembre: 8:00 a 16:00

**Enero:**
- 1 de enero: CERRADO
- A partir del 2 de enero: horarios normales

Te recomendamos realizar tus pedidos con anticipación para garantizar la disponibilidad de todos los productos que necesitas para tus celebraciones.',
  '/placeholder.svg?height=400&width=600',
  'avisos',
  ARRAY['horarios', 'fiestas', 'navidad', 'avisos'],
  FALSE
),
(
  'Consejos para conservar la carne fresca',
  'consejos-conservar-carne-fresca',
  'Aprende los mejores métodos para mantener la carne fresca por más tiempo y conservar su sabor.',
  'La correcta conservación de la carne es fundamental para mantener su calidad, sabor y propiedades nutricionales. Aquí te compartimos algunos consejos esenciales:

**Refrigeración:**
- Mantén la carne entre 0°C y 4°C
- Usa la carne fresca dentro de 2-3 días
- Coloca la carne en la parte más fría del refrigerador

**Congelación:**
- La carne puede congelarse hasta 6 meses
- Envuelve bien para evitar quemaduras por frío
- Descongela lentamente en el refrigerador

**Envasado al vacío:**
- Extiende la vida útil hasta 3 veces más
- Mantiene el sabor y la textura
- Ideal para compras grandes

En Rosita Carnicería ofrecemos servicio de envasado al vacío para todos nuestros productos.',
  '/placeholder.svg?height=400&width=600',
  'consejos',
  ARRAY['conservación', 'tips', 'carne', 'frescura'],
  FALSE
);
