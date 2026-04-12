const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'emails.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    threadId TEXT NOT NULL,
    parentId TEXT,
    fromName TEXT NOT NULL,
    fromEmail TEXT NOT NULL,
    toRecipients TEXT NOT NULL,
    ccRecipients TEXT DEFAULT '[]',
    bccRecipients TEXT DEFAULT '[]',
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_threadId ON emails(threadId)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_parentId ON emails(parentId)`);

function createEmail({ fromName, fromEmail, to, cc, bcc, subject, body, timestamp, threadId, parentId }) {
  const id = uuidv4();
  const finalThreadId = threadId || uuidv4();
  const stmt = db.prepare(`
    INSERT INTO emails (id, threadId, parentId, fromName, fromEmail, toRecipients, ccRecipients, bccRecipients, subject, body, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    finalThreadId,
    parentId || null,
    fromName,
    fromEmail,
    JSON.stringify(to || []),
    JSON.stringify(cc || []),
    JSON.stringify(bcc || []),
    subject,
    body,
    timestamp || new Date().toISOString()
  );
  return getEmailById(id);
}

function getEmailById(id) {
  const row = db.prepare('SELECT * FROM emails WHERE id = ?').get(id);
  return row ? parseEmail(row) : null;
}

function getThreads() {
  const rows = db.prepare(`
    SELECT e.*,
      (SELECT COUNT(*) FROM emails e2 WHERE e2.threadId = e.threadId) as messageCount
    FROM emails e
    WHERE e.id = (
      SELECT e3.id FROM emails e3
      WHERE e3.threadId = e.threadId
      ORDER BY e3.timestamp DESC
      LIMIT 1
    )
    ORDER BY e.timestamp DESC
  `).all();

  return rows.map(row => ({
    ...parseEmail(row),
    messageCount: row.messageCount,
  }));
}

function getThread(threadId) {
  const rows = db.prepare('SELECT * FROM emails WHERE threadId = ? ORDER BY timestamp ASC').all(threadId);
  return rows.map(parseEmail);
}

function searchEmails(query) {
  const rows = db.prepare(`
    SELECT * FROM emails
    WHERE subject LIKE ? OR fromName LIKE ? OR fromEmail LIKE ? OR body LIKE ?
    ORDER BY timestamp DESC
  `).all(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
  return rows.map(parseEmail);
}

function deleteThread(threadId) {
  db.prepare('DELETE FROM emails WHERE threadId = ?').run(threadId);
}

function parseEmail(row) {
  return {
    ...row,
    toRecipients: JSON.parse(row.toRecipients),
    ccRecipients: JSON.parse(row.ccRecipients),
    bccRecipients: JSON.parse(row.bccRecipients),
  };
}

function exportThreadJSON(threadId) {
  return getThread(threadId);
}

function importThreadJSON(emails) {
  const newThreadId = uuidv4();
  const idMap = {};

  for (const email of emails) {
    const oldId = email.id;
    const newId = uuidv4();
    idMap[oldId] = newId;

    const stmt = db.prepare(`
      INSERT INTO emails (id, threadId, parentId, fromName, fromEmail, toRecipients, ccRecipients, bccRecipients, subject, body, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      newId,
      newThreadId,
      email.parentId ? (idMap[email.parentId] || null) : null,
      email.fromName,
      email.fromEmail,
      JSON.stringify(email.toRecipients || []),
      JSON.stringify(email.ccRecipients || []),
      JSON.stringify(email.bccRecipients || []),
      email.subject,
      email.body,
      email.timestamp
    );
  }
  return getThread(newThreadId);
}

module.exports = { createEmail, getEmailById, getThreads, getThread, searchEmails, deleteThread, exportThreadJSON, importThreadJSON, db };
