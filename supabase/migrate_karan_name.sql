-- Replace "Karan Malani" with "Karan" in from_name (sender column) and *_recipients JSONB arrays.
-- Safe to re-run.

BEGIN;

-- 1. from_name column
UPDATE emails
SET from_name = 'Karan'
WHERE from_name = 'Karan Malani';

-- 2. to_recipients JSONB
UPDATE emails
SET to_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'name' = 'Karan Malani'
      THEN jsonb_set(elem, '{name}', '"Karan"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(to_recipients) elem
)
WHERE to_recipients @> '[{"name":"Karan Malani"}]'::jsonb;

-- 3. cc_recipients JSONB (safety net)
UPDATE emails
SET cc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'name' = 'Karan Malani'
      THEN jsonb_set(elem, '{name}', '"Karan"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(cc_recipients) elem
)
WHERE cc_recipients @> '[{"name":"Karan Malani"}]'::jsonb;

-- 4. bcc_recipients JSONB (safety net)
UPDATE emails
SET bcc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'name' = 'Karan Malani'
      THEN jsonb_set(elem, '{name}', '"Karan"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(bcc_recipients) elem
)
WHERE bcc_recipients @> '[{"name":"Karan Malani"}]'::jsonb;

COMMIT;
