-- Replace external Kingdom Bank logo URL with local /img/kingdom-logo.png in every email body.
-- Removes mixed-content/cert-error warnings on the app.
-- Safe to re-run.

UPDATE emails
SET body = REPLACE(
  body,
  'https://www.thekingdombank.com/images/kingdom-logo.png',
  '/img/kingdom-logo.png'
)
WHERE body LIKE '%thekingdombank.com/images/kingdom-logo.png%';
