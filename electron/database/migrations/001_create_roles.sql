CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label_key TEXT NOT NULL,
  description_key TEXT,
  is_system INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO roles (id, name, label_key, description_key, is_system, sort_order) VALUES
  ('94591c6d-cfff-4d14-8d10-c9136f379801', 'spectator', 'roles.spectator.label', 'roles.spectator.description', 1, 10),
  ('8555d323-a577-46d7-a635-fde80462c1e5', 'participant', 'roles.participant.label', 'roles.participant.description', 1, 20),
  ('2789f998-8c48-45c3-9728-ad4ae3b0dfe0', 'score_judge', 'roles.scoreJudge.label', 'roles.scoreJudge.description', 1, 30),
  ('a413eb25-7777-439d-80c0-d87e8231e363', 'list_keeper', 'roles.listKeeper.label', 'roles.listKeeper.description', 1, 40),
  ('c6a0b9c6-d171-4d30-b1a9-80751868bd27', 'competition_manager', 'roles.competitionManager.label', 'roles.competitionManager.description', 1, 50);
