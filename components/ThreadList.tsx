'use client';

import { format, isToday, isThisYear } from 'date-fns';
import { Star, Trash2 } from 'lucide-react';
import type { ThreadSummary } from '@/lib/types';

function formatTimestamp(ts: string) {
  const date = new Date(ts);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isThisYear(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
}

function stripHtml(html: string) {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '');
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

interface ThreadListProps {
  threads: ThreadSummary[];
  onSelectThread: (threadId: string) => void;
  selectedThreadId: string | null;
  onDeleteThread: (threadId: string) => void;
}

export default function ThreadList({ threads, onSelectThread, selectedThreadId, onDeleteThread }: ThreadListProps) {
  if (!threads.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No conversations yet. Click Compose to create one.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {threads.map((thread) => {
        const snippet = stripHtml(thread.body).slice(0, 100);
        const isSelected = thread.threadId === selectedThreadId;
        return (
          <div
            key={thread.threadId}
            onClick={() => onSelectThread(thread.threadId)}
            className={`flex items-center px-4 py-2 cursor-pointer border-b border-gray-100 group transition-colors ${
              isSelected ? 'bg-[#c2e7ff]/40' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-5 h-5 border-2 border-gray-300 rounded-sm mr-4 flex-shrink-0" />
            <Star size={18} className="text-gray-300 mr-3 flex-shrink-0 hover:text-yellow-400 cursor-pointer" />

            <div className="flex-1 min-w-0 flex items-baseline gap-2">
              <span className="font-medium text-sm text-gray-800 w-44 flex-shrink-0 truncate">
                {thread.fromName}
                {thread.messageCount > 1 && (
                  <span className="text-xs text-gray-500 font-normal ml-1">({thread.messageCount})</span>
                )}
              </span>
              <span className="text-sm text-gray-800 truncate flex-shrink-0 max-w-[220px]">
                {thread.subject}
              </span>
              <span className="text-sm text-gray-500 truncate flex-1 min-w-0">
                — {snippet}
              </span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onDeleteThread(thread.threadId); }}
              className="p-1.5 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity mr-2"
            >
              <Trash2 size={16} className="text-gray-500" />
            </button>

            <span className="text-xs text-gray-500 flex-shrink-0 w-20 text-right">
              {formatTimestamp(thread.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
