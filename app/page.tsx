'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ThreadList from '@/components/ThreadList';
import ThreadView from '@/components/ThreadView';
import ComposeModal from '@/components/ComposeModal';
import Login from '@/components/Login';
import {
  fetchThreads, fetchThread, createEmail, deleteThread,
  importThreadJSON, searchEmails,
  getStoredAuth, clearAuth, setUnauthorizedHandler,
} from '@/lib/api';
import type { Email, ThreadSummary, NewEmailInput } from '@/lib/types';

export default function Page() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadEmails, setThreadEmails] = useState<Email[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ThreadSummary[] | null>(null);

  useEffect(() => {
    setAuthed(!!getStoredAuth());
    setHydrated(true);
    setUnauthorizedHandler(() => setAuthed(false));
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      const data = await fetchThreads();
      setThreads(data);
    } catch { /* unauthorized handler resets auth state */ }
  }, []);

  useEffect(() => { if (authed) loadThreads(); }, [authed, loadThreads]);

  const handleSelectThread = async (threadId: string) => {
    setSelectedThreadId(threadId);
    setLoading(true);
    const data = await fetchThread(threadId);
    setThreadEmails(data);
    setLoading(false);
  };

  const handleBack = () => {
    setSelectedThreadId(null);
    setThreadEmails([]);
    setSearchResults(null);
    loadThreads();
  };

  const handleCompose = async (data: NewEmailInput) => {
    await createEmail(data);
    loadThreads();
  };

  const handleReply = async (data: NewEmailInput) => {
    await createEmail(data);
    if (data.threadId) handleSelectThread(data.threadId);
  };

  const handleDelete = async (threadId: string) => {
    const password = window.prompt('Enter delete password:');
    if (!password) return;
    try {
      await deleteThread(threadId, password);
      if (selectedThreadId === threadId) handleBack();
      else loadThreads();
    } catch (err) {
      alert((err as Error).message || 'Delete failed');
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const emails = JSON.parse(text) as Email[];
      await importThreadJSON(emails);
      loadThreads();
    };
    input.click();
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      loadThreads();
      return;
    }
    const results = await searchEmails(query);
    const summaries: ThreadSummary[] = results.map((e) => ({ ...e, messageCount: 1 }));
    setSearchResults(summaries);
    setSelectedThreadId(null);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setSelectedThreadId(null);
    setThreadEmails([]);
    setSearchResults(null);
  };

  if (!hydrated) return null;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const displayThreads = searchResults || threads;

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header onSearch={handleSearch} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <Sidebar onCompose={() => setShowCompose(true)} activeFolder="inbox" />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedThreadId ? (
            loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
            ) : (
              <ThreadView
                emails={threadEmails}
                onBack={handleBack}
                onReply={handleReply}
              />
            )
          ) : (
            <>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-sm" />
                <div className="flex-1" />
                {searchResults && (
                  <span className="text-xs text-gray-500 mr-2">{searchResults.length} results</span>
                )}
                <button
                  onClick={handleImportJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                >
                  <Upload size={14} /> Import JSON
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>

              <ThreadList
                threads={displayThreads}
                onSelectThread={handleSelectThread}
                selectedThreadId={selectedThreadId}
                onDeleteThread={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      {showCompose && (
        <ComposeModal onSend={handleCompose} onClose={() => setShowCompose(false)} />
      )}
    </div>
  );
}
