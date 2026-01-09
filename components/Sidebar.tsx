
import React from 'react';
import { VideoData } from '../types';

interface SidebarProps {
  videos: VideoData[];
  activeVideoId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUploadClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ videos, activeVideoId, onSelect, onDelete, onUploadClick }) => {
  return (
    <aside className="w-72 border-r border-zinc-800 flex flex-col bg-[#09090b] hidden lg:flex">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-sparkles text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter">NOVA<span className="text-indigo-500">STREAM</span></h1>
        </div>

        <nav className="space-y-1 mb-8">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 bg-zinc-900 text-white rounded-xl border border-zinc-800 transition-all">
            <i className="fas fa-ghost text-indigo-500"></i>
            <span className="font-bold text-xs uppercase tracking-widest">Manifestations</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all">
            <i className="fas fa-bolt-lightning"></i>
            <span className="font-bold text-xs uppercase tracking-widest">Activity</span>
          </button>
        </nav>

        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Neural Bank</h3>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">{videos.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-6">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => onSelect(video.id)}
            className={`group relative flex flex-col p-2.5 rounded-2xl cursor-pointer transition-all border ${
              activeVideoId === video.id 
                ? 'bg-zinc-900 border-indigo-500/50 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20' 
                : 'bg-transparent border-transparent hover:bg-zinc-900/30'
            }`}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-lg">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              {video.isGenerated && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-indigo-600 text-[8px] font-black text-white uppercase rounded tracking-tighter flex items-center space-x-1">
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Gen</span>
                </div>
              )}
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-md text-[10px] px-1.5 py-0.5 rounded-md text-white font-bold tracking-tighter">
                {video.duration}
              </div>
            </div>
            
            <div className="flex flex-col flex-1 min-w-0 pr-6">
              <span className={`text-xs font-bold truncate ${activeVideoId === video.id ? 'text-indigo-400' : 'text-zinc-300'}`}>
                {video.title}
              </span>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-0.5">
                {video.isGenerated ? 'NovaDream v3.1' : video.fileSize} • {video.uploadDate}
              </p>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(video.id); }}
              className="absolute top-2.5 right-2.5 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <i className="fas fa-times text-[10px]"></i>
            </button>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-20 opacity-20 flex flex-col items-center">
            <i className="fas fa-box-open text-3xl mb-4"></i>
            <p className="text-[10px] font-bold uppercase tracking-widest">Library Empty</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={onUploadClick}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
        >
          Inject Media
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
