-- Associations overview permissions (read/create/update/delete)
INSERT OR IGNORE INTO permissions (id, resource, action, label_key, description_key, sort_order) VALUES
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f901', 'associations-overview', 'read', 'permissions.associations-overview.read.label', 'permissions.associations-overview.read.description', 50),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f902', 'associations-overview', 'create', 'permissions.associations-overview.create.label', 'permissions.associations-overview.create.description', 60),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f903', 'associations-overview', 'update', 'permissions.associations-overview.update.label', 'permissions.associations-overview.update.description', 70),
  ('b1c2d3e4-5f60-7182-93a4-b5c6d7e8f904', 'associations-overview', 'delete', 'permissions.associations-overview.delete.label', 'permissions.associations-overview.delete.description', 80);

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
