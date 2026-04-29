-- Lock down the emails table from public PostgREST access.
-- Our Next.js app talks via the direct `pg` connection (DATABASE_URL),
-- which uses the database master credentials and BYPASSES RLS entirely.
-- So enabling RLS without policies = nobody on the anon/authenticated REST
-- API can read/write/delete, but our app keeps working.

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails FORCE ROW LEVEL SECURITY;

-- Belt and suspenders: explicitly revoke PostgREST roles' direct grants.
REVOKE ALL ON emails FROM anon, authenticated;

-- Sanity check — should return true after running:
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'emails';
