CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,

  PRIMARY KEY (role_id, permission_id),

  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- List Keeper
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'f3439136-81e3-4911-9dd4-1afe27cb8a9b'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'e97b5d38-2732-485e-ac39-4de2ac063222'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', '842865b3-47ec-499b-91a2-952fc97fb81d'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'a01f845d-ef6f-40b6-8b83-3e1d04680ebf');

-- Competition Manager
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'f3439136-81e3-4911-9dd4-1afe27cb8a9b'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'e97b5d38-2732-485e-ac39-4de2ac063222'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', '842865b3-47ec-499b-91a2-952fc97fb81d'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'a01f845d-ef6f-40b6-8b83-3e1d04680ebf');
