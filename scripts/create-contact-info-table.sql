-- Crear tabla para información de contacto editable
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255),
  content TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  hours JSONB,
  extra_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_contact_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_info_updated_at();

-- Insertar datos por defecto
INSERT INTO contact_info (section, title, content, phone, email, address, hours, extra_info) VALUES
('location', 'Ubicación', 'Trabajamos tanto de forma física como online para tu comodidad', '+54 11 1234-5678', 'info@rositacarniceria.com', 'C. Jose E. Rodo 6341, C1440 Ciudad Autónoma de Buenos Aires', 
'{"lunes_viernes": "8:00 - 20:00", "sabados": "8:00 - 18:00", "domingos": "9:00 - 14:00"}', 
'Respaldados por: Frigorífico La Trinidad S.A. - Certificación 5 Estrellas en Calidad')
ON CONFLICT (section) DO NOTHING;

-- Crear índice para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_contact_info_section ON contact_info(section);
