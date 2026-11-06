-- Guías (una fila por GPC)
INSERT INTO gpc_index (gpc_code, condition_name, category, grr_url, ger_url) VALUES
  ('032-08', 'Bronquiolitis aguda en niñas/niños y en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GER.pdf'),
  ('718-18', 'Diabetes mellitus tipo 2 en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GER.pdf'),
  ('076-08', 'Hipertensión arterial en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GER.pdf')
ON CONFLICT (gpc_code) DO NOTHING;

-- Códigos CIE-10 que cubre cada guía (una fila por par guía-código)
INSERT INTO gpc_condition_code (gpc_id, cie10_code)
SELECT g.id, v.cie10
FROM (VALUES
  ('032-08', 'J21'),
  ('032-08', 'J21.0'),
  ('718-18', 'E11'),
  ('076-08', 'I10'),
  ('076-08', 'I10.0')
) AS v(gpc_code, cie10)
JOIN gpc_index g ON g.gpc_code = v.gpc_code
ON CONFLICT (gpc_id, cie10_code) DO NOTHING;