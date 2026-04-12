const BASE = '/api';

export async function fetchThreads() {
  const res = await fetch(`${BASE}/threads`);
  return res.json();
}

export async function fetchThread(threadId) {
  const res = await fetch(`${BASE}/threads/${threadId}`);
  return res.json();
}

export async function createEmail(data) {
  const res = await fetch(`${BASE}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteThread(threadId) {
  const res = await fetch(`${BASE}/threads/${threadId}`, { method: 'DELETE' });
  return res.json();
}

export async function searchEmails(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function exportThreadPDF(threadId) {
  const res = await fetch(`${BASE}/threads/${threadId}/pdf`);
  return res.blob();
}

export async function exportThreadJSON(threadId) {
  const res = await fetch(`${BASE}/threads/${threadId}/export`);
  return res.json();
}

export async function importThreadJSON(emails) {
  const res = await fetch(`${BASE}/threads/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  });
  return res.json();
}
