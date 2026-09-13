-- =========================================
-- Usuarios dedicados por microservicio
-- (Database per Service - aislamiento de accesos)
-- =========================================

------------ auth-service ----------
CREATE USER auth_user WITH PASSWORD 'auth_pass_dev';
REVOKE CONNECT ON DATABASE auth_db FROM public;
GRANT CONNECT ON DATABASE auth_db TO auth_user;

------------ employee-service ----------
CREATE USER employee_user WITH PASSWORD 'employee_pass_dev';
REVOKE CONNECT ON DATABASE employee_db FROM public;
GRANT CONNECT ON DATABASE employee_db TO employee_user;

 
------------ patient-service ----------
CREATE USER patient_user WITH PASSWORD 'patient_pass_dev';
REVOKE CONNECT ON DATABASE patient_db FROM public;
GRANT CONNECT ON DATABASE patient_db TO patient_user;


------------ medicalrecord-service ----------
CREATE USER medicalrecord_user WITH PASSWORD 'medicalrecord_pass_dev';
REVOKE CONNECT ON DATABASE medicalrecord_db FROM public;
GRANT CONNECT ON DATABASE medicalrecord_db TO medicalrecord_user;


------------ ai-service ----------
CREATE USER ai_user WITH PASSWORD 'ai_pass_dev';
REVOKE CONNECT ON DATABASE ai_db FROM public;
GRANT CONNECT ON DATABASE ai_db TO ai_user;
