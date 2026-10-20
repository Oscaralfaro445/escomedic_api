-- =========================================
-- Auth Service - Schema
-- =========================================

\c auth_db

-- Habilita la generación de UUIDs (gen_random_uuid) si no está ya disponible
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- Tabla: Role ----------

CREATE TABLE role (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(40) NOT NULL UNIQUE
);

INSERT INTO role (name) VALUES ('administrador'), ('doctor');

---------- Tabla: User ----------

CREATE TABLE "user" (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id       UUID NOT NULL REFERENCES role(id),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')), -- 'active' o 'inactive'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------- Tabla: Session ----------

CREATE TABLE session (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, 
  token      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

---------- Tabla: Password_Reset_Token ----------

CREATE TABLE password_reset_token (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Índices adicionales ----------
-- Acelera búsquedas por user_id (logout, listar sesiones activas, etc.)

CREATE INDEX idx_sessio_user_id ON session(user_id);
CREATE INDEX idx_password_reset_token_user_id ON password_reset_token(user_id);

GRANT USAGE ON SCHEMA public TO auth_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO auth_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO auth_user;