-- =========================================
-- Medical Record Service - Schema
-- =========================================

\c medicalrecord_db

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE medical_record (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE medical_history (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id           UUID NOT NULL UNIQUE REFERENCES medical_record(id) ON DELETE CASCADE,
  hereditary_background       JSONB NOT NULL DEFAULT '{}',
  pathological_background     JSONB NOT NULL DEFAULT '{}',
  non_pathological_background JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE consultation_status (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(30) NOT NULL UNIQUE
);

-- Catalogo fijo

INSERT INTO consultation_status (name) VALUES
  ('abierta (en curso)'),
  ('cerrada (finalizada)'),
  ('cancelada (no realizada)');

CREATE TABLE consultation(
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id          UUID NOT NULL REFERENCES medical_record(id) ON DELETE CASCADE,
  employee_id                UUID NOT NULL,
  status_id                  UUID NOT NULL REFERENCES consultation_status(id),
  date                       DATE NOT NULL,
  time                       TIME NOT NULL,
  reason                     TEXT NOT NULL,
  current_condition          TEXT NOT NULL,
  vital_signs                JSONB NOT NULL,
  physical_examination JSONB NOT NULL DEFAULT '{}',
  notes                      TEXT,
  diagnosis                  TEXT NOT NULL,
  cie10_code                 VARCHAR(10),
  treatment                  TEXT,
  prevention                 TEXT,
  referred                   BOOLEAN NOT NULL DEFAULT false,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consultation_medical_record_id ON consultation(medical_record_id);
CREATE INDEX idx_consultation_status_id ON consultation(status_id);

GRANT USAGE ON SCHEMA public TO medicalrecord_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO medicalrecord_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO medicalrecord_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO medicalrecord_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO medicalrecord_user;