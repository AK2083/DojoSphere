-- Clubs overview permissions (read/create/update/delete)
INSERT OR IGNORE INTO permissions (id, resource, action, label_key, description_key, sort_order) VALUES
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f901', 'clubs-overview', 'read', 'permissions.clubs-overview.read.label', 'permissions.clubs-overview.read.description', 50),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f902', 'clubs-overview', 'create', 'permissions.clubs-overview.create.label', 'permissions.clubs-overview.create.description', 60),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f903', 'clubs-overview', 'update', 'permissions.clubs-overview.update.label', 'permissions.clubs-overview.update.description', 70),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f904', 'clubs-overview', 'delete', 'permissions.clubs-overview.delete.label', 'permissions.clubs-overview.delete.description', 80);

-- List Keeper
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f901'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f902'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f903'),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f904');

-- Competition Manager
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f901'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f902'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f903'),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'b1c2d3e4-5f60-7182-93a4-b5c6d7e8f904');
