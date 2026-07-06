-- Renames the participant coach/supervisor field to contact_person (Kontaktperson).

ALTER TABLE competitors RENAME COLUMN coach TO contact_person;
