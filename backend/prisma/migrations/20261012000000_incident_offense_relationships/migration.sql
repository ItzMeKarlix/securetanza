-- Retain every legacy row and ID; new relationships are backfilled in place.
BEGIN;
CREATE TABLE "incidents" (
  "id" TEXT PRIMARY KEY, "key" TEXT NOT NULL UNIQUE, "blotter_no" TEXT, "station" TEXT,
  "has_multiple_offenses" BOOLEAN NOT NULL DEFAULT false, "offense_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "offense_definitions" ("id" TEXT PRIMARY KEY, "code" TEXT NOT NULL UNIQUE, "label" TEXT NOT NULL);
ALTER TABLE "crime_incidents"
  ADD COLUMN "incident_id" TEXT, ADD COLUMN "offense_definition_id" TEXT,
  ADD COLUMN "import_key" TEXT, ADD COLUMN "crime_type" TEXT,
  ADD COLUMN "felony_stage" TEXT NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "source_file" TEXT, ADD COLUMN "source_sheet" TEXT, ADD COLUMN "source_row" INTEGER;

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

CREATE TEMP TABLE _securetanza_backfill ON COMMIT DROP AS
WITH normalized AS (
  SELECT c.*, _securetanza_norm(offense) AS norm_offense,
    _securetanza_norm(incident_type) AS norm_type,
    CASE WHEN upper(_securetanza_norm(stage_of_felony)) IN ('CONSUMMATED','FRUSTRATED','ATTEMPTED')
      THEN upper(_securetanza_norm(stage_of_felony)) ELSE 'UNKNOWN' END AS stage
  FROM crime_incidents c
), keyed AS (
  SELECT *,
    CASE WHEN _securetanza_norm(blotter_no) NOT IN ('','-','n/a','none','null')
      THEN 'blotter:' || coalesce(nullif(_securetanza_norm(station),''),nullif(_securetanza_norm(municipality),''),'unknown-station') || '|' || _securetanza_norm(blotter_no)
      ELSE 'comp:' || _securetanza_norm(station) || '|' || _securetanza_norm(barangay) || '|' || to_char(date_committed,'YYYY-MM-DD') || '|' || _securetanza_time(time_committed) || '|' || norm_type || '|' || norm_offense || '|' || to_char(date_reported,'YYYY-MM-DD') || '|' || _securetanza_time(time_reported)
    END AS incident_key,
    CASE WHEN norm_offense<>'' THEN norm_offense ELSE 'unclassified:' || _securetanza_norm(regexp_replace(incident_type,'^\((Incident|Operation)\)\s*','','i')) END AS offense_code,
    CASE norm_offense
      WHEN 'comprehensive dangerous drugs act of 2002 - ra 9165' THEN 'Dangerous Drugs Law (RA 9165)'
      WHEN 'anti-violence against women and their children act of 2004 - ra 9262' THEN 'Violence Against Women and Children (RA 9262)'
      WHEN 'special protection of children against child abuse, exploitation and discrimination act. (anti- child abuse law) - ra 7610' THEN 'Child Protection Law (RA 7610)'
      WHEN 'comprehensive law on firearms and ammunition - ra 10591 (covers ra 9516, ra 8294, pd 1866)' THEN 'Firearms and Ammunition Law (RA 10591)'
      WHEN 'anti-rape law of 1997 - ra 8353' THEN 'Rape (RA 8353)'
      WHEN 'act promoting stronger protection against rape, sexual exploitation, abuse, amending act no. 3815, ra no. 8353, ra no. 7610 - ra 11648' THEN 'Sexual Offenses Law (RA 11648)'
      WHEN 'new anti-carnapping act of 2016 - mc - ra 10883 (repealed ra 6539)' THEN 'Carnapping — Motorcycle (RA 10883)'
      WHEN 'new anti-carnapping act of 2016 - mv - ra 10883 (repealed ra 6539)' THEN 'Carnapping — Motor Vehicle (RA 10883)'
      WHEN 'safe spaces act (gender based sexual harassment) - ra 11313' THEN 'Safe Spaces Law (RA 11313)'
      WHEN 'anti-fencing law of 1979 - pd 1612' THEN 'Anti-Fencing Law (PD 1612)'
      WHEN 'anti-electricity and electric transmission lines/materials pilferage act of 1994 - ra 7832' THEN 'Electricity Pilferage Law (RA 7832)'
      WHEN 'land transportation and traffic code (compulsary registration of motor vehicles) - ra 4136 as amended by bp blg 74' THEN 'Motor Vehicle Registration Law (RA 4136)'
      WHEN 'penalizing obstruction of apprehension and prosecution of criminal offenders. - pd 1829' THEN 'Obstruction of Apprehension and Prosecution (PD 1829)'
      WHEN 'the forestry reform code of the philippines (illegal logging) - pd 705' THEN 'Forestry Law (PD 705)'
      WHEN 'illegal possession, manufacture, acquisition, of firearms, ammunition or explosives - pd 1866 as amended by ra 8294 and ra 9516' THEN 'Firearms, Ammunition and Explosives Law (PD 1866)'
      WHEN 'illegal possession of bladed, pointed or blunt weapons - bp 6' THEN 'Illegal Possession of Bladed, Pointed or Blunt Weapons (BP 6)'
      WHEN 'anti-gambling law - pd 1602' THEN 'Illegal Gambling (PD 1602)'
      WHEN 'anti-cable television and cable internet tapping act of 2013 - ra 10515' THEN 'Cable Television and Internet Tapping Law (RA 10515)'
      ELSE CASE WHEN norm_offense<>'' THEN initcap(split_part(norm_offense,' - ',1))
        ELSE 'Unclassified' || CASE WHEN btrim(regexp_replace(incident_type,'^\((Incident|Operation)\)\s*','','i'))<>''
          THEN ' · ' || btrim(regexp_replace(incident_type,'^\((Incident|Operation)\)\s*','','i')) ELSE '' END END
    END AS category
  FROM normalized
)
SELECT id, incident_key, offense_code, category, stage,
  md5('[' || to_json(incident_key)::text || ',' || to_json(CASE WHEN norm_offense<>'' THEN norm_offense ELSE 'unclassified:' || norm_type END)::text || ',' || to_json(stage)::text || ',' || to_json(_securetanza_norm(section))::text || ']') AS import_key
FROM keyed;

INSERT INTO incidents(id,key,blotter_no,station,created_at,updated_at)
SELECT 'inc_' || md5(b.incident_key), b.incident_key, min(c.blotter_no), min(c.station), min(c.created_at), max(c.updated_at)
FROM _securetanza_backfill b JOIN crime_incidents c ON c.id=b.id GROUP BY b.incident_key;
INSERT INTO offense_definitions(id,code,label)
SELECT 'off_' || md5(offense_code), offense_code, min(category) FROM _securetanza_backfill GROUP BY offense_code;
UPDATE crime_incidents c SET incident_id='inc_' || md5(b.incident_key), offense_definition_id='off_' || md5(b.offense_code),
  felony_stage=b.stage,
  crime_type=CASE b.stage WHEN 'FRUSTRATED' THEN 'Frustrated ' WHEN 'ATTEMPTED' THEN 'Attempted ' WHEN 'UNKNOWN' THEN 'Unknown Stage · ' ELSE '' END || b.category
FROM _securetanza_backfill b WHERE c.id=b.id;
-- Keep pre-existing exact duplicates, assigning the re-import guard to the earliest.
WITH ranked AS (
  SELECT b.id,b.import_key,row_number() OVER (PARTITION BY b.import_key ORDER BY c.created_at,c.id) AS ordinal
  FROM _securetanza_backfill b JOIN crime_incidents c ON c.id=b.id
)
UPDATE crime_incidents c SET import_key=r.import_key FROM ranked r WHERE c.id=r.id AND r.ordinal=1;
UPDATE incidents i SET offense_count=q.count, has_multiple_offenses=q.distinct_count>1
FROM (SELECT incident_id,count(*)::integer AS count,count(DISTINCT offense_definition_id)::integer AS distinct_count FROM crime_incidents GROUP BY incident_id) q WHERE i.id=q.incident_id;
ALTER TABLE crime_incidents ALTER COLUMN incident_id SET NOT NULL, ALTER COLUMN offense_definition_id SET NOT NULL, ALTER COLUMN crime_type SET NOT NULL;
ALTER TABLE crime_incidents ADD CONSTRAINT crime_incidents_incident_id_fkey FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE crime_incidents ADD CONSTRAINT crime_incidents_offense_definition_id_fkey FOREIGN KEY (offense_definition_id) REFERENCES offense_definitions(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE crime_incidents ADD CONSTRAINT crime_incidents_felony_stage_check CHECK (felony_stage IN ('CONSUMMATED','FRUSTRATED','ATTEMPTED','UNKNOWN'));
CREATE UNIQUE INDEX crime_incidents_import_key_key ON crime_incidents(import_key);
CREATE INDEX crime_incidents_incident_id_idx ON crime_incidents(incident_id);
CREATE INDEX crime_incidents_offense_definition_id_idx ON crime_incidents(offense_definition_id);
CREATE INDEX crime_incidents_crime_type_felony_stage_idx ON crime_incidents(crime_type,felony_stage);
DROP FUNCTION _securetanza_time(TEXT);
DROP FUNCTION _securetanza_norm(TEXT);
COMMIT;
