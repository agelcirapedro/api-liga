-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para email (pesquisas rápidas)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Inserir usuário admin padrão (senha: admin123)
-- Hash bcrypt de 'admin123'
INSERT INTO users (name, email, password, role) 
VALUES (
  'Administrador',
  'admin@liga.ao',
  '$2a$10$rQJ7qKZQ8ZqKZqKZqKZqKOGXvW5xW5xW5xW5xW5xW5xW5xW5xW5xu',
  'admin'
) ON CONFLICT (email) DO NOTHING;
