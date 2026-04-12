const express = require('express');
const cors = require('cors');
const path = require('path');
const { createEmail, getThreads, getThread, searchEmails, deleteThread, exportThreadJSON, importThreadJSON } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// --- API Routes ---

// Get all threads (inbox view)
app.get('/api/threads', (req, res) => {
  try {
    const threads = getThreads();
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search emails
app.get('/api/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = searchEmails(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single thread
app.get('/api/threads/:threadId', (req, res) => {
  try {
    const thread = getThread(req.params.threadId);
    if (!thread.length) return res.status(404).json({ error: 'Thread not found' });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new email (new thread or reply)
app.post('/api/emails', (req, res) => {
  try {
    const { fromName, fromEmail, to, cc, bcc, subject, body, timestamp, threadId, parentId } = req.body;
    if (!fromName || !fromEmail || !to || !to.length || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: fromName, fromEmail, to, subject, body' });
    }
    const email = createEmail({ fromName, fromEmail, to, cc, bcc, subject, body, timestamp, threadId, parentId });
    res.status(201).json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete thread
app.delete('/api/threads/:threadId', (req, res) => {
  try {
    deleteThread(req.params.threadId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export thread as JSON
app.get('/api/threads/:threadId/export', (req, res) => {
  try {
    const data = exportThreadJSON(req.params.threadId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import thread from JSON
app.post('/api/threads/import', (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !emails.length) return res.status(400).json({ error: 'No emails provided' });
    const thread = importThreadJSON(emails);
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export thread as PDF
app.get('/api/threads/:threadId/pdf', async (req, res) => {
  try {
    const thread = getThread(req.params.threadId);
    if (!thread.length) return res.status(404).json({ error: 'Thread not found' });

    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const html = generatePDFHtml(thread);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="thread-${req.params.threadId}.pdf"`);
    res.send(pdf);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

function generatePDFHtml(thread) {
  const subject = thread[0]?.subject || 'Email Thread';
  const emailsHtml = thread.map((email, i) => {
    const to = email.toRecipients.map(r => `${r.name} &lt;${r.email}&gt;`).join(', ');
    const cc = email.ccRecipients.length
      ? `<div style="color:#5f6368;font-size:12px;margin-top:2px;">Cc: ${email.ccRecipients.map(r => `${r.name} &lt;${r.email}&gt;`).join(', ')}</div>`
      : '';
    const date = new Date(email.timestamp).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    return `
      <div style="border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin-bottom:16px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <div style="font-weight:600;font-size:14px;color:#202124;">${email.fromName} &lt;${email.fromEmail}&gt;</div>
            <div style="color:#5f6368;font-size:12px;margin-top:2px;">To: ${to}</div>
            ${cc}
          </div>
          <div style="color:#5f6368;font-size:12px;white-space:nowrap;">${date}</div>
        </div>
        <div style="font-size:14px;line-height:1.6;color:#202124;">${email.body}</div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Google Sans', Arial, sans-serif; background: #f6f8fc; padding: 24px; margin: 0; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div style="max-width:680px;margin:0 auto;">
    <h1 style="font-size:22px;font-weight:400;color:#202124;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">
      ${subject}
    </h1>
    ${emailsHtml}
    <div style="text-align:center;color:#5f6368;font-size:11px;margin-top:24px;padding-top:12px;border-top:1px solid #e0e0e0;">
      Exported from Gmail Simulator &bull; ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>`;
}

// Seed data
function seedDatabase() {
  const existing = getThreads();
  if (existing.length > 0) return;

  const threadId1 = require('uuid').v4();
  const threadId2 = require('uuid').v4();
  const threadId3 = require('uuid').v4();

  // Thread 1: Project kickoff
  const e1 = createEmail({
    fromName: 'Sarah Chen', fromEmail: 'sarah.chen@company.com',
    to: [{ name: 'Dev Team', email: 'dev-team@company.com' }, { name: 'John Smith', email: 'john.smith@company.com' }],
    cc: [{ name: 'Mike Director', email: 'mike.d@company.com' }],
    subject: 'Project Aurora - Kickoff Meeting',
    body: `<p>Hi team,</p>
<p>I'm excited to announce that <strong>Project Aurora</strong> has been officially greenlit! 🎉</p>
<p>Here are the key details:</p>
<ul>
<li><strong>Kickoff Meeting:</strong> Monday, March 15th at 10:00 AM</li>
<li><strong>Location:</strong> Conference Room B (or Zoom link below)</li>
<li><strong>Duration:</strong> 1 hour</li>
</ul>
<p>Please review the attached project brief before the meeting. We'll be discussing:</p>
<ol>
<li>Project scope and objectives</li>
<li>Team roles and responsibilities</li>
<li>Timeline and milestones</li>
<li>Technical architecture overview</li>
</ol>
<p>Looking forward to working with everyone on this!</p>
<p>Best regards,<br>Sarah</p>`,
    timestamp: '2025-03-14T09:30:00Z',
    threadId: threadId1,
  });

  createEmail({
    fromName: 'John Smith', fromEmail: 'john.smith@company.com',
    to: [{ name: 'Sarah Chen', email: 'sarah.chen@company.com' }, { name: 'Dev Team', email: 'dev-team@company.com' }],
    cc: [{ name: 'Mike Director', email: 'mike.d@company.com' }],
    subject: 'Re: Project Aurora - Kickoff Meeting',
    body: `<p>Thanks Sarah!</p>
<p>This is great news. I've reviewed the project brief and have a few questions:</p>
<ol>
<li>Are we using the existing microservices architecture or starting fresh?</li>
<li>What's the budget allocation for cloud infrastructure?</li>
<li>Do we have a dedicated QA resource?</li>
</ol>
<p>I'll prepare a technical feasibility document before Monday.</p>
<p>Cheers,<br>John</p>`,
    timestamp: '2025-03-14T10:15:00Z',
    threadId: threadId1,
    parentId: e1.id,
  });

  createEmail({
    fromName: 'Sarah Chen', fromEmail: 'sarah.chen@company.com',
    to: [{ name: 'John Smith', email: 'john.smith@company.com' }, { name: 'Dev Team', email: 'dev-team@company.com' }],
    subject: 'Re: Project Aurora - Kickoff Meeting',
    body: `<p>Hi John,</p>
<p>Great questions! Here are the answers:</p>
<ol>
<li>We'll be building on the existing architecture but with some significant upgrades to the API gateway</li>
<li>We have a $50K/month cloud budget approved for the first quarter</li>
<li>Yes! Lisa Park from QA will be joining us full-time on this project</li>
</ol>
<p>Your feasibility doc would be very helpful. Could you also include a risk assessment section?</p>
<p>Thanks,<br>Sarah</p>`,
    timestamp: '2025-03-14T11:00:00Z',
    threadId: threadId1,
    parentId: e1.id,
  });

  // Thread 2: Bug report
  const e2 = createEmail({
    fromName: 'Alex Rivera', fromEmail: 'alex.r@company.com',
    to: [{ name: 'Backend Team', email: 'backend@company.com' }],
    subject: '[URGENT] Production API - 500 errors on /users endpoint',
    body: `<p>Team,</p>
<p>We're seeing a spike in 500 errors on the <code>/api/v2/users</code> endpoint since the last deployment.</p>
<p><strong>Impact:</strong></p>
<ul>
<li>~15% of requests are failing</li>
<li>Customer complaints coming in via support</li>
<li>Dashboard showing elevated error rates since 2:00 PM UTC</li>
</ul>
<p><strong>Error log sample:</strong></p>
<pre><code>TypeError: Cannot read property 'role' of undefined
  at UserService.getPermissions (/app/services/user.js:142)
  at async /app/routes/users.js:38</code></pre>
<p>I suspect it's related to the new role-based access changes. Can someone investigate ASAP?</p>
<p>— Alex</p>`,
    timestamp: '2025-03-15T14:30:00Z',
    threadId: threadId2,
  });

  createEmail({
    fromName: 'Priya Patel', fromEmail: 'priya.p@company.com',
    to: [{ name: 'Alex Rivera', email: 'alex.r@company.com' }, { name: 'Backend Team', email: 'backend@company.com' }],
    subject: 'Re: [URGENT] Production API - 500 errors on /users endpoint',
    body: `<p>Looking into this now.</p>
<p>Found the issue — the migration script didn't backfill the <code>role</code> field for legacy users created before v2.3. Those users have <code>null</code> roles which causes the crash.</p>
<p><strong>Fix:</strong> I'm pushing a hotfix that adds a null check with a default role fallback. ETA: 15 minutes.</p>
<p>Will also add a migration to backfill existing records.</p>
<p>— Priya</p>`,
    timestamp: '2025-03-15T14:52:00Z',
    threadId: threadId2,
    parentId: e2.id,
  });

  createEmail({
    fromName: 'Alex Rivera', fromEmail: 'alex.r@company.com',
    to: [{ name: 'Priya Patel', email: 'priya.p@company.com' }, { name: 'Backend Team', email: 'backend@company.com' }],
    subject: 'Re: [URGENT] Production API - 500 errors on /users endpoint',
    body: `<p>Hotfix is deployed and error rates are back to normal. 🟢</p>
<p>Thanks for the quick turnaround Priya! I'll write up a post-mortem doc tomorrow.</p>
<p>Lessons learned:</p>
<ul>
<li>Need better pre-deployment data validation checks</li>
<li>Should add integration tests for legacy user scenarios</li>
<li>Consider adding a circuit breaker for this endpoint</li>
</ul>
<p>— Alex</p>`,
    timestamp: '2025-03-15T15:20:00Z',
    threadId: threadId2,
    parentId: e2.id,
  });

  // Thread 3: Design review
  createEmail({
    fromName: 'Emma Wilson', fromEmail: 'emma.w@company.com',
    to: [{ name: 'Design Team', email: 'design@company.com' }, { name: 'Product', email: 'product@company.com' }],
    cc: [{ name: 'CEO', email: 'ceo@company.com' }],
    subject: 'New Dashboard Mockups - Q2 Redesign',
    body: `<p>Hi everyone,</p>
<p>I've completed the first round of mockups for the Q2 dashboard redesign. Here's a summary of the key changes:</p>
<h3>What's New</h3>
<ul>
<li><strong>Unified navigation:</strong> Consolidated the top nav and sidebar into a single responsive navigation system</li>
<li><strong>Data visualization:</strong> Replaced static tables with interactive charts using D3.js</li>
<li><strong>Dark mode:</strong> Full dark mode support with automatic system preference detection</li>
<li><strong>Accessibility:</strong> WCAG 2.1 AA compliance across all components</li>
</ul>
<h3>Timeline</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;border-color:#e0e0e0;">
<tr><th>Phase</th><th>Date</th><th>Status</th></tr>
<tr><td>Wireframes</td><td>Complete</td><td>✅</td></tr>
<tr><td>Hi-fi Mockups</td><td>March 20</td><td>🔄 In Progress</td></tr>
<tr><td>Prototype</td><td>April 1</td><td>⏳ Upcoming</td></tr>
<tr><td>Dev Handoff</td><td>April 10</td><td>⏳ Upcoming</td></tr>
</table>
<p>Please review and share your feedback by <strong>Friday EOD</strong>.</p>
<p>Best,<br>Emma</p>`,
    timestamp: '2025-03-16T08:00:00Z',
    threadId: threadId3,
  });

  console.log('Database seeded with sample email threads.');
}

seedDatabase();

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
