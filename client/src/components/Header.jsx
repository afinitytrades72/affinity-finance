import { Search, Menu, Settings, HelpCircle, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

export default function Header({ onSearch, onToggleSidebar }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="flex items-center h-16 px-4 bg-[#f6f8fc] border-b border-gray-200">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-200 mr-2">
        <Menu size={20} className="text-gray-600" />
      </button>

      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 rounded-lg" />
        <span className="text-xl text-gray-700 font-normal">Gmail</span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
        <div className="flex items-center bg-[#eaf1fb] rounded-full px-4 py-2.5 hover:bg-white hover:shadow-md transition-all group">
          <Search size={20} className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search mail"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-500"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 ml-4">
        <button className="p-2 rounded-full hover:bg-gray-200"><HelpCircle size={20} className="text-gray-600" /></button>
        <button className="p-2 rounded-full hover:bg-gray-200"><Settings size={20} className="text-gray-600" /></button>
        <button className="p-2 rounded-full hover:bg-gray-200"><LayoutGrid size={20} className="text-gray-600" /></button>
        <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-sm font-medium ml-2">
          A
        </div>
      </div>
    </header>
  );
}
