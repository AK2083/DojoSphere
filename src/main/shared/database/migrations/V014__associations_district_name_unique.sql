-- Ensure district names are unique within a regional federation so free-text
-- district fields on the association form resolve to a single district row.
CREATE UNIQUE INDEX IF NOT EXISTS idx_districts_regional_federation_name
  ON districts (regional_federation_id, name);
