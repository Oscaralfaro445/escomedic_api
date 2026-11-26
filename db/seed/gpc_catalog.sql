-- Guías (una fila por GPC)
INSERT INTO gpc_index (gpc_code, condition_name, category, grr_url, ger_url) VALUES 
  ('032-08', 'Bronquiolitis aguda en niñas/niños y en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/032GER.pdf'),
  ('718-18', 'Diabetes mellitus tipo 2 en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/718GER.pdf'),
  ('076-08', 'Hipertensión arterial en el primer nivel de atención', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/076GER.pdf'),
  ('041-08', 'Rinítis alérgica', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/041GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/041GER.pdf'),
  ('000-00', 'Asma en mayores de 18 años', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/000GRR_Asma.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/000GER_Asma.pdf'),
  ('441-11', 'Dolor neuropático en mayores de 18 años', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/441GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/441GER.pdf'),
  ('046-18', 'Sobrepeso y obesidad exógena', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/046GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/046GER.pdf'),
  ('071-08', 'Dispepsia funcional', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/071GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/071GER.pdf'),
  ('042-08', 'Intestino irritable en el adulto', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/042GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/042GER.pdf'),
  ('384-09', 'Influenza Estacional', 'Primer nivel de atención', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/384GRR.pdf', 'https://www.imss.gob.mx/sites/all/statics/guiasclinicas/384GER.pdf')

ON CONFLICT (gpc_code) DO NOTHING;

-- Códigos CIE-10 que cubre cada guía (una fila por par guía-código)
INSERT INTO gpc_condition_code (gpc_id, cie10_code)
SELECT g.id, v.cie10
FROM (VALUES
  ('032-08', 'J21'),
  ('032-08', 'J21.0'),
  ('032-08', 'J20.9'),
  ('718-18', 'E11'),
  ('076-08', 'I10'),
  ('076-08', 'I10.0'),
  ('041-08', 'J30'),
  ('041-08', 'J30.0'),
  ('041-08', 'J30.1'),
  ('041-08', 'J30.2'),
  ('041-08', 'J30.3'),
  ('041-08', 'J30.4'),
  ('000-00', 'J45'),
  ('000-00', 'J46'),
  ('441-11', 'G53'),
  ('441-11', 'G54'),
  ('441-11', 'G56'),
  ('441-11', 'G57'),
  ('441-11', 'G58'),
  ('441-11', 'G59'),
  ('441-11', 'G60'),
  ('441-11', 'G61'),
  ('441-11', 'G62'),
  ('046-18', 'E66'),
  ('071-08', 'K30'),
  ('042-08', 'K58'),
  ('384-09', 'J10'),
  ('384-09', 'J100'),
  ('384-09', 'J101'),
  ('384-09', 'J108'),
  ('384-09', 'J11'),
  ('384-09', 'J11'),
  ('384-09', 'J110'),
  ('384-09', 'J111'),
  ('384-09', 'J118'),
  ('384-09', 'Z25'),
  ('384-09', 'Z251')
) AS v(gpc_code, cie10)
JOIN gpc_index g ON g.gpc_code = v.gpc_code
ON CONFLICT (gpc_id, cie10_code) DO NOTHING;