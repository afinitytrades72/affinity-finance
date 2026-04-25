-- Sample threads. Optional. Run after schema.sql.

DO $$
DECLARE
  thread1 UUID := gen_random_uuid();
  thread2 UUID := gen_random_uuid();
  thread3 UUID := gen_random_uuid();
  e1 UUID := gen_random_uuid();
  e2 UUID := gen_random_uuid();
BEGIN
  -- Thread 1: Project kickoff
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (e1, thread1, NULL, 'Sarah Chen', 'sarah.chen@company.com',
   '[{"name":"Dev Team","email":"dev-team@company.com"},{"name":"John Smith","email":"john.smith@company.com"}]'::jsonb,
   '[{"name":"Mike Director","email":"mike.d@company.com"}]'::jsonb,
   'Project Aurora - Kickoff Meeting',
   '<p>Hi team,</p><p>I''m excited to announce that <strong>Project Aurora</strong> has been officially greenlit! 🎉</p><p>Here are the key details:</p><ul><li><strong>Kickoff Meeting:</strong> Monday, March 15th at 10:00 AM</li><li><strong>Location:</strong> Conference Room B (or Zoom link below)</li><li><strong>Duration:</strong> 1 hour</li></ul><p>Please review the attached project brief before the meeting. We''ll be discussing:</p><ol><li>Project scope and objectives</li><li>Team roles and responsibilities</li><li>Timeline and milestones</li><li>Technical architecture overview</li></ol><p>Looking forward to working with everyone on this!</p><p>Best regards,<br>Sarah</p>',
   '2025-03-14T09:30:00Z');

  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (gen_random_uuid(), thread1, e1, 'John Smith', 'john.smith@company.com',
   '[{"name":"Sarah Chen","email":"sarah.chen@company.com"},{"name":"Dev Team","email":"dev-team@company.com"}]'::jsonb,
   '[{"name":"Mike Director","email":"mike.d@company.com"}]'::jsonb,
   'Re: Project Aurora - Kickoff Meeting',
   '<p>Thanks Sarah!</p><p>This is great news. I''ve reviewed the project brief and have a few questions:</p><ol><li>Are we using the existing microservices architecture or starting fresh?</li><li>What''s the budget allocation for cloud infrastructure?</li><li>Do we have a dedicated QA resource?</li></ol><p>I''ll prepare a technical feasibility document before Monday.</p><p>Cheers,<br>John</p>',
   '2025-03-14T10:15:00Z');

  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, subject, body, timestamp) VALUES
  (gen_random_uuid(), thread1, e1, 'Sarah Chen', 'sarah.chen@company.com',
   '[{"name":"John Smith","email":"john.smith@company.com"},{"name":"Dev Team","email":"dev-team@company.com"}]'::jsonb,
   'Re: Project Aurora - Kickoff Meeting',
   '<p>Hi John,</p><p>Great questions! Here are the answers:</p><ol><li>We''ll be building on the existing architecture but with some significant upgrades to the API gateway</li><li>We have a $50K/month cloud budget approved for the first quarter</li><li>Yes! Lisa Park from QA will be joining us full-time on this project</li></ol><p>Your feasibility doc would be very helpful. Could you also include a risk assessment section?</p><p>Thanks,<br>Sarah</p>',
   '2025-03-14T11:00:00Z');

  -- Thread 2: Bug report
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, subject, body, timestamp) VALUES
  (e2, thread2, NULL, 'Alex Rivera', 'alex.r@company.com',
   '[{"name":"Backend Team","email":"backend@company.com"}]'::jsonb,
   '[URGENT] Production API - 500 errors on /users endpoint',
   '<p>Team,</p><p>We''re seeing a spike in 500 errors on the <code>/api/v2/users</code> endpoint since the last deployment.</p><p><strong>Impact:</strong></p><ul><li>~15% of requests are failing</li><li>Customer complaints coming in via support</li><li>Dashboard showing elevated error rates since 2:00 PM UTC</li></ul><p><strong>Error log sample:</strong></p><pre><code>TypeError: Cannot read property ''role'' of undefined  at UserService.getPermissions (/app/services/user.js:142)  at async /app/routes/users.js:38</code></pre><p>I suspect it''s related to the new role-based access changes. Can someone investigate ASAP?</p><p>— Alex</p>',
   '2025-03-15T14:30:00Z');

  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, subject, body, timestamp) VALUES
  (gen_random_uuid(), thread2, e2, 'Priya Patel', 'priya.p@company.com',
   '[{"name":"Alex Rivera","email":"alex.r@company.com"},{"name":"Backend Team","email":"backend@company.com"}]'::jsonb,
   'Re: [URGENT] Production API - 500 errors on /users endpoint',
   '<p>Looking into this now.</p><p>Found the issue — the migration script didn''t backfill the <code>role</code> field for legacy users created before v2.3. Those users have <code>null</code> roles which causes the crash.</p><p><strong>Fix:</strong> I''m pushing a hotfix that adds a null check with a default role fallback. ETA: 15 minutes.</p><p>Will also add a migration to backfill existing records.</p><p>— Priya</p>',
   '2025-03-15T14:52:00Z');

  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, subject, body, timestamp) VALUES
  (gen_random_uuid(), thread2, e2, 'Alex Rivera', 'alex.r@company.com',
   '[{"name":"Priya Patel","email":"priya.p@company.com"},{"name":"Backend Team","email":"backend@company.com"}]'::jsonb,
   'Re: [URGENT] Production API - 500 errors on /users endpoint',
   '<p>Hotfix is deployed and error rates are back to normal. 🟢</p><p>Thanks for the quick turnaround Priya! I''ll write up a post-mortem doc tomorrow.</p><p>Lessons learned:</p><ul><li>Need better pre-deployment data validation checks</li><li>Should add integration tests for legacy user scenarios</li><li>Consider adding a circuit breaker for this endpoint</li></ul><p>— Alex</p>',
   '2025-03-15T15:20:00Z');

  -- Thread 3: Design review
  INSERT INTO emails (id, thread_id, parent_id, from_name, from_email, to_recipients, cc_recipients, subject, body, timestamp) VALUES
  (gen_random_uuid(), thread3, NULL, 'Emma Wilson', 'emma.w@company.com',
   '[{"name":"Design Team","email":"design@company.com"},{"name":"Product","email":"product@company.com"}]'::jsonb,
   '[{"name":"CEO","email":"ceo@company.com"}]'::jsonb,
   'New Dashboard Mockups - Q2 Redesign',
   '<p>Hi everyone,</p><p>I''ve completed the first round of mockups for the Q2 dashboard redesign. Here''s a summary of the key changes:</p><h3>What''s New</h3><ul><li><strong>Unified navigation:</strong> Consolidated the top nav and sidebar into a single responsive navigation system</li><li><strong>Data visualization:</strong> Replaced static tables with interactive charts using D3.js</li><li><strong>Dark mode:</strong> Full dark mode support with automatic system preference detection</li><li><strong>Accessibility:</strong> WCAG 2.1 AA compliance across all components</li></ul><p>Please review and share your feedback by <strong>Friday EOD</strong>.</p><p>Best,<br>Emma</p>',
   '2025-03-16T08:00:00Z');
END $$;
