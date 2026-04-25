'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Minus, Maximize2 } from 'lucide-react';
import type { NewEmailInput, Recipient } from '@/lib/types';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ComposeModalProps {
  onSend: (data: NewEmailInput) => void;
  onClose: () => void;
}

function parseRecipients(input: string): Recipient[] {
  if (!input.trim()) return [];
  return input.split(',').map((s) => {
    const match = s.trim().match(/^(.+?)\s*<(.+?)>$/);
    if (match) return { name: match[1].trim(), email: match[2].trim() };
    const email = s.trim();
    return { name: email.split('@')[0], email };
  });
}

export default function ComposeModal({ onSend, onClose }: ComposeModalProps) {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSend = () => {
    const to = parseRecipients(toInput);
    if (!fromName.trim() || !fromEmail.trim() || !to.length || !subject.trim() || !body.trim()) return;
    onSend({
      fromName,
      fromEmail,
      to,
      cc: parseRecipients(ccInput),
      bcc: parseRecipients(bccInput),
      subject,
      body,
      timestamp: timestamp ? new Date(timestamp).toISOString() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed bottom-0 right-6 w-[540px] bg-white rounded-t-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[85vh]">
      <div className="flex items-center justify-between bg-[#404040] text-white px-4 py-2.5 rounded-t-xl">
        <span className="text-sm font-medium">New Message</span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-white/10 rounded"><Minus size={16} /></button>
          <button className="p-1 hover:bg-white/10 rounded"><Maximize2 size={16} /></button>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X size={16} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex gap-2">
            <input
              type="text" placeholder="From name" value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="flex-1 py-1.5 text-sm outline-none border-b border-transparent focus:border-blue-500"
            />
            <input
              type="email" placeholder="From email" value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="flex-1 py-1.5 text-sm outline-none border-b border-transparent focus:border-blue-500"
            />
          </div>
        </div>

        <div className="px-4 py-1.5 border-b border-gray-100 flex items-center">
          <span className="text-sm text-gray-500 w-8">To</span>
          <input
            type="text" value={toInput} onChange={(e) => setToInput(e.target.value)}
            placeholder="name <email>, ..."
            className="flex-1 py-1 text-sm outline-none"
          />
          {!showCcBcc && (
            <button onClick={() => setShowCcBcc(true)} className="text-xs text-gray-500 hover:text-gray-700">
              Cc/Bcc
            </button>
          )}
        </div>

        {showCcBcc && (
          <>
            <div className="px-4 py-1.5 border-b border-gray-100 flex items-center">
              <span className="text-sm text-gray-500 w-8">Cc</span>
              <input
                type="text" value={ccInput} onChange={(e) => setCcInput(e.target.value)}
                placeholder="name <email>, ..."
                className="flex-1 py-1 text-sm outline-none"
              />
            </div>
            <div className="px-4 py-1.5 border-b border-gray-100 flex items-center">
              <span className="text-sm text-gray-500 w-8">Bcc</span>
              <input
                type="text" value={bccInput} onChange={(e) => setBccInput(e.target.value)}
                placeholder="name <email>, ..."
                className="flex-1 py-1 text-sm outline-none"
              />
            </div>
          </>
        )}

        <div className="px-4 py-1.5 border-b border-gray-100">
          <input
            type="text" placeholder="Subject" value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full py-1 text-sm outline-none"
          />
        </div>

        <div className="px-4 pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-blue-600 hover:underline mb-1"
          >
            {showAdvanced ? 'Hide advanced' : 'Advanced options'}
          </button>
          {showAdvanced && (
            <div className="mb-2">
              <label className="text-xs text-gray-500 block mb-1">Custom timestamp</label>
              <input
                type="datetime-local" value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="px-4 pb-2">
          <ReactQuill theme="snow" value={body} onChange={setBody} placeholder="Compose email..." />
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-[#1a73e8] text-white rounded-full text-sm font-medium hover:bg-[#1557b0] transition-colors"
        >
          Send
        </button>
        <div className="flex-1" />
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
