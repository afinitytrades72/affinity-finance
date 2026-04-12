import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ThreadList from './components/ThreadList';
import ThreadView from './components/ThreadView';
import ComposeModal from './components/ComposeModal';
import { fetchThreads, fetchThread, createEmail, deleteThread, exportThreadPDF, exportThreadJSON, importThreadJSON, searchEmails } from './utils/api';
import { Upload } from 'lucide-react';

export default function App() {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [threadEmails, setThreadEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const loadThreads = useCallback(async () => {
    const data = await fetchThreads();
    setThreads(data);
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  const handleSelectThread = async (threadId) => {
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

  const handleCompose = async (data) => {
    await createEmail(data);
    loadThreads();
  };

  const handleReply = async (data) => {
    await createEmail(data);
    handleSelectThread(data.threadId);
  };

  const handleDelete = async (threadId) => {
    await deleteThread(threadId);
    if (selectedThreadId === threadId) handleBack();
    else loadThreads();
  };

  const handleExportPDF = async () => {
    if (!selectedThreadId) return;
    const blob = await exportThreadPDF(selectedThreadId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thread-${selectedThreadId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    if (!selectedThreadId) return;
    const data = await exportThreadJSON(selectedThreadId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thread-${selectedThreadId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      const emails = JSON.parse(text);
      await importThreadJSON(emails);
      loadThreads();
    };
    input.click();
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      loadThreads();
      return;
    }
    const results = await searchEmails(query);
    setSearchResults(results);
    setSelectedThreadId(null);
  };

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
                onExportPDF={handleExportPDF}
                onExportJSON={handleExportJSON}
              />
            )
          ) : (
            <>
              {/* Toolbar */}
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
