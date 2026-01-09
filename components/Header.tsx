
import React from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUploadClick: () => void;
  onDream: () => void;
  isSyncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onUploadClick, onDream, isSyncing }) => {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex-1 max-w-2xl hidden md:block">
        <div className="relative flex items-center group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i className="fas fa-sparkles text-indigo-500 group-focus-within:animate-pulse"></i>
          </div>
          <input 
            type="text"
            placeholder="Imagine a cinematic scene (e.g., 'A neon futuristic city at night')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onDream()}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-l-2xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-zinc-600"
          />
          <button 
            onClick={onDream}
            disabled={!searchQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-6 py-2.5 rounded-r-2xl text-xs font-bold transition-all border border-indigo-600/50 flex items-center space-x-2 shadow-lg shadow-indigo-500/10"
          >
            <i className="fas fa-play text-[10px]"></i>
            <span>Dream</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-inner">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {isSyncing ? 'Processing' : 'Nova Ready'}
          </span>
        </div>
        <button 
          onClick={onUploadClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
        >
          <i className="fas fa-file-arrow-up"></i>
        </button>
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-zinc-800">
          NS
        </div>
      </div>
    </header>
  );
};

export default Header;
