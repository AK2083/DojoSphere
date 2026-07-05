-- Adds the participant-import fields (eligibility, registration status, remarks)
-- and repairs the competitors triggers that V009 dropped when it recreated the
-- table. Using ALTER TABLE keeps existing databases intact (no data loss) instead
-- of requiring a rebuild.
-- Text length limits mirror src/renderer/shared/domain/competitor-field-limits.ts

ALTER TABLE competitors
  ADD COLUMN start_eligible INTEGER NOT NULL DEFAULT 1
    CHECK (start_eligible IN (0, 1));

ALTER TABLE competitors
  ADD COLUMN registration_status TEXT
    CHECK (
      registration_status IS NULL
      OR registration_status IN ('registered', 'late_registration')
    );

ALTER TABLE competitors
  ADD COLUMN remarks TEXT
    CHECK (remarks IS NULL OR length(remarks) <= 500);

-- V009 renamed and dropped the previous table, which removed the triggers defined
-- in V008. Recreate them idempotently so both fresh and existing databases keep the
-- validation logic. The weight-class checks are guarded for the optional (NULL)
-- weight class introduced in V009.
DROP TRIGGER IF EXISTS competitors_set_updated_at;
CREATE TRIGGER competitors_set_updated_at
AFTER UPDATE ON competitors
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
  UPDATE competitors SET updated_at = datetime('now') WHERE id = NEW.id;
END;

DROP TRIGGER IF EXISTS competitors_normalize_nationality_insert;
CREATE TRIGGER competitors_normalize_nationality_insert
BEFORE INSERT ON competitors
WHEN NEW.nationality != UPPER(TRIM(NEW.nationality))
BEGIN
  SELECT RAISE(ABORT, 'nationality must be uppercase ISO 3166-1 alpha-2');
END;

DROP TRIGGER IF EXISTS competitors_normalize_nationality_update;
CREATE TRIGGER competitors_normalize_nationality_update
BEFORE UPDATE ON competitors
WHEN NEW.nationality IS NOT OLD.nationality
  AND NEW.nationality != UPPER(TRIM(NEW.nationality))
BEGIN
  SELECT RAISE(ABORT, 'nationality must be uppercase ISO 3166-1 alpha-2');
END;

DROP TRIGGER IF EXISTS competitors_require_active_club_insert;
CREATE TRIGGER competitors_require_active_club_insert
BEFORE INSERT ON competitors
WHEN (SELECT is_active FROM clubs WHERE id = NEW.club_id) != 1
BEGIN
  SELECT RAISE(ABORT, 'club is not active');
END;

DROP TRIGGER IF EXISTS competitors_require_active_club_update;
CREATE TRIGGER competitors_require_active_club_update
BEFORE UPDATE ON competitors
WHEN NEW.club_id != OLD.club_id
  AND (SELECT is_active FROM clubs WHERE id = NEW.club_id) != 1
BEGIN
  SELECT RAISE(ABORT, 'club is not active');
END;

DROP TRIGGER IF EXISTS competitors_validate_weight_class_insert;
CREATE TRIGGER competitors_validate_weight_class_insert
BEFORE INSERT ON competitors
WHEN NEW.weight_class_id IS NOT NULL
  AND (
    SELECT age_class_id FROM weight_classes WHERE id = NEW.weight_class_id
  ) IS NOT NEW.age_class_id
BEGIN
  SELECT RAISE(ABORT, 'weight_class_id does not match age_class_id');
END;

DROP TRIGGER IF EXISTS competitors_validate_weight_class_update;
CREATE TRIGGER competitors_validate_weight_class_update
BEFORE UPDATE ON competitors
WHEN NEW.weight_class_id IS NOT NULL
  AND (
    NEW.weight_class_id != OLD.weight_class_id
    OR NEW.age_class_id != OLD.age_class_id
  )
  AND (
    SELECT age_class_id FROM weight_classes WHERE id = NEW.weight_class_id
  ) IS NOT NEW.age_class_id
BEGIN
  SELECT RAISE(ABORT, 'weight_class_id does not match age_class_id');
END;
