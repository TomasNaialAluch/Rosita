-- Insertar usuarios de prueba
USE rosita_carniceria;

-- Usuario administrador
INSERT INTO users (name, email, password_hash, phone, address, is_admin, email_verified) VALUES
('Administrador Rosita', 'admin@rosita.com', '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8VKG8Z8GiVTlbx/iYmZr5.5Qg6Qm6e', '+54 11 1234-5678', 'C. Jose E. Rodo 6341, C1440 CABA', TRUE, TRUE);

-- Usuarios de prueba
INSERT INTO users (name, email, password_hash, phone, address, email_verified) VALUES
('Juan Pérez', 'juan@email.com', '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8VKG8Z8GiVTlbx/iYmZr5.5Qg6Qm6e', '+54 11 2345-6789', 'Av. Corrientes 1234, CABA', TRUE),
('María González', 'maria@email.com', '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8VKG8Z8GiVTlbx/iYmZr5.5Qg6Qm6e', '+54 11 3456-7890', 'Av. Santa Fe 5678, CABA', TRUE),
('Carlos López', 'carlos@email.com', '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8VKG8Z8GiVTlbx/iYmZr5.5Qg6Qm6e', '+54 11 4567-8901', 'Av. Rivadavia 9012, CABA', FALSE);

-- Nota: El password_hash corresponde a la contraseña "123456" hasheada con bcrypt
-- En un entorno real, las contraseñas deberían ser hasheadas en el backend
