'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Email, NewEmailInput } from '@/lib/types';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ReplyFormProps {
  replyTo: Email;
  replyAll: boolean;
  threadId: string;
  subject: string;
  onSend: (data: NewEmailInput) => void;
  onCancel: () => void;
}

export default function ReplyForm({ replyTo, replyAll, threadId, subject, onSend, onCancel }: ReplyFormProps) {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [body, setBody] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [showTimestamp, setShowTimestamp] = useState(false);

  const toRecipients = replyAll
    ? [
        { name: replyTo.fromName, email: replyTo.fromEmail },
        ...replyTo.toRecipients.filter((r) => r.email !== replyTo.fromEmail),
      ]
    : [{ name: replyTo.fromName, email: replyTo.fromEmail }];

  const handleSend = () => {
    if (!fromName.trim() || !fromEmail.trim() || !body.trim()) return;
    onSend({
      fromName,
      fromEmail,
      to: toRecipients,
      cc: replyAll ? (replyTo.ccRecipients || []) : [],
      subject: subject.startsWith('Re: ') ? subject : `Re: ${subject}`,
      body,
      timestamp: timestamp || undefined,
      threadId,
      parentId: replyTo.id,
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm ml-[3.25rem] mt-2">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="text-xs text-gray-500 mb-3">
          {replyAll ? 'Reply All' : 'Reply'} to {replyTo.fromName}
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Your name"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Your email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-gray-400 mb-1">
          To: {toRecipients.map((r) => `${r.name} <${r.email}>`).join(', ')}
        </div>
        <div className="mt-2">
          <button
            onClick={() => setShowTimestamp(!showTimestamp)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showTimestamp ? 'Hide timestamp' : 'Set custom timestamp'}
          </button>
          {showTimestamp && (
            <input
              type="datetime-local"
              value={timestamp ? new Date(timestamp).toISOString().slice(0, 16) : ''}
              onChange={(e) => setTimestamp(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          )}
        </div>
      </div>
      <div className="px-4 py-2">
        <ReactQuill theme="snow" value={body} onChange={setBody} placeholder="Write your reply..." />
      </div>
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleSend}
          className="px-5 py-2 bg-[#1a73e8] text-white rounded-full text-sm font-medium hover:bg-[#1557b0] transition-colors"
        >
          Send
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
