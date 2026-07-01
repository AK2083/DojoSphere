CREATE TABLE IF NOT EXISTS age_classes (
  id TEXT PRIMARY KEY,
  djb_row INTEGER NOT NULL CHECK (djb_row BETWEEN 1 AND 18),
  gender TEXT NOT NULL CHECK (gender IN ('f', 'm')),
  competition_form TEXT NOT NULL CHECK (competition_form IN ('individual', 'team')),
  label_key TEXT NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  age_display TEXT,
  fight_time_minutes INTEGER NOT NULL CHECK (fight_time_minutes IN (2, 3, 4)),
  birth_years TEXT NOT NULL,
  weight_mode TEXT NOT NULL CHECK (weight_mode IN ('fixed', 'flexible')),
  ruleset_version TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE (djb_row, ruleset_version)
);

CREATE INDEX idx_age_classes_sort_order ON age_classes(sort_order);
CREATE INDEX idx_age_classes_ruleset ON age_classes(ruleset_version);

INSERT INTO age_classes (
  id, djb_row, gender, competition_form, label_key,
  min_age, max_age, age_display, fight_time_minutes, birth_years, weight_mode,
  ruleset_version, sort_order
) VALUES
  ('c2000000-0000-4000-8000-000000000001', 1, 'm', 'individual', 'ageClasses.djb2025.row01', 8, 10, NULL, 2, '15/16/17', 'flexible', 'djb-2025', 1),
  ('c2000000-0000-4000-8000-000000000002', 2, 'm', 'individual', 'ageClasses.djb2025.row02', 10, 12, NULL, 3, '13/14/15', 'flexible', 'djb-2025', 2),
  ('c2000000-0000-4000-8000-000000000003', 3, 'm', 'individual', 'ageClasses.djb2025.row03', 12, 14, NULL, 3, '11/12/13', 'fixed', 'djb-2025', 3),
  ('c2000000-0000-4000-8000-000000000004', 4, 'm', 'team', 'ageClasses.djb2025.row04', 12, 14, NULL, 3, '11/12/13', 'fixed', 'djb-2025', 4),
  ('c2000000-0000-4000-8000-000000000005', 5, 'm', 'individual', 'ageClasses.djb2025.row05', 15, 17, NULL, 4, '08/09/10', 'fixed', 'djb-2025', 5),
  ('c2000000-0000-4000-8000-000000000006', 6, 'm', 'team', 'ageClasses.djb2025.row06', 14, 17, NULL, 4, '08/09/10/11', 'fixed', 'djb-2025', 6),
  ('c2000000-0000-4000-8000-000000000007', 7, 'm', 'individual', 'ageClasses.djb2025.row07', 17, 20, NULL, 4, '05/06/07/08', 'fixed', 'djb-2025', 7),
  ('c2000000-0000-4000-8000-000000000008', 8, 'm', 'individual', 'ageClasses.djb2025.row08', 17, NULL, 'from 17', 4, '08 and older', 'fixed', 'djb-2025', 8),
  ('c2000000-0000-4000-8000-000000000009', 9, 'm', 'team', 'ageClasses.djb2025.row09', 16, NULL, 'from 16', 4, '09 and older', 'fixed', 'djb-2025', 9),
  ('c2000000-0000-4000-8000-00000000000a', 10, 'f', 'individual', 'ageClasses.djb2025.row10', 8, 10, NULL, 2, '15/16/17', 'flexible', 'djb-2025', 10),
  ('c2000000-0000-4000-8000-00000000000b', 11, 'f', 'individual', 'ageClasses.djb2025.row11', 10, 12, NULL, 3, '13/14/15', 'flexible', 'djb-2025', 11),
  ('c2000000-0000-4000-8000-00000000000c', 12, 'f', 'individual', 'ageClasses.djb2025.row12', 12, 14, NULL, 3, '11/12/13', 'fixed', 'djb-2025', 12),
  ('c2000000-0000-4000-8000-00000000000d', 13, 'f', 'team', 'ageClasses.djb2025.row13', 12, 14, NULL, 3, '11/12/13', 'fixed', 'djb-2025', 13),
  ('c2000000-0000-4000-8000-00000000000e', 14, 'f', 'individual', 'ageClasses.djb2025.row14', 15, 17, NULL, 4, '08/09/10', 'fixed', 'djb-2025', 14),
  ('c2000000-0000-4000-8000-00000000000f', 15, 'f', 'team', 'ageClasses.djb2025.row15', 14, 17, NULL, 4, '08/09/10/11', 'fixed', 'djb-2025', 15),
  ('c2000000-0000-4000-8000-000000000010', 16, 'f', 'individual', 'ageClasses.djb2025.row16', 17, 20, NULL, 4, '05/06/07/08', 'fixed', 'djb-2025', 16),
  ('c2000000-0000-4000-8000-000000000011', 17, 'f', 'individual', 'ageClasses.djb2025.row17', 17, NULL, 'from 17', 4, '08 and older', 'fixed', 'djb-2025', 17),
  ('c2000000-0000-4000-8000-000000000012', 18, 'f', 'team', 'ageClasses.djb2025.row18', 16, NULL, 'from 16', 4, '08 and older', 'fixed', 'djb-2025', 18);
