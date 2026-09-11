-- Association numbers (Vereinsnummer) must be unique across associations.
CREATE UNIQUE INDEX IF NOT EXISTS idx_association_identifiers_djb_number
  ON association_identifiers (value)
  WHERE type = 'djb_association_number';
