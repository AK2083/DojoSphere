CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label_key TEXT NOT NULL,
  description_key TEXT,
  is_system INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  label_key TEXT NOT NULL,
  description_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (resource, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,

  PRIMARY KEY (role_id, permission_id),

  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,

  display_name TEXT NOT NULL,
  email TEXT,

  user_type TEXT NOT NULL DEFAULT 'local'
    CHECK (user_type IN ('local', 'device', 'system')),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS user_role_assignments (
  id TEXT PRIMARY KEY,

  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,

  scope_type TEXT NOT NULL
    CHECK (scope_type IN ('global', 'tournament', 'mat', 'club', 'participant', 'fight_list')),

  scope_id TEXT,

  created_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  revoked_at TEXT,
  revoked_by_user_id TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  FOREIGN KEY (revoked_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS join_codes (
  id TEXT PRIMARY KEY,

  scope_type TEXT NOT NULL
    CHECK (scope_type IN ('global', 'tournament', 'mat', 'club', 'participant', 'fight_list')),

  scope_id TEXT,

  code_hash TEXT NOT NULL UNIQUE,

  allowed_role_id TEXT,

  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  expires_at TEXT NOT NULL,
  revoked_at TEXT,

  FOREIGN KEY (allowed_role_id) REFERENCES roles(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS access_requests (
  id TEXT PRIMARY KEY,

  requested_display_name TEXT NOT NULL,
  requested_role_id TEXT NOT NULL,

  requested_scope_type TEXT NOT NULL DEFAULT 'global'
    CHECK (requested_scope_type IN ('global', 'tournament', 'mat', 'club', 'participant', 'fight_list')),

  requested_scope_id TEXT,

  requested_user_id TEXT,

  device_name TEXT,
  device_fingerprint TEXT,
  ip_address TEXT,
  user_agent TEXT,

  request_token_hash TEXT NOT NULL UNIQUE,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),

  requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,

  approved_by_user_id TEXT,
  approved_user_id TEXT,
  approved_assignment_id TEXT,
  approved_at TEXT,

  rejected_at TEXT,
  rejection_reason TEXT,

  consumed_at TEXT,

  FOREIGN KEY (requested_role_id) REFERENCES roles(id),
  FOREIGN KEY (requested_user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by_user_id) REFERENCES users(id),
  FOREIGN KEY (approved_user_id) REFERENCES users(id),
  FOREIGN KEY (approved_assignment_id) REFERENCES user_role_assignments(id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,

  user_id TEXT NOT NULL,

  token_hash TEXT NOT NULL UNIQUE,

  access_request_id TEXT,

  device_fingerprint TEXT,
  ip_address TEXT,
  user_agent TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,

  revoked_at TEXT,
  revoked_by_user_id TEXT,

  last_seen_at TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (access_request_id) REFERENCES access_requests(id),
  FOREIGN KEY (revoked_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS authorization_audit_logs (
  id TEXT PRIMARY KEY,

  actor_user_id TEXT,

  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,

  old_value_json TEXT,
  new_value_json TEXT,

  ip_address TEXT,
  user_agent TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE INDEX idx_role_permissions_permission_id
ON role_permissions(permission_id);

CREATE INDEX idx_user_role_assignments_user_id
ON user_role_assignments(user_id);

CREATE INDEX idx_user_role_assignments_role_id
ON user_role_assignments(role_id);

CREATE INDEX idx_user_role_assignments_scope
ON user_role_assignments(scope_type, scope_id);

CREATE INDEX idx_user_role_assignments_active
ON user_role_assignments(user_id, revoked_at);

CREATE INDEX idx_join_codes_code_hash
ON join_codes(code_hash);

CREATE INDEX idx_join_codes_expires_at
ON join_codes(expires_at);

CREATE INDEX idx_access_requests_status
ON access_requests(status);

CREATE INDEX idx_access_requests_expires_at
ON access_requests(expires_at);

CREATE INDEX idx_access_requests_requested_scope
ON access_requests(requested_scope_type, requested_scope_id);

CREATE INDEX idx_access_requests_token_hash
ON access_requests(request_token_hash);

CREATE INDEX idx_sessions_token_hash
ON sessions(token_hash);

CREATE INDEX idx_sessions_user_id
ON sessions(user_id);

CREATE INDEX idx_sessions_expires_at
ON sessions(expires_at);

CREATE INDEX idx_sessions_active
ON sessions(user_id, revoked_at, expires_at);

CREATE INDEX idx_authorization_audit_logs_actor
ON authorization_audit_logs(actor_user_id);

CREATE INDEX idx_authorization_audit_logs_entity
ON authorization_audit_logs(entity_type, entity_id);
