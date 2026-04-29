-- Seed: Karan Malani <-> Eldridge Ribeiro crypto fund-transfer thread (16 messages)
-- Run after schema.sql.
-- Idempotent guard: skips if a thread with this exact subject already exists.

DO $$
DECLARE
  tid UUID := gen_random_uuid();
  e1  UUID := gen_random_uuid();
  e2  UUID := gen_random_uuid();
  e3  UUID := gen_random_uuid();
  e4  UUID := gen_random_uuid();
  e5  UUID := gen_random_uuid();
  e6  UUID := gen_random_uuid();
  e7  UUID := gen_random_uuid();
  e8  UUID := gen_random_uuid();
  e9  UUID := gen_random_uuid();
  e10 UUID := gen_random_uuid();
  e11 UUID := gen_random_uuid();
  e12 UUID := gen_random_uuid();
  e13 UUID := gen_random_uuid();
  e14 UUID := gen_random_uuid();
  e15 UUID := gen_random_uuid();
  e16 UUID := gen_random_uuid();
  karan_to JSONB := '[{"name":"Eldridge Ribeiro","email":"kingdomsupport87@gmail.com"}]'::jsonb;
  eldridge_to JSONB := '[{"name":"Karan Malani","email":"afinitytrades72@gmail.com"}]'::jsonb;
  sig TEXT := $sig$<p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; margin-bottom: 10px; ">Best regards</p><table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse: collapse !important; width: auto;"><tr><td style="vertical-align: top;"><table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td style="vertical-align: top;padding-right: 15px; border-right: 1px solid #eeeeee; "><img id="photo" alt="Photo" src="https://www.thekingdombank.com/images/kingdom-logo.png" width="150" /></td><td style="padding-right: 15px; ">&nbsp;</td></tr></table></td><td style="vertical-align: top;"><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; font-size: 18px; font-family: 'Arial'; font-weight: bold;">Eldridge Ribeiro</p><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="line-height: 10px">&nbsp;</td></tr><tr><td  style="border: none; line-height: 1px; height: 1px; background-color: #eeeeee;"></td></tr><tr><td style="line-height: 10px">&nbsp;</td></tr></table><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; ">Senior Customer Manager</p><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; ">Finance &amp; Accounts</p><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; ">The Kingdom Bank</p><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; ">First Floor, 43 Great George Street, Roseau</p><p style="font-family: 'Arial'; color: #444444; padding: 0; margin: 0; font-size: 14px; ">Commonwealth of Dominica</p></td></tr></table><table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse: collapse !important; width: auto;"><tr><td style="padding-top: 15px;"></td></tr></table>$sig$;
BEGIN
  IF EXISTS (SELECT 1 FROM emails WHERE subject = 'Request for Assistance – Crypto Fund Transfer' AND from_email = 'afinitytrades72@gmail.com') THEN
    RAISE NOTICE 'Chain already seeded — skipping.';
    RETURN;
  END IF;

  -- Email 1 — Karan, Jan 25 10:15 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e1, tid, NULL, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Request for Assistance – Crypto Fund Transfer',
   $body$<p>Dear Eldridge,</p><p>I am reaching out regarding the transfer of <strong>9,512,195 USDT</strong> (equivalent to <strong>₹78 crore INR @ 82</strong>) held with our <strong>Origin Custodian</strong>, which we intend to move to <strong>Destination Custodian</strong>.</p><p>Kindly guide us on the required documentation and process to initiate this transfer securely.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-01-25T04:45:00Z');

  -- Email 2 — Eldridge, Jan 25 13:15 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e2, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Re: Request for Assistance – Crypto Fund Transfer',
   $body$<p>Dear Karan,</p><p>Thank you for your email.</p><p>This transfer will involve:</p><ul><li>Custodian ownership verification</li><li>Blockchain reconciliation</li><li>AML/KYC compliance checks</li><li>Liquidity confirmation at <strong>Destination Custodian</strong></li></ul><p>We will initiate the process and keep you updated.</p>$body$ || sig,
   '2026-01-25T07:45:00Z');

  -- Email 3 — Karan, Jan 28 11:05 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e3, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Follow-Up – Transfer Initiation',
   $body$<p>Dear Eldridge,</p><p>I hope you are doing well.</p><p>I wanted to follow up regarding the transfer initiation. Considering the time sensitivity of this transaction and the commitments associated with it, I would appreciate if you could confirm whether any documentation or approvals are pending from our side.</p><p>Your guidance will help us ensure there are no delays from our end.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-01-28T05:35:00Z');

  -- Email 4 — Eldridge, Jan 30 14:30 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e4, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Update – Transfer Processing',
   $body$<p>Dear Karan,</p><p>During initial processing, we note:</p><ul><li><strong>Multi-signature authorization</strong> required due to transaction size</li><li>Asset distribution across <strong>multiple wallet addresses</strong></li><li>Enhanced liquidity verification</li></ul><p>These factors may extend the timeline.</p><p>Funds remain securely held within custodial systems.</p>$body$ || sig,
   '2026-01-30T09:00:00Z');

  -- Email 5 — Karan, Feb 3 10:40 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e5, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Status Check – Transfer Processing',
   $body$<p>Dear Eldridge,</p><p>Thank you for your previous update.</p><p>Given the importance of this transaction and the expectations tied to it, I would request a status update on <strong>custodial approvals</strong> and <strong>blockchain reconciliation</strong>.</p><p>We are closely monitoring timelines and would like to ensure everything is progressing as expected.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-02-03T05:10:00Z');

  -- Email 6 — Eldridge, Feb 12 15:20 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e6, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Settlement Status – MT103 Reference Update',
   $body$<p>Dear Karan,</p><p>The transaction has entered an <strong>in-flight settlement</strong> state.</p><ul><li><strong>MT103 Reference ID:</strong> <code>MT103-8X9-PLX-7714</code></li><li>Funds debited from <strong>Origin Custodian</strong></li><li>Pending reconciliation before credit</li></ul><p>In such cases, funds are:</p><ul><li>In settlement</li><li>In transit</li><li>Pending confirmation</li></ul><p>Funds remain fully secure within settlement infrastructure.</p>$body$ || sig,
   '2026-02-12T09:50:00Z');

  -- Email 7 — Karan, Feb 14 11:25 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e7, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Clarification – Settlement Status',
   $body$<p>Dear Eldridge,</p><p>Thank you for the detailed explanation.</p><p>Considering the ongoing settlement status and its time sensitivity, I would appreciate confirmation if any action or documentation from our side can help facilitate faster reconciliation against the <strong>MT103 reference</strong>.</p><p>We remain fully aligned to support this process at every stage.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-02-14T05:55:00Z');

  -- Email 8 — Eldridge, Feb 20 16:45 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e8, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Progress Update',
   $body$<p>Dear Karan,</p><ul><li>Custodian verification <strong>completed</strong></li><li>Liquidity acceptance <strong>confirmed</strong></li><li>Blockchain reconciliation <strong>ongoing</strong></li></ul><p>No discrepancies detected.</p><p>Funds remain fully secure.</p>$body$ || sig,
   '2026-02-20T11:15:00Z');

  -- Email 9 — Karan, Feb 24 10:55 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e9, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Follow-Up – Reconciliation Progress',
   $body$<p>Dear Eldridge,</p><p>I hope all is well.</p><p>As we continue to track the progress of this transaction, I would appreciate an update on the reconciliation stage. The timeline remains important from our end, and we are keen to ensure everything is proceeding without any unforeseen delays.</p><p>Thank you for your continued support.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-02-24T05:25:00Z');

  -- Email 10 — Eldridge, Mar 10 15:15 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e10, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Settlement Progress',
   $body$<p>Dear Karan,</p><p>Blockchain reconciliation is progressing.</p><p>All <strong>compliance approvals</strong> are completed.</p><p>Funds remain secure in the settlement layer.</p>$body$ || sig,
   '2026-03-10T09:45:00Z');

  -- Email 11 — Karan, Mar 13 11:10 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e11, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Confirmation – Settlement Readiness',
   $body$<p>Dear Eldridge,</p><p>Thank you for your update.</p><p>As we move closer to final settlement, I would request confirmation that all <strong>custodial approvals</strong> and <strong>compliance requirements</strong> are fully completed. Timely execution at this stage is critical, and we want to ensure full readiness from all sides.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-03-13T05:40:00Z');

  -- Email 12 — Eldridge, Apr 2 14:30 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e12, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Transfer Initiation Confirmation',
   $body$<p>Dear Karan,</p><p>The <strong>inter-custodian settlement process</strong> has been initiated.</p><ul><li>Blockchain confirmations underway</li><li>MT103 validation ongoing</li></ul><p>Funds remain secure.</p>$body$ || sig,
   '2026-04-02T09:00:00Z');

  -- Email 13 — Karan, Apr 5 10:35 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e13, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Post-Initiation Status Check',
   $body$<p>Dear Eldridge,</p><p>Following the initiation of the transfer, I would appreciate confirmation that <strong>blockchain confirmations</strong> and <strong>settlement processes</strong> are progressing smoothly.</p><p>Given the significance of the timeline, we are closely monitoring progress and would value any update you can provide.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-04-05T05:05:00Z');

  -- Email 14 — Eldridge, Apr 15 15:40 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e14, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Ongoing Settlement Confirmation',
   $body$<p>Dear Karan,</p><p>Transaction remains under <strong>final reconciliation</strong>.</p><ul><li><strong>MT103 reference</strong> active</li><li>No discrepancies</li></ul><p>Funds remain fully secure.</p>$body$ || sig,
   '2026-04-15T10:10:00Z');

  -- Email 15 — Karan, Apr 18 11:00 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e15, tid, e1, 'Karan Malani', 'afinitytrades72@gmail.com', karan_to, '[]'::jsonb,
   'Final Timeline Confirmation',
   $body$<p>Dear Eldridge,</p><p>Thank you for your continued updates throughout this process.</p><p>As we approach the final stages of settlement, I would request a clear confirmation on the expected timeline for final credit. This transaction is time-sensitive, and we are mindful of the patience and expectations associated with it.</p><p>Your confirmation will help us plan accordingly and maintain alignment on timelines.</p><p>Best regards,<br>Karan Malani</p>$body$,
   '2026-04-18T05:30:00Z');

  -- Email 16 — Eldridge (FINAL), Apr 22 16:10 IST
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e16, tid, e1, 'Eldridge Ribeiro', 'kingdomsupport87@gmail.com', eldridge_to, '[]'::jsonb,
   'Final Timeline Confirmation – Fund Credit',
   $body$<p>Dear Karan,</p><p>We would like to provide a final update regarding the transaction:</p><ul><li>The transfer remains in the <strong>settlement / in-transit</strong> stage linked to <strong>MT103 Reference ID:</strong> <code>MT103-8X9-PLX-7714</code></li><li>All <strong>compliance, custodial, and liquidity</strong> checks have been successfully completed</li><li>No discrepancies or risks have been identified</li></ul><p><strong>Expected Timeline:</strong></p><p>The funds are expected to be credited to the Destination Custodian account by <strong>end of June 2026 or during July 2026</strong>, subject to final settlement confirmation cycles.</p><p>Please be assured:</p><ul><li>Funds are <strong>fully secure</strong></li><li>Transaction is <strong>actively progressing</strong></li><li>Delay is purely <strong>procedural and technical</strong></li></ul>$body$ || sig,
   '2026-04-22T10:40:00Z');
END $$;
