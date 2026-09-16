-- Association numbers (Vereinsregisternummer) must be unique across associations.
CREATE UNIQUE INDEX IF NOT EXISTS idx_association_identifiers_vereinsregister_number
  ON association_identifiers (value)
  WHERE type = 'vereinsregister_number';
