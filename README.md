# Gmail Simulator

Next.js + Supabase app that simulates a Gmail-like email interface for creating and exporting dummy email conversations. Single-tenant, gated by Basic Auth.

## Features

- **Gmail-like UI** — Sidebar, email list, threaded conversation view
- **Compose emails** — Rich text editor with From, To, CC/BCC, custom timestamps
- **Email threading** — Reply / Reply All with proper parent-child relationships
- **Search** — Case-insensitive search by subject, sender, or body
- **Export to PDF** — Client-side jsPDF + html2canvas (no server-side Chromium)
- **Import/Export JSON** — Portable thread format
- **Auth** — HTTP Basic Auth (single admin user) gating all `/api/*` routes

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **UI:** React 19 + Tailwind CSS v4 + Quill
- **Database:** Supabase Postgres (`pg` driver, Transaction-mode pooler)
- **Auth:** Basic Auth via `proxy.ts`
- **PDF:** Client-side (`jspdf` + `html2canvas`)

## Setup

1. **Install deps**
   ```bash
   npm install
   ```

2. **Create a Supabase project**, then in the SQL editor run:
   - `supabase/schema.sql` — creates the `emails` table and indexes
   - `supabase/seed.sql` — optional, inserts the three sample threads

3. **Get the Transaction-mode pooler URL** from Supabase (Project Settings → Database → Connection Pooling → Mode: Transaction). Port should be `6543`.

4. **Create `.env.local`** (see `.env.example`):
   ```
   DATABASE_URL=postgresql://...:6543/postgres
   AUTH_USER=administrator
   AUTH_PASS=<your-strong-password>
   ```

5. **Run dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel — it auto-detects Next.js.
3. Set env vars in the Vercel dashboard: `DATABASE_URL`, `AUTH_USER`, `AUTH_PASS`.
4. Deploy. No `vercel.json` needed.

## API Endpoints

All `/api/*` routes require Basic Auth.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/check` | Verify credentials |
| GET | `/api/threads` | List threads (inbox view) |
| GET | `/api/threads/:id` | Get all emails in a thread |
| DELETE | `/api/threads/:id` | Delete a thread |
| POST | `/api/emails` | Create new email or reply |
| GET | `/api/search?q=term` | Search emails |
| GET | `/api/threads/:id/export` | Export thread as JSON |
| POST | `/api/threads/import` | Import thread from JSON |

## Creating an Email (API)

```json
POST /api/emails
{
  "fromName": "John Doe",
  "fromEmail": "john@example.com",
  "to": [{ "name": "Jane", "email": "jane@example.com" }],
  "cc": [],
  "subject": "Hello",
  "body": "<p>Hi there!</p>",
  "threadId": "optional-for-replies",
  "parentId": "optional-parent-message-id"
}
```
