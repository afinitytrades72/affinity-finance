# Gmail Simulator

A full-stack web application that simulates a Gmail-like email interface for creating and exporting dummy email conversations.

## Features

- **Gmail-like UI** — Sidebar, email list, threaded conversation view
- **Compose emails** — Rich text editor with From, To, CC/BCC, custom timestamps
- **Email threading** — Reply / Reply All with proper parent-child relationships
- **Search** — Search emails by subject, sender, or body content
- **Export to PDF** — Professional-looking PDF export via Puppeteer
- **Import/Export JSON** — Portable email thread format
- **Seed data** — 3 sample threaded conversations included

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)
- **PDF:** Puppeteer
- **Rich Text:** React Quill

## Setup

```bash
# Install all dependencies
npm install
cd client && npm install
cd ..

# Development (runs both server and client)
npm run dev

# Production build
npm start
```

- **Dev mode:** Frontend at `http://localhost:5173`, API at `http://localhost:3001`
- **Production:** Everything served from `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/threads` | List all threads (inbox view) |
| GET | `/api/threads/:id` | Get all emails in a thread |
| POST | `/api/emails` | Create new email or reply |
| DELETE | `/api/threads/:id` | Delete a thread |
| GET | `/api/search?q=term` | Search emails |
| GET | `/api/threads/:id/pdf` | Export thread as PDF |
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

## Sample Data

The app seeds 3 demo threads on first run:

1. **Project Aurora - Kickoff Meeting** — 3-message thread about project planning
2. **[URGENT] Production API - 500 errors** — 3-message incident response thread
3. **New Dashboard Mockups - Q2 Redesign** — Single email with rich HTML formatting
