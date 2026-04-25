'use client';

import { Mail, Send, FileText, Pencil, Inbox } from 'lucide-react';

interface SidebarProps {
  onCompose: () => void;
  activeFolder: string;
}

export default function Sidebar({ onCompose, activeFolder }: SidebarProps) {
  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
  ];

  return (
    <div className="w-64 bg-[#f6f8fc] h-full flex flex-col border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={onCompose}
          className="flex items-center gap-3 bg-[#c2e7ff] hover:bg-[#a8d8f0] text-[#001d35] rounded-2xl px-6 py-3.5 shadow-md hover:shadow-lg transition-all w-full font-medium text-sm"
        >
          <Pencil size={18} />
          Compose
        </button>
      </div>

      <nav className="flex-1 px-3">
        {folders.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`flex items-center gap-4 px-4 py-2 rounded-full cursor-pointer text-sm mb-0.5 transition-colors ${
              activeFolder === id
                ? 'bg-[#d3e3fd] text-[#001d35] font-semibold'
                : 'text-[#444746] hover:bg-[#e8eaed]'
            }`}
          >
            <Icon size={18} />
            {label}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail size={14} />
          Affinity Finance Support
        </div>
      </div>
    </div>
  );
}
