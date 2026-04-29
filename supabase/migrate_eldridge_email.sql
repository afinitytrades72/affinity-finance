-- One-shot update: change Eldridge's email from kingdomsupport87@gmail.com to support@thekingdombank.com
-- Updates both `from_email` (sender) and any `*_recipients` JSONB arrays containing the old address.
-- Safe to re-run; second run is a no-op.

BEGIN;

-- 1. Sender column
UPDATE emails
SET from_email = 'support@thekingdombank.com'
WHERE from_email = 'kingdomsupport87@gmail.com';

-- 2. to_recipients (JSONB array of {name,email}) — replace email field where it matches
UPDATE emails
SET to_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'kingdomsupport87@gmail.com'
      THEN jsonb_set(elem, '{email}', '"support@thekingdombank.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(to_recipients) elem
)
WHERE to_recipients @> '[{"email":"kingdomsupport87@gmail.com"}]'::jsonb;

-- 3. cc_recipients — same treatment (safety net even if currently empty)
UPDATE emails
SET cc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'kingdomsupport87@gmail.com'
      THEN jsonb_set(elem, '{email}', '"support@thekingdombank.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(cc_recipients) elem
)
WHERE cc_recipients @> '[{"email":"kingdomsupport87@gmail.com"}]'::jsonb;

-- 4. bcc_recipients — same
UPDATE emails
SET bcc_recipients = (
  SELECT jsonb_agg(
    CASE WHEN elem->>'email' = 'kingdomsupport87@gmail.com'
      THEN jsonb_set(elem, '{email}', '"support@thekingdombank.com"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(bcc_recipients) elem
)
WHERE bcc_recipients @> '[{"email":"kingdomsupport87@gmail.com"}]'::jsonb;

COMMIT;
