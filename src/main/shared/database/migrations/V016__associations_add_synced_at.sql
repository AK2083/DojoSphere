-- Add synced_at column to every association hierarchy table.
-- synced_at records the local timestamp at which a row was last written from
-- the Supabase cloud source. A NULL value means the row has never been synced
-- (i.e. it was seeded locally or created manually).
--
-- Used by the incremental sync logic to compare against Supabase updated_at:
-- only rows where Supabase updated_at > local synced_at (or synced_at IS NULL)
-- are fetched and upserted, preventing duplicate downloads.

ALTER TABLE countries ADD COLUMN synced_at TEXT;
ALTER TABLE federations ADD COLUMN synced_at TEXT;
ALTER TABLE regional_federations ADD COLUMN synced_at TEXT;
ALTER TABLE districts ADD COLUMN synced_at TEXT;
ALTER TABLE associations ADD COLUMN synced_at TEXT;
