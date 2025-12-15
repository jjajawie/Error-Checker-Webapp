import Database from "better-sqlite3";

// Repo-safe + portable:
// When you run the backend from /server, this file will be created in /server/error_tracker.db
export const db = new Database("./error_tracker.db");

// Sensible defaults for local dev
try {
  db.pragma("journal_mode = WAL");
} catch {
  // WAL may not be supported on some environments; ignore
}
db.pragma("foreign_keys = ON");


// Minimal schema that matches the current React mock fields.
// tags are stored as JSON text (e.g. ["frontend","react"]).
db.exec(`
  CREATE TABLE IF NOT EXISTS errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    occurrences INTEGER NOT NULL DEFAULT 1,
    project TEXT,
    environment TEXT,
    user TEXT,
    tags_json TEXT NOT NULL DEFAULT '[]',
    stack_trace TEXT
  );

  -- Helpful indexes for filtering/searching
  CREATE INDEX IF NOT EXISTS idx_errors_status ON errors(status);
  CREATE INDEX IF NOT EXISTS idx_errors_severity ON errors(severity);
  CREATE INDEX IF NOT EXISTS idx_errors_environment ON errors(environment);
  CREATE INDEX IF NOT EXISTS idx_errors_project ON errors(project);

  -- Seed a few rows on first run (only if table is empty)
  INSERT INTO errors (title, message, severity, status, timestamp, occurrences, project, environment, user, tags_json, stack_trace)
  SELECT
    'TypeError: Cannot read property',
    'Cannot read property ''map'' of undefined in UserList component',
    'critical',
    'open',
    '2024-01-15T10:30:00Z',
    15,
    'Dashboard App',
    'production',
    'john@example.com',
    '["frontend","react","javascript"]',
    'TypeError: Cannot read property ''map'' of undefined\n    at UserList.jsx:42:15\n    at renderWithHooks (react-dom.development.js:16305:18)'
  WHERE NOT EXISTS (SELECT 1 FROM errors);

  INSERT INTO errors (title, message, severity, status, timestamp, occurrences, project, environment, user, tags_json, stack_trace)
  SELECT
    'ReferenceError: $ is not defined',
    'Query $ variable is not defined on page load in initAnalytics script',
    'high',
    'open',
    '2024-01-15T11:45:00Z',
    58,
    'Marketing Site',
    'staging',
    'anon-session-12345',
    '["frontend","javascript","jquery","third-party"]',
    'ReferenceError: $ is not defined\n    at initAnalytics (analytics.js:10:5)\n    at HTMLDocument.ready (main.js:30:3)'
  WHERE (SELECT COUNT(*) FROM errors) = 1;

  INSERT INTO errors (title, message, severity, status, timestamp, occurrences, project, environment, user, tags_json, stack_trace)
  SELECT
    'Warning: Missing alt prop on <img> tag',
    'Accessibility warning: Image in ProductCard component is missing an "alt" attribute',
    'low',
    'new',
    '2024-01-15T13:10:00Z',
    302,
    'E-commerce Platform',
    'development',
    'dev-session-456',
    '["frontend","react","accessibility","warning"]',
    'Warning: Missing alt prop on <img> tag\n    at img\n    at ProductCard.jsx:88:9'
  WHERE (SELECT COUNT(*) FROM errors) = 2;
`);

export function rowToError(row) {
  if (!row) return null;
  let tags = [];
  try {
    tags = JSON.parse(row.tags_json ?? '[]');
  } catch {
    tags = [];
  }
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    severity: row.severity,
    status: row.status,
    timestamp: row.timestamp,
    occurrences: row.occurrences,
    project: row.project,
    environment: row.environment,
    user: row.user,
    tags,
    stackTrace: row.stack_trace
  };
}
