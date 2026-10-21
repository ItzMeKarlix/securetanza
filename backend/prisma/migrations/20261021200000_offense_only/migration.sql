-- Offenses stand alone. The incident grouping (the incidents table and each
-- record's incident_id) and the workbook's "Incident Type" columns are removed,
-- and the register is renamed crime_incidents -> offenses. No offense is deleted.
--
-- Import keys are recomputed first, because the old ones included Incident Type.
-- The new key is the runtime fingerprint in backend/lib/crime-deduplication.ts:
--   md5(JSON [source key, offense or 'unclassified', stage, section])
-- where the source key is the station-scoped blotter number, or — without a
-- blotter — station, barangay, committed date/time, offense, reported date/time.
-- Exact duplicates are kept; only the earliest of them carries the key.

BEGIN;

CREATE FUNCTION _securetanza_norm(value TEXT) RETURNS TEXT LANGUAGE SQL IMMUTABLE AS $$
  SELECT lower(btrim(regexp_replace(coalesce(value,''), '\s+', ' ', 'g')))
$$;
CREATE FUNCTION _securetanza_time(value TEXT) RETURNS TEXT LANGUAGE SQL IMMUTABLE AS $$
  SELECT CASE WHEN coalesce(value,'')='' THEN '00:00:00'
    WHEN position(':' in btrim(value))>0 THEN
      lpad(split_part(btrim(value),':',1),2,'0') || ':' || lpad(split_part(btrim(value),':',2),2,'0') || ':' ||
      lpad(coalesce(nullif(split_part(btrim(value),':',3),''),'00'),2,'0')
    ELSE lower(btrim(value)) END
$$;

CREATE TEMP TABLE _securetanza_rekey AS
WITH normalized AS (
  SELECT c.id, c.created_at, _securetanza_norm(c.offense) AS norm_offense,
    CASE WHEN upper(_securetanza_norm(c.stage_of_felony)) IN ('CONSUMMATED','FRUSTRATED','ATTEMPTED')
      THEN upper(_securetanza_norm(c.stage_of_felony)) ELSE 'UNKNOWN' END AS stage,
    CASE WHEN _securetanza_norm(c.blotter_no) NOT IN ('','-','n/a','none','null')
      THEN 'blotter:' || coalesce(nullif(_securetanza_norm(c.station),''),nullif(_securetanza_norm(c.municipality),''),'unknown-station') || '|' || _securetanza_norm(c.blotter_no)
      ELSE 'comp:' || _securetanza_norm(c.station) || '|' || _securetanza_norm(c.barangay) || '|' || to_char(c.date_committed,'YYYY-MM-DD') || '|' || _securetanza_time(c.time_committed) || '|' || _securetanza_norm(c.offense) || '|' || to_char(c.date_reported,'YYYY-MM-DD') || '|' || _securetanza_time(c.time_reported)
    END AS source_key,
    _securetanza_norm(c.section) AS norm_section
  FROM crime_incidents c
)
SELECT id, created_at,
  md5('[' || to_json(source_key)::text || ',' || to_json(CASE WHEN norm_offense<>'' THEN norm_offense ELSE 'unclassified' END)::text || ',' || to_json(stage)::text || ',' || to_json(norm_section)::text || ']') AS import_key
FROM normalized;

-- Clear first so a row's new key can't collide with another row's old one.
UPDATE crime_incidents SET import_key = NULL;
WITH ranked AS (
  SELECT id, import_key, row_number() OVER (PARTITION BY import_key ORDER BY created_at, id) AS ordinal
  FROM _securetanza_rekey
)
UPDATE crime_incidents c SET import_key = r.import_key FROM ranked r WHERE c.id = r.id AND r.ordinal = 1;

DROP TABLE _securetanza_rekey;
DROP FUNCTION _securetanza_norm(TEXT);
DROP FUNCTION _securetanza_time(TEXT);

-- Remove the incident grouping and the Incident Type columns (their indexes go with them).
ALTER TABLE crime_incidents DROP CONSTRAINT IF EXISTS crime_incidents_incident_id_fkey;
ALTER TABLE crime_incidents
  DROP COLUMN IF EXISTS incident_id,
  DROP COLUMN IF EXISTS incident_type,
  DROP COLUMN IF EXISTS incident_type_threat_grp;
DROP TABLE IF EXISTS incidents;

-- crime_incidents -> offenses, with its indexes and constraints renamed to match.
ALTER TABLE crime_incidents RENAME TO offenses;
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes WHERE schemaname = current_schema() AND tablename = 'offenses' AND indexname LIKE 'crime\_incidents%' LOOP
    EXECUTE format('ALTER INDEX %I RENAME TO %I', r.indexname, 'offenses' || substr(r.indexname, length('crime_incidents') + 1));
  END LOOP;
  -- Primary key and unique constraints were renamed with their indexes above.
  FOR r IN SELECT conname FROM pg_constraint WHERE conrelid = 'offenses'::regclass AND conname LIKE 'crime\_incidents%' LOOP
    EXECUTE format('ALTER TABLE offenses RENAME CONSTRAINT %I TO %I', r.conname, 'offenses' || substr(r.conname, length('crime_incidents') + 1));
  END LOOP;
END $$;

COMMIT;
