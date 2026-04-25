-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY,
  thread_id UUID NOT NULL,
  parent_id UUID REFERENCES emails(id),
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_recipients JSONB NOT NULL DEFAULT '[]',
  cc_recipients JSONB NOT NULL DEFAULT '[]',
  bcc_recipients JSONB NOT NULL DEFAULT '[]',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_thread_id ON emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_parent_id ON emails(parent_id);
