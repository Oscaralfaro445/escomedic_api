-- =========================================
-- Employee Service - Schema
-- =========================================

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