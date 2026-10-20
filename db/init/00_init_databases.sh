#!/bin/bash
# Database per Service: un usuario y una base de datos por microservicio.
# Las contraseñas llegan por variables de entorno; nunca se versionan en el repo.
set -e

: "${AUTH_DB_PASSWORD:?Falta AUTH_DB_PASSWORD}"
: "${EMPLOYEE_DB_PASSWORD:?Falta EMPLOYEE_DB_PASSWORD}"
: "${PATIENT_DB_PASSWORD:?Falta PATIENT_DB_PASSWORD}"
: "${MEDICALRECORD_DB_PASSWORD:?Falta MEDICALRECORD_DB_PASSWORD}"
: "${AI_DB_PASSWORD:?Falta AI_DB_PASSWORD}"

psql -v ON_ERROR_STOP=1 \
  -v auth_pass="$AUTH_DB_PASSWORD" \
  -v employee_pass="$EMPLOYEE_DB_PASSWORD" \
  -v patient_pass="$PATIENT_DB_PASSWORD" \
  -v medicalrecord_pass="$MEDICALRECORD_DB_PASSWORD" \
  -v ai_pass="$AI_DB_PASSWORD" \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'

CREATE USER auth_user WITH PASSWORD :'auth_pass';
CREATE DATABASE auth_db;
REVOKE CONNECT ON DATABASE auth_db FROM PUBLIC;
GRANT CONNECT ON DATABASE auth_db TO auth_user;

CREATE USER employee_user WITH PASSWORD :'employee_pass';
CREATE DATABASE employee_db;
REVOKE CONNECT ON DATABASE employee_db FROM PUBLIC;
GRANT CONNECT ON DATABASE employee_db TO employee_user;

CREATE USER patient_user WITH PASSWORD :'patient_pass';
CREATE DATABASE patient_db;
REVOKE CONNECT ON DATABASE patient_db FROM PUBLIC;
GRANT CONNECT ON DATABASE patient_db TO patient_user;

CREATE USER medicalrecord_user WITH PASSWORD :'medicalrecord_pass';
CREATE DATABASE medicalrecord_db;
REVOKE CONNECT ON DATABASE medicalrecord_db FROM PUBLIC;
GRANT CONNECT ON DATABASE medicalrecord_db TO medicalrecord_user;

CREATE USER ai_user WITH PASSWORD :'ai_pass';
CREATE DATABASE ai_db;
REVOKE CONNECT ON DATABASE ai_db FROM PUBLIC;
GRANT CONNECT ON DATABASE ai_db TO ai_user;


-- Cerramos el hueco para que ningún usuario pueda conectarse a la base de datos postgres, que es la que viene por defecto en el contenedor.
REVOKE CONNECT ON DATABASE postgres FROM PUBLIC;

EOSQL