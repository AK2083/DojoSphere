INSERT OR IGNORE INTO roles (id, name, label_key, description_key, is_system, sort_order) VALUES
  ('94591c6d-cfff-4d14-8d10-c9136f379801', 'audience', 'roles.audience.label', 'roles.audience.description', 1, 10),
  ('8555d323-a577-46d7-a635-fde80462c1e5', 'participant', 'roles.participant.label', 'roles.participant.description', 1, 20),
  ('2789f998-8c48-45c3-9728-ad4ae3b0dfe0', 'score_judge', 'roles.scoreJudge.label', 'roles.scoreJudge.description', 1, 30),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'list_keeper', 'roles.listKeeper.label', 'roles.listKeeper.description', 1, 40),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'competition_manager', 'roles.competitionManager.label', 'roles.competitionManager.description', 1, 50);

INSERT OR IGNORE INTO permissions (id, resource, action, label_key, description_key, sort_order) VALUES
  ('f3439136-81e3-4911-9dd4-1afe27cb8a9b', 'participants-overview', 'read', 'permissions.participants-overview.read.label', 'permissions.participants-overview.read.description', 10),
  ('e97b5d38-2732-485e-ac39-4de2ac063222', 'participants-overview', 'create', 'permissions.participants-overview.create.label', 'permissions.participants-overview.create.description', 20),
  ('842865b3-47ec-499b-91a2-952fc97fb81d', 'participants-overview', 'update', 'permissions.participants-overview.update.label', 'permissions.participants-overview.update.description', 30),
  ('a01f845d-ef6f-40b6-8b83-3e1d04680ebf', 'participants-overview', 'delete', 'permissions.participants-overview.delete.label', 'permissions.participants-overview.delete.description', 40);

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
