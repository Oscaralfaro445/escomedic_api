--
-- PostgreSQL database dump
--

\restrict Pyx1DJl4BlACpgK6soJOQQrbxdoXVDaoid7sDh97wSV47Wxt0JmgmueL9FbpJpU

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: gpc_index; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gpc_index (id, gpc_code, condition_name, category, grr_url, ger_url, grr_file_id, ger_file_id, is_active, last_processed, created_at, updated_at) VALUES ('a6ea5791-b456-4047-bd12-980d67d4c709', '718-18', 'Diabetes mellitus tipo 2 en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GER.pdf', NULL, NULL, true, NULL, '2026-11-06 06:06:36.537729+00', '2026-11-06 06:06:36.537729+00');
INSERT INTO public.gpc_index (id, gpc_code, condition_name, category, grr_url, ger_url, grr_file_id, ger_file_id, is_active, last_processed, created_at, updated_at) VALUES ('b91f7db0-c3c5-4816-84c0-b6e3bbc74aa5', '076-08', 'Hipertensión arterial en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GER.pdf', NULL, NULL, true, NULL, '2026-11-06 06:06:36.537729+00', '2026-11-06 06:06:36.537729+00');
INSERT INTO public.gpc_index (id, gpc_code, condition_name, category, grr_url, ger_url, grr_file_id, ger_file_id, is_active, last_processed, created_at, updated_at) VALUES ('f6de4a2e-033e-4358-b6ac-398e9f34db28', '032-08', 'Bronquiolitis aguda en niñas/niños y en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GER.pdf', 'file-AfhmJkph4f2cK3dqD4Tuyo', 'file-FanW3ruUWXkaHt1jrhYa2k', true, '2026-11-06 06:20:34.282+00', '2026-11-06 06:06:36.537729+00', '2026-11-06 06:06:36.537729+00');


--
-- Data for Name: gpc_cached_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gpc_cached_content (id, gpc_id, source_type, content_json, is_stale, tokens_used, processed_at, created_at, updated_at) VALUES ('030cab17-8ef3-4c43-85e0-367cf54be9be', 'f6de4a2e-033e-4358-b6ac-398e9f34db28', 'GER', '{"alarmas": "Signos de alarma incluyen: dificultad respiratoria, cianosis, letargia, rechazo de alimentos, frecuencia respiratoria mayor de 70/minuto, y signos de deshidratación. Requieren referencia a segundo nivel si se presentan.", "prevencion": "Promocionar la lactancia materna y evitar el hacinamiento. Se deben realizar acciones preventivas durante epidemias, como vacunar o informar sobre síntomas tempranos de bronquiolitis.", "diagnostico": "La bronquiolitis aguda se diagnostica principalmente por criterios clínicos: antecedentes de infección respiratoria, sibilancias, dificultad respiratoria, y exploración física. Se recomienda realizar pruebas de diagnóstico como oxigenometría y, si es necesario, una evaluación radiológica; en casos graves, evaluar la historia clínica y los síntomas con atención especial.", "seguimiento": "Se recomienda seguimiento a los 24-48 horas tras la consulta inicial, especialmente en pacientes con factores de riesgo. Instruir a padres sobre signos de alarma y mantener la vigilancia en el hogar.", "tratamiento": "Paracetamol 10 a 15 mg/kg/dosis cada 6 a 8 horas, por vía oral. Salbutamol 100 a 200 mcg/día, nebulización cada 6 a 8 horas. Adrenalina 0.5 mg/kg/dosis en 2 ml de suero fisiológico, nebulizado. Duración máxima 3 días. Revaluar el caso a las 24-48 horas."}', false, 1273664, '2026-11-06 06:19:52.412+00', '2026-11-06 06:19:52.412+00', '2026-11-06 06:19:52.412+00');
INSERT INTO public.gpc_cached_content (id, gpc_id, source_type, content_json, is_stale, tokens_used, processed_at, created_at, updated_at) VALUES ('620abf2a-f2a1-4ef2-a700-18e6357cb34f', 'f6de4a2e-033e-4358-b6ac-398e9f34db28', 'GRR', '{"alarmas": "Referir a segundo nivel si el paciente presenta dificultad respiratoria grave, saturación de oxígeno menor al 90%, o si hay deshidratación significativa, letargia o apnea.", "prevencion": "Fomentar lactancia materna exclusiva los primeros 6 meses. Evitar el hacinamiento y mantener al niño alejado de enfermos. Educar sobre signos de alarma para buscar atención médica.", "diagnostico": "Sospechar bronquiolitis en niños menores de 2 años con síntomas respiratorios como rinorrea, tos, dificultad respiratoria. Establecer diagnóstico clínico; no se recomienda radiografía de tórax de forma rutinaria.", "seguimiento": "Reevaluar a las 24-48 horas para determinar la evolución. Realizar seguimiento cercano en niños menores de 12 meses que presentaron síntomas de bronquiolitis.", "tratamiento": "Nebulización con solución salina hipertónica al 3% puede ser indicada si hay historia de atopia. Salbutamol 0.15 mg/kg/dosis cada 6-8 horas, máximo 3 días. Administer paracetamol si fiebre igual o mayor a 38°C, dosis de 10 a 15 mg/kg cada 6-8 horas."}', false, 341580, '2026-11-06 06:20:34.27+00', '2026-11-06 06:20:34.27+00', '2026-11-06 06:20:34.27+00');


--
-- Data for Name: gpc_condition_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gpc_condition_code (id, gpc_id, cie10_code, is_primary) VALUES ('1055bb2e-0d35-4e7e-9e13-52aef54b83d9', 'f6de4a2e-033e-4358-b6ac-398e9f34db28', 'J21.0', false);
INSERT INTO public.gpc_condition_code (id, gpc_id, cie10_code, is_primary) VALUES ('f88523d1-7276-4673-984f-cf7cff8d8602', 'f6de4a2e-033e-4358-b6ac-398e9f34db28', 'J21', false);
INSERT INTO public.gpc_condition_code (id, gpc_id, cie10_code, is_primary) VALUES ('a3909529-369a-4634-b837-9b3fe9de19b3', 'a6ea5791-b456-4047-bd12-980d67d4c709', 'E11', false);
INSERT INTO public.gpc_condition_code (id, gpc_id, cie10_code, is_primary) VALUES ('ae571098-6a23-4f71-a5a8-77cc34d77c8d', 'b91f7db0-c3c5-4816-84c0-b6e3bbc74aa5', 'I10.0', false);
INSERT INTO public.gpc_condition_code (id, gpc_id, cie10_code, is_primary) VALUES ('cedd61df-ec96-4570-8bc7-9fec3d4e4e53', 'b91f7db0-c3c5-4816-84c0-b6e3bbc74aa5', 'I10', false);


--
-- PostgreSQL database dump complete
--

\unrestrict Pyx1DJl4BlACpgK6soJOQQrbxdoXVDaoid7sDh97wSV47Wxt0JmgmueL9FbpJpU

