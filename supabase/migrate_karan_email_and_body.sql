-- Two updates:
--   1. Replace Karan's email afinitytrades72@gmail.com -> contact@affinitytrades.com (sender + recipient JSONB)
--   2. Replace the literal "Karan Malani" with "Karan" inside the body column (signatures etc.)
-- Safe to re-run.

BEGIN;

-- 1a. Sender column
UPDATE emails
SET from_email = 'contact@affinitytrades.com'
WHERE from_email = 'afinitytrades72@gmail.com';

-- 1b. to_recipients JSONB
UPDATE emails
SET to_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'afinitytrades72@gmail.com'
      THEN jsonb_set(elem, '{email}', '"contact@affinitytrades.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(to_recipients) elem
)
WHERE to_recipients @> '[{"email":"afinitytrades72@gmail.com"}]'::jsonb;

-- 1c. cc_recipients JSONB
UPDATE emails
SET cc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'afinitytrades72@gmail.com'
      THEN jsonb_set(elem, '{email}', '"contact@affinitytrades.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(cc_recipients) elem
)
WHERE cc_recipients @> '[{"email":"afinitytrades72@gmail.com"}]'::jsonb;

-- 1d. bcc_recipients JSONB
UPDATE emails
SET bcc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'afinitytrades72@gmail.com'
      THEN jsonb_set(elem, '{email}', '"contact@affinitytrades.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(bcc_recipients) elem
)
WHERE bcc_recipients @> '[{"email":"afinitytrades72@gmail.com"}]'::jsonb;

-- 2. Body text — replace "Karan Malani" with "Karan"
UPDATE emails
SET body = REPLACE(body, 'Karan Malani', 'Karan')
WHERE body LIKE '%Karan Malani%';

COMMIT;
