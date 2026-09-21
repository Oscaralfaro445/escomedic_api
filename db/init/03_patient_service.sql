-- =========================================
-- Patient Service - Schema
-- =========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE patient (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(30) NOT NULL,
    last_name_p      VARCHAR(30) NOT NULL,
    last_name_m      VARCHAR(30) NOT NULL,
    gender           VARCHAR(20) NOT NULL CHECK (gender IN ('masculino', 'femenino', 'otro')),
    blood_type       VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    birth_date       DATE NOT NULL,
    phone            VARCHAR(16),
    email            VARCHAR(50),
    address          VARCHAR(100) NOT NULL,
    marital_status   VARCHAR(20) NOT NULL,
    institutional_id VARCHAR(20) NOT NULL UNIQUE,
    type             VARCHAR(15) NOT NULL CHECK (type IN ('Alumno', 'Docente', 'PAAE', 'Externo')),
    origin           VARCHAR(15) NOT NULL CHECK (origin IN ('ESCOM', 'CIC', 'Externo')),
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE patient_contact (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  name         VARCHAR(30) NOT NULL,
  last_name    VARCHAR(30) NOT NULL,
  relationship VARCHAR(40) NOT NULL,
  phone        VARCHAR(16) NOT NULL
);

CREATE INDEX idx_patient_contact_patient_id ON patient_contact(patient_id);