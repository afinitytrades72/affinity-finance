'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Reply, ReplyAll, FileDown, Download, ChevronDown, ChevronUp } from 'lucide-react';
import DOMPurify from 'dompurify';
import ReplyForm from './ReplyForm';
import type { Email, NewEmailInput } from '@/lib/types';

interface EmailMessageProps {
  email: Email;
  isLast: boolean;
  onReply: (email: Email) => void;
  onReplyAll: (email: Email) => void;
}

function EmailMessage({ email, isLast, onReply, onReplyAll }: EmailMessageProps) {
  const [expanded, setExpanded] = useState(isLast);
  const date = format(new Date(email.timestamp), "EEE, MMM d, yyyy 'at' h:mm a");
  const toStr = email.toRecipients.map((r) => r.name || r.email).join(', ');
  const ccStr = email.ccRecipients?.length
    ? email.ccRecipients.map((r) => r.name || r.email).join(', ')
    : '';

  const initials = (email.fromName || 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
  const colorIdx = email.fromName.charCodeAt(0) % colors.length;

  return (
    <div className="border border-gray-200 rounded-xl mb-3 bg-white overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full ${colors[colorIdx]} text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm text-gray-900">{email.fromName}</span>
              <span className="text-xs text-gray-500">&lt;{email.fromEmail}&gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{date}</span>
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          {!expanded && (
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {DOMPurify.sanitize(email.body, { ALLOWED_TAGS: [] }).slice(0, 120)}
            </p>
          )}
          {expanded && (
            <div className="text-xs text-gray-500 mt-0.5">
              to {toStr}{ccStr ? `, cc: ${ccStr}` : ''}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <>
          <div className="px-5 pb-4 pl-[4.25rem]">
            <div
              className="email-body text-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body) }}
            />
          </div>
          <div className="flex gap-2 px-5 pb-3 pl-[4.25rem]">
            <button
              onClick={() => onReply(email)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Reply size={16} /> Reply
            </button>
            <button
              onClick={() => onReplyAll(email)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ReplyAll size={16} /> Reply All
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface ThreadViewProps {
  emails: Email[];
  onBack: () => void;
  onReply: (data: NewEmailInput) => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
}

export default function ThreadView({ emails, onBack, onReply, onExportPDF, onExportJSON }: ThreadViewProps) {
  const [replyTo, setReplyTo] = useState<Email | null>(null);
  const [replyAll, setReplyAll] = useState(false);
  const subject = emails[0]?.subject || 'Thread';

  const handleReply = (email: Email) => { setReplyTo(email); setReplyAll(false); };
  const handleReplyAll = (email: Email) => { setReplyTo(email); setReplyAll(true); };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-normal text-gray-800 flex-1 truncate">{subject}</h2>
        <div className="flex gap-1">
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a73e8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors"
          >
            <FileDown size={16} /> Export PDF
          </button>
          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={16} /> JSON
          </button>
        </div>
      </div>

      <div id="thread-print-root" className="flex-1 overflow-y-auto p-4">
        {emails.map((email, i) => (
          <EmailMessage
            key={email.id}
            email={email}
            isLast={i === emails.length - 1}
            onReply={handleReply}
            onReplyAll={handleReplyAll}
          />
        ))}

        {replyTo && (
          <ReplyForm
            replyTo={replyTo}
            replyAll={replyAll}
            threadId={emails[0].threadId}
            subject={subject}
            onSend={(data) => { onReply(data); setReplyTo(null); }}
            onCancel={() => setReplyTo(null)}
          />
        )}
      </div>
    </div>
  );
}
