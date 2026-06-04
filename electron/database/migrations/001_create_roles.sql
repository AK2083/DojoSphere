CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  label_key TEXT NOT NULL,
  description_key TEXT,
  is_system INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO roles (id, label_key, description_key, is_system, sort_order) VALUES
  ('spectator', 'roles.spectator.label', 'roles.spectator.description', 1, 10),
  ('participant', 'roles.participant.label', 'roles.participant.description', 1, 20),
  ('score_judge', 'roles.scoreJudge.label', 'roles.scoreJudge.description', 1, 30),
  ('list_keeper', 'roles.listKeeper.label', 'roles.listKeeper.description', 1, 40),
  ('competition_manager', 'roles.competitionManager.label', 'roles.competitionManager.description', 1, 50);
