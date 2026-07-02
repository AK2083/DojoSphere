CREATE TABLE IF NOT EXISTS weight_classes (
  id TEXT PRIMARY KEY,
  age_class_id TEXT NOT NULL
    REFERENCES age_classes(id) ON DELETE RESTRICT,
  djb_row INTEGER NOT NULL,
  max_weight_kg REAL,
  min_weight_kg REAL,
  label_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  CHECK (max_weight_kg IS NOT NULL OR min_weight_kg IS NOT NULL)
);

CREATE INDEX idx_weight_classes_age_class_id
ON weight_classes(age_class_id, sort_order);

CREATE INDEX idx_weight_classes_djb_row
ON weight_classes(djb_row, sort_order);
INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000001', id, 3, 34, NULL, 'weightClasses.djb2025.row03.minus34', 1
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000002', id, 3, 37, NULL, 'weightClasses.djb2025.row03.minus37', 2
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000003', id, 3, 40, NULL, 'weightClasses.djb2025.row03.minus40', 3
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000004', id, 3, 43, NULL, 'weightClasses.djb2025.row03.minus43', 4
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000005', id, 3, 46, NULL, 'weightClasses.djb2025.row03.minus46', 5
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000006', id, 3, 50, NULL, 'weightClasses.djb2025.row03.minus50', 6
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000007', id, 3, 55, NULL, 'weightClasses.djb2025.row03.minus55', 7
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000008', id, 3, 60, NULL, 'weightClasses.djb2025.row03.minus60', 8
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000009', id, 3, 66, NULL, 'weightClasses.djb2025.row03.minus66', 9
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000010', id, 3, NULL, 66, 'weightClasses.djb2025.row03.plus66', 10
FROM age_classes WHERE djb_row = 3 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000011', id, 4, 40, NULL, 'weightClasses.djb2025.row04.minus40', 1
FROM age_classes WHERE djb_row = 4 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000012', id, 4, 46, NULL, 'weightClasses.djb2025.row04.minus46', 2
FROM age_classes WHERE djb_row = 4 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000013', id, 4, 55, NULL, 'weightClasses.djb2025.row04.minus55', 3
FROM age_classes WHERE djb_row = 4 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000014', id, 4, 66, NULL, 'weightClasses.djb2025.row04.minus66', 4
FROM age_classes WHERE djb_row = 4 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000015', id, 4, NULL, 64, 'weightClasses.djb2025.row04.plus64', 5
FROM age_classes WHERE djb_row = 4 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000016', id, 5, 46, NULL, 'weightClasses.djb2025.row05.minus46', 1
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000017', id, 5, 50, NULL, 'weightClasses.djb2025.row05.minus50', 2
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000018', id, 5, 55, NULL, 'weightClasses.djb2025.row05.minus55', 3
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000019', id, 5, 60, NULL, 'weightClasses.djb2025.row05.minus60', 4
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000020', id, 5, 66, NULL, 'weightClasses.djb2025.row05.minus66', 5
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000021', id, 5, 73, NULL, 'weightClasses.djb2025.row05.minus73', 6
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000022', id, 5, 81, NULL, 'weightClasses.djb2025.row05.minus81', 7
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000023', id, 5, 90, NULL, 'weightClasses.djb2025.row05.minus90', 8
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000024', id, 5, NULL, 90, 'weightClasses.djb2025.row05.plus90', 9
FROM age_classes WHERE djb_row = 5 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000025', id, 6, 50, NULL, 'weightClasses.djb2025.row06.minus50', 1
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000026', id, 6, 55, NULL, 'weightClasses.djb2025.row06.minus55', 2
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000027', id, 6, 60, NULL, 'weightClasses.djb2025.row06.minus60', 3
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000028', id, 6, 66, NULL, 'weightClasses.djb2025.row06.minus66', 4
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000029', id, 6, 73, NULL, 'weightClasses.djb2025.row06.minus73', 5
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000030', id, 6, NULL, 73, 'weightClasses.djb2025.row06.plus73', 6
FROM age_classes WHERE djb_row = 6 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000031', id, 7, 60, NULL, 'weightClasses.djb2025.row07.minus60', 1
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000032', id, 7, 66, NULL, 'weightClasses.djb2025.row07.minus66', 2
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000033', id, 7, 73, NULL, 'weightClasses.djb2025.row07.minus73', 3
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000034', id, 7, 81, NULL, 'weightClasses.djb2025.row07.minus81', 4
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000035', id, 7, 90, NULL, 'weightClasses.djb2025.row07.minus90', 5
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000036', id, 7, 100, NULL, 'weightClasses.djb2025.row07.minus100', 6
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000037', id, 7, NULL, 100, 'weightClasses.djb2025.row07.plus100', 7
FROM age_classes WHERE djb_row = 7 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000038', id, 8, 60, NULL, 'weightClasses.djb2025.row08.minus60', 1
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000039', id, 8, 66, NULL, 'weightClasses.djb2025.row08.minus66', 2
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000040', id, 8, 73, NULL, 'weightClasses.djb2025.row08.minus73', 3
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000041', id, 8, 81, NULL, 'weightClasses.djb2025.row08.minus81', 4
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000042', id, 8, 90, NULL, 'weightClasses.djb2025.row08.minus90', 5
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000043', id, 8, 100, NULL, 'weightClasses.djb2025.row08.minus100', 6
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000044', id, 8, NULL, 100, 'weightClasses.djb2025.row08.plus100', 7
FROM age_classes WHERE djb_row = 8 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000045', id, 9, 60, NULL, 'weightClasses.djb2025.row09.minus60', 1
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000046', id, 9, 66, NULL, 'weightClasses.djb2025.row09.minus66', 2
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000047', id, 9, 73, NULL, 'weightClasses.djb2025.row09.minus73', 3
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000048', id, 9, 81, NULL, 'weightClasses.djb2025.row09.minus81', 4
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000049', id, 9, 90, NULL, 'weightClasses.djb2025.row09.minus90', 5
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000050', id, 9, 100, NULL, 'weightClasses.djb2025.row09.minus100', 6
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000051', id, 9, NULL, 100, 'weightClasses.djb2025.row09.plus100', 7
FROM age_classes WHERE djb_row = 9 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000052', id, 12, 33, NULL, 'weightClasses.djb2025.row12.minus33', 1
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000053', id, 12, 36, NULL, 'weightClasses.djb2025.row12.minus36', 2
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000054', id, 12, 40, NULL, 'weightClasses.djb2025.row12.minus40', 3
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000055', id, 12, 44, NULL, 'weightClasses.djb2025.row12.minus44', 4
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000056', id, 12, 48, NULL, 'weightClasses.djb2025.row12.minus48', 5
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000057', id, 12, 52, NULL, 'weightClasses.djb2025.row12.minus52', 6
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000058', id, 12, 57, NULL, 'weightClasses.djb2025.row12.minus57', 7
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000059', id, 12, 63, NULL, 'weightClasses.djb2025.row12.minus63', 8
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000060', id, 12, NULL, 63, 'weightClasses.djb2025.row12.plus63', 9
FROM age_classes WHERE djb_row = 12 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000061', id, 13, 40, NULL, 'weightClasses.djb2025.row13.minus40', 1
FROM age_classes WHERE djb_row = 13 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000062', id, 13, 48, NULL, 'weightClasses.djb2025.row13.minus48', 2
FROM age_classes WHERE djb_row = 13 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000063', id, 13, 57, NULL, 'weightClasses.djb2025.row13.minus57', 3
FROM age_classes WHERE djb_row = 13 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000064', id, 13, 63, NULL, 'weightClasses.djb2025.row13.minus63', 4
FROM age_classes WHERE djb_row = 13 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000065', id, 13, NULL, 61, 'weightClasses.djb2025.row13.plus61', 5
FROM age_classes WHERE djb_row = 13 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000066', id, 14, 40, NULL, 'weightClasses.djb2025.row14.minus40', 1
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000067', id, 14, 44, NULL, 'weightClasses.djb2025.row14.minus44', 2
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000068', id, 14, 48, NULL, 'weightClasses.djb2025.row14.minus48', 3
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000069', id, 14, 52, NULL, 'weightClasses.djb2025.row14.minus52', 4
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000070', id, 14, 57, NULL, 'weightClasses.djb2025.row14.minus57', 5
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000071', id, 14, 63, NULL, 'weightClasses.djb2025.row14.minus63', 6
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000072', id, 14, 70, NULL, 'weightClasses.djb2025.row14.minus70', 7
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000073', id, 14, 78, NULL, 'weightClasses.djb2025.row14.minus78', 8
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000074', id, 14, NULL, 78, 'weightClasses.djb2025.row14.plus78', 9
FROM age_classes WHERE djb_row = 14 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000075', id, 15, 44, NULL, 'weightClasses.djb2025.row15.minus44', 1
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000076', id, 15, 48, NULL, 'weightClasses.djb2025.row15.minus48', 2
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000077', id, 15, 52, NULL, 'weightClasses.djb2025.row15.minus52', 3
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000078', id, 15, 57, NULL, 'weightClasses.djb2025.row15.minus57', 4
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000079', id, 15, 63, NULL, 'weightClasses.djb2025.row15.minus63', 5
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000080', id, 15, NULL, 63, 'weightClasses.djb2025.row15.plus63', 6
FROM age_classes WHERE djb_row = 15 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000081', id, 16, 48, NULL, 'weightClasses.djb2025.row16.minus48', 1
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000082', id, 16, 52, NULL, 'weightClasses.djb2025.row16.minus52', 2
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000083', id, 16, 57, NULL, 'weightClasses.djb2025.row16.minus57', 3
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000084', id, 16, 63, NULL, 'weightClasses.djb2025.row16.minus63', 4
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000085', id, 16, 70, NULL, 'weightClasses.djb2025.row16.minus70', 5
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000086', id, 16, 78, NULL, 'weightClasses.djb2025.row16.minus78', 6
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000087', id, 16, NULL, 78, 'weightClasses.djb2025.row16.plus78', 7
FROM age_classes WHERE djb_row = 16 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000088', id, 17, 48, NULL, 'weightClasses.djb2025.row17.minus48', 1
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000089', id, 17, 52, NULL, 'weightClasses.djb2025.row17.minus52', 2
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000090', id, 17, 57, NULL, 'weightClasses.djb2025.row17.minus57', 3
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000091', id, 17, 63, NULL, 'weightClasses.djb2025.row17.minus63', 4
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000092', id, 17, 70, NULL, 'weightClasses.djb2025.row17.minus70', 5
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000093', id, 17, 78, NULL, 'weightClasses.djb2025.row17.minus78', 6
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000094', id, 17, NULL, 78, 'weightClasses.djb2025.row17.plus78', 7
FROM age_classes WHERE djb_row = 17 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000095', id, 18, 48, NULL, 'weightClasses.djb2025.row18.minus48', 1
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000096', id, 18, 52, NULL, 'weightClasses.djb2025.row18.minus52', 2
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000097', id, 18, 57, NULL, 'weightClasses.djb2025.row18.minus57', 3
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000098', id, 18, 63, NULL, 'weightClasses.djb2025.row18.minus63', 4
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000099', id, 18, 70, NULL, 'weightClasses.djb2025.row18.minus70', 5
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000100', id, 18, 78, NULL, 'weightClasses.djb2025.row18.minus78', 6
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';

INSERT INTO weight_classes (id, age_class_id, djb_row, max_weight_kg, min_weight_kg, label_key, sort_order)
SELECT 'b3000000-0000-4000-8000-000000000101', id, 18, NULL, 78, 'weightClasses.djb2025.row18.plus78', 7
FROM age_classes WHERE djb_row = 18 AND ruleset_version = 'djb-2025';