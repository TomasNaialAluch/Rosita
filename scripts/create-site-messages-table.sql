-- Crear tabla para mensajes del sitio
CREATE TABLE IF NOT EXISTS site_messages (
  id SERIAL PRIMARY KEY,
  message_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  content TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  message_type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error, promo
  target_audience VARCHAR(50) DEFAULT 'all', -- all, guests, users
  display_conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_site_messages_key ON site_messages(message_key);
CREATE INDEX IF NOT EXISTS idx_site_messages_active ON site_messages(is_active);
CREATE INDEX IF NOT EXISTS idx_site_messages_type ON site_messages(message_type);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_site_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_messages_updated_at
  BEFORE UPDATE ON site_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_site_messages_updated_at();

-- Insertar mensajes por defecto
INSERT INTO site_messages (message_key, title, content, button_text, button_link, message_type, target_audience, display_conditions) VALUES
('welcome_banner', '¡Bienvenido a Rosita! 👋', 'Únete a más de 1,000 familias que confían en nosotros', 'Registrarse', '/register', 'promo', 'guests', '{"delay": 5000, "showOnPages": ["/"]}'),
('shopping_users', '23 personas comprando ahora', '', '', '', 'info', 'all', '{}'),
('floating_cta_title', '¿Necesitas ayuda?', '', 'Contactar', '/contacto', 'info', 'all', '{}'),
('floating_cta_subtitle', 'Estamos aquí para ayudarte', '', '', '', 'info', 'all', '{}'),
('delivery_promo', '🚚 Envío gratis en compras mayores a $15,000', '', 'Ver productos', '/tienda', 'success', 'all', '{}'),
('quality_guarantee', '✅ Garantía de calidad - Certificación 5 estrellas', '', '', '', 'success', 'all', '{}')
ON CONFLICT (message_key) DO NOTHING;
