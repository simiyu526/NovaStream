
import React from 'react';

interface DreamStatusProps {
  message: string;
}

const DreamStatus: React.FC<DreamStatusProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="relative w-64 h-64 mb-12">
        {/* Animated Orbs */}
        <div className="absolute inset-0 bg-indigo-600/20 blur-[80px] rounded-full animate-pulse"></div>
        <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-12 border border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1.5 h-8 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0s]"></div>
            <div className="w-1.5 h-12 bg-purple-500 rounded-full animate-[bounce_1s_infinite_0.1s]"></div>
            <div className="w-1.5 h-10 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
            <div className="w-1.5 h-6 bg-purple-400 rounded-full animate-[bounce_1s_infinite_0.3s]"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-zinc-500 bg-clip-text text-transparent">
          Manifesting Dream...
        </h2>
        <p className="text-zinc-500 text-sm font-medium tracking-wide flex items-center justify-center space-x-2">
          <i className="fas fa-circle-notch fa-spin text-indigo-500 text-[10px]"></i>
          <span>{message}</span>
        </p>
        <div className="pt-4 px-8 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-[11px] text-zinc-600 max-w-xs mx-auto">
          AI Video generation typically takes 1-2 minutes. Stay on this screen for the best result.
        </div>
      </div>
    </div>
  );
};

export default DreamStatus;
