CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  label_key TEXT NOT NULL,
  description_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (resource, action)
);

INSERT OR IGNORE INTO permissions (id, resource, action, label_key, description_key, sort_order) VALUES
  ('f3439136-81e3-4911-9dd4-1afe27cb8a9b', 'participants-overview', 'read', 'permissions.participants-overview.read.label', 'permissions.participants-overview.read.description', 10),
  ('e97b5d38-2732-485e-ac39-4de2ac063222', 'participants-overview', 'create', 'permissions.participants-overview.create.label', 'permissions.participants-overview.create.description', 20),
  ('842865b3-47ec-499b-91a2-952fc97fb81d', 'participants-overview', 'update', 'permissions.participants-overview.update.label', 'permissions.participants-overview.update.description', 30),
  ('a01f845d-ef6f-40b6-8b83-3e1d04680ebf', 'participants-overview', 'delete', 'permissions.participants-overview.delete.label', 'permissions.participants-overview.delete.description', 40);
