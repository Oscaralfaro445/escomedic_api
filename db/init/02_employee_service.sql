-- =========================================
-- Employee Service - Schema
-- =========================================

\c employee_db

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE employee (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE, -- referencia logica
  name        VARCHAR(30) NOT NULL,
  last_name_p VARCHAR(30) NOT NULL,
  last_name_m VARCHAR(30) NOT NULL,
  phone       VARCHAR(15),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_employee_user_id ON employee(user_id);

GRANT USAGE ON SCHEMA public TO employee_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO employee_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO employee_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO employee_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO employee_user;