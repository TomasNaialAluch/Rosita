-- Crear tabla para configuración de entregas
CREATE TABLE IF NOT EXISTS delivery_config (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, 2=Martes, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_orders INTEGER DEFAULT NULL, -- Límite de pedidos por franja (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_delivery_config_day_active ON delivery_config(day_of_week, is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_config_time ON delivery_config(start_time, end_time);

-- Insertar configuración por defecto (Martes y Viernes de 9:00 a 18:00)
INSERT INTO delivery_config (day_of_week, start_time, end_time, is_active) VALUES
(2, '09:00:00', '18:00:00', true), -- Martes
(5, '09:00:00', '18:00:00', true)  -- Viernes
ON CONFLICT DO NOTHING;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_delivery_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_delivery_config_updated_at ON delivery_config;
CREATE TRIGGER trigger_update_delivery_config_updated_at
  BEFORE UPDATE ON delivery_config
  FOR EACH ROW
  EXECUTE FUNCTION update_delivery_config_updated_at();
