import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import type { Email, NewEmailInput, Recipient, ThreadSummary } from './types';

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
      ssl: { rejectUnauthorized: false },
    });
  }
  return global.__pgPool;
}

interface EmailRow {
  id: string;
  thread_id: string;
  parent_id: string | null;
  from_name: string;
  from_email: string;
  to_recipients: Recipient[];
  cc_recipients: Recipient[];
  bcc_recipients: Recipient[];
  subject: string;
  body: string;
  timestamp: Date;
  created_at: Date;
}

function parseEmail(row: EmailRow): Email {
  return {
    id: row.id,
    threadId: row.thread_id,
    parentId: row.parent_id,
    fromName: row.from_name,
    fromEmail: row.from_email,
    toRecipients: row.to_recipients ?? [],
    ccRecipients: row.cc_recipients ?? [],
    bccRecipients: row.bcc_recipients ?? [],
    subject: row.subject,
    body: row.body,
    timestamp: (row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp),
    createdAt: (row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at),
  };
}

export async function createEmail(input: NewEmailInput): Promise<Email | null> {
  const id = randomUUID();
  const finalThreadId = input.threadId || randomUUID();
  await getPool().query(
    `INSERT INTO emails
       (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, bcc_recipients, subject, body, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10, $11)`,
    [
      id,
      finalThreadId,
      input.parentId || null,
      input.fromName,
      input.fromEmail,
      JSON.stringify(input.to || []),
      JSON.stringify(input.cc || []),
      JSON.stringify(input.bcc || []),
      input.subject,
      input.body,
      input.timestamp || new Date().toISOString(),
    ]
  );
  return getEmailById(id);
}

export async function getEmailById(id: string): Promise<Email | null> {
  const { rows } = await getPool().query<EmailRow>('SELECT * FROM emails WHERE id = $1', [id]);
  return rows[0] ? parseEmail(rows[0]) : null;
}

export async function getThreads(): Promise<ThreadSummary[]> {
  const { rows } = await getPool().query<EmailRow & { message_count: string }>(`
    SELECT e.*,
      (SELECT COUNT(*) FROM emails e2 WHERE e2.thread_id = e.thread_id) AS message_count
    FROM emails e
    WHERE e.id = (
      SELECT e3.id FROM emails e3
      WHERE e3.thread_id = e.thread_id
      ORDER BY e3.timestamp DESC
      LIMIT 1
    )
    ORDER BY e.timestamp DESC
  `);
  return rows.map((row) => ({
    ...parseEmail(row),
    messageCount: Number(row.message_count),
  }));
}

export async function getThread(threadId: string): Promise<Email[]> {
  const { rows } = await getPool().query<EmailRow>(
    'SELECT * FROM emails WHERE thread_id = $1 ORDER BY timestamp ASC',
    [threadId]
  );
  return rows.map(parseEmail);
}

export async function searchEmails(query: string): Promise<Email[]> {
  const like = `%${query}%`;
  const { rows } = await getPool().query<EmailRow>(
    `SELECT * FROM emails
     WHERE subject ILIKE $1 OR from_name ILIKE $1 OR from_email ILIKE $1 OR body ILIKE $1
     ORDER BY timestamp DESC`,
    [like]
  );
  return rows.map(parseEmail);
}

export async function deleteThread(threadId: string): Promise<void> {
  await getPool().query('DELETE FROM emails WHERE thread_id = $1', [threadId]);
}

export async function exportThreadJSON(threadId: string): Promise<Email[]> {
  return getThread(threadId);
}

export async function importThreadJSON(emails: Email[]): Promise<Email[]> {
  const newThreadId = randomUUID();
  const idMap = new Map<string, string>();
  const pool = getPool();

  for (const email of emails) {
    const newId = randomUUID();
    idMap.set(email.id, newId);
    await pool.query(
      `INSERT INTO emails
         (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, bcc_recipients, subject, body, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10, $11)`,
      [
        newId,
        newThreadId,
        email.parentId ? (idMap.get(email.parentId) ?? null) : null,
        email.fromName,
        email.fromEmail,
        JSON.stringify(email.toRecipients || []),
        JSON.stringify(email.ccRecipients || []),
        JSON.stringify(email.bccRecipients || []),
        email.subject,
        email.body,
        email.timestamp,
      ]
    );
  }
  return getThread(newThreadId);
}
