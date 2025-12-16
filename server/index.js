import express from 'express';
import cors from 'cors';
import { db, rowToError } from './db.js';

const app = express();

// CRA runs on 3000. API on 5000 to match the frontend code.
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// GET /api/errors?q=&status=&severity=&environment=&project=
app.get('/api/errors', (req, res) => {
  const { q, status, severity, environment, project } = req.query;

  const where = [];
  const params = {};

  if (q) {
    where.push('(title LIKE @q OR message LIKE @q)');
    params.q = `%${q}%`;
  }
  if (status) {
    where.push('status = @status');
    params.status = status;
  }
  if (severity) {
    where.push('severity = @severity');
    params.severity = severity;
  }
  if (environment) {
    where.push('environment = @environment');
    params.environment = environment;
  }
  if (project) {
    where.push('project = @project');
    params.project = project;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const rows = db
    .prepare(`SELECT * FROM errors ${whereSql} ORDER BY datetime(timestamp) DESC, id DESC`)
    .all(params);

  res.json(rows.map(rowToError));
});

// GET /api/errors/:id
app.get('/api/errors/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM errors WHERE id = ?').get(id);
  const mapped = rowToError(row);
  if (!mapped) return res.status(404).json({ error: 'Not found' });
  res.json(mapped);
});

// POST /api/errors
// Body: { title, message, severity, status, occurrences, project, environment, user, tags, stackTrace, timestamp }
app.post('/api/errors', (req, res) => {
  const {
    title,
    message,
    severity = 'low',
    status = 'new',
    timestamp,
    occurrences = 1,
    project = null,
    environment = null,
    user = null,
    tags = [],
    stackTrace = null
  } = req.body ?? {};

  if (!title || !message) {
    return res.status(400).json({ error: 'title and message are required' });
  }

  const tags_json = JSON.stringify(Array.isArray(tags) ? tags : []);

  const stmt = db.prepare(`
    INSERT INTO errors (title, message, severity, status, timestamp, occurrences, project, environment, user, tags_json, stack_trace)
    VALUES (@title, @message, @severity, @status, @timestamp, @occurrences, @project, @environment, @user, @tags_json, @stack_trace)
  `);

  const info = stmt.run({
    title,
    message,
    severity,
    status,
    timestamp: timestamp ?? new Date().toISOString(),
    occurrences: Number(occurrences) || 1,
    project,
    environment,
    user,
    tags_json,
    stack_trace: stackTrace
  });

  const row = db.prepare('SELECT * FROM errors WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(rowToError(row));
});

// PATCH /api/errors/:id
// Body can include any subset of fields used in POST
app.patch('/api/errors/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM errors WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const patch = req.body ?? {};

  const fields = {
    title: patch.title ?? existing.title,
    message: patch.message ?? existing.message,
    severity: patch.severity ?? existing.severity,
    status: patch.status ?? existing.status,
    timestamp: patch.timestamp ?? existing.timestamp,
    occurrences:
      patch.occurrences !== undefined
        ? Number(patch.occurrences) || 1
        : existing.occurrences,
    project: patch.project ?? existing.project,
    environment: patch.environment ?? existing.environment,
    user: patch.user ?? existing.user,
    tags_json:
      patch.tags !== undefined
        ? JSON.stringify(Array.isArray(patch.tags) ? patch.tags : [])
        : existing.tags_json,
    stack_trace: patch.stackTrace ?? existing.stack_trace,
    id
  };

  db.prepare(`
    UPDATE errors
    SET
      title=@title,
      message=@message,
      severity=@severity,
      status=@status,
      timestamp=@timestamp,
      occurrences=@occurrences,
      project=@project,
      environment=@environment,
      user=@user,
      tags_json=@tags_json,
      stack_trace=@stack_trace
    WHERE id=@id
  `).run(fields);

  const row = db.prepare('SELECT * FROM errors WHERE id = ?').get(id);
  res.json(rowToError(row));
});

// DELETE /api/errors/:id
app.delete('/api/errors/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM errors WHERE id = ?').run(id);
  if (!info.changes) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Error Tracker API listening on http://localhost:${PORT}`);
});
