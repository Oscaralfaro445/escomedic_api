-- =========================================
-- AI Service - Schema
-- =========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE gpc_index (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gpc_code       VARCHAR(10) UNIQUE,
  condition_name TEXT NOT NULL,
  category       VARCHAR(60),
  grr_url        TEXT NOT NULL,
  ger_url        TEXT NOT NULL,
  grr_file_id    VARCHAR(80),
  ger_file_id    VARCHAR(80),
  is_active      BOOLEAN NOT NULL DEFAULT true,
  last_processed TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gpc_cached_content (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gpc_id       UUID NOT NULL REFERENCES gpc_index(id) ON DELETE CASCADE,
  source_type  VARCHAR(5) NOT NULL CHECK (source_type IN ('GER', 'GRR')),
  content_json JSONB NOT NULL,
  is_stale     BOOLEAN NOT NULL DEFAULT false,
  tokens_used  INT,
  processed_at TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (gpc_id, source_type)
);

CREATE TABLE ai_request_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_type   VARCHAR(20) NOT NULL CHECK (endpoint_type IN ('summary', 'cie10_match', 'treatment')),
  patient_id      UUID NOT NULL,
  consultation_id UUID NOT NULL,
  employee_id     UUID NOT NULL,
  gpc_id          UUID REFERENCES gpc_index(id),
  prompt_send     TEXT NOT NULL,
  model_used      VARCHAR(40) NOT NULL,
  tokens_input    INT,
  tokens_output   INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_response_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID NOT NULL REFERENCES ai_request_log(id) ON DELETE CASCADE,
  response_raw    TEXT NOT NULL,
  response_parsed JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gpc_condition_code (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gpc_id     UUID NOT NULL REFERENCES gpc_index(id) ON DELETE CASCADE,
  cie10_code VARCHAR(10) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (gpc_id, cie10_code)
);

CREATE INDEX idx_ai_request_log_patient_id ON ai_request_log(patient_id);
CREATE INDEX idx_ai_request_log_consultation_id ON ai_request_log(consultation_id);
CREATE INDEX idx_gpc_cached_content_gpc_id ON gpc_cached_content(gpc_id);
CREATE INDEX idx_gpc_condition_code_cie10_code ON gpc_condition_code(cie10_code);

INSERT INTO gpc_index (cie10_code, condition_name, category, grr_url, ger_url, grr_file_id, ger_file_id)
VALUES (
  'J03.9',
  'Amigdalitis aguda',
  'Medicina Familiar',
  'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/062GRR.pdf',
  'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/062GER.pdf',
);
