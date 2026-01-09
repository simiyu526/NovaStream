
import React, { useState, useRef } from 'react';
import { VideoData } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (video: VideoData) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file.');
      return;
    }

    setIsUploading(true);

    try {
      const url = URL.createObjectURL(file);
      
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject('Metadata timeout'), 10000);
        
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          const minutes = Math.floor(video.duration / 60);
          const seconds = Math.floor(video.duration % 60);
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Seek to 25% of duration or 2 seconds, whichever is better for a thumbnail
          video.currentTime = Math.min(video.duration * 0.25, 5);
          
          video.onseeked = () => {
            const canvas = document.createElement('canvas');
            // Maintain aspect ratio for thumbnail
            const ratio = video.videoWidth / video.videoHeight;
            canvas.width = 640;
            canvas.height = 640 / ratio;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              // Save as a decent quality jpeg for syncing to localStorage
              const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
              
              const newVideo: VideoData = {
                id: Math.random().toString(36).substr(2, 9),
                title: file.name.split('.')[0] || 'Untitled Video',
                url: url,
                thumbnail: thumbnail,
                duration: durationStr,
                uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                fileSize: formatFileSize(file.size),
                isSynced: false // Will be set to true by App.tsx
              };
              
              onUpload(newVideo);
              resolve(null);
            } else {
              reject('Canvas context failed');
            }
          };
        };

        video.onerror = () => {
          clearTimeout(timeout);
          reject('Video error');
        };
      });
    } catch (error) {
      console.error("Upload process error:", error);
      alert("Failed to process video. Make sure it's a standard web-compatible format.");
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg bg-[#121216] border border-zinc-800 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sync New Media</h2>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Cloud Persistence Enabled</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-zinc-800 transition-all text-zinc-500 border border-transparent hover:border-zinc-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
              relative aspect-video flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-500
              ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[0.98]' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950/50'}
              ${isUploading ? 'pointer-events-none' : ''}
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 border-2 border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 w-14 h-14 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                  <i className="fas fa-sync-alt absolute inset-0 flex items-center justify-center text-indigo-500 text-xs animate-pulse"></i>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-300">Syncing with Library</p>
                  <p className="text-[10px] text-zinc-600 font-medium uppercase mt-1 tracking-tighter">Generating High-Res Thumbnail</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-4 text-indigo-500 ring-1 ring-indigo-500/30 group-hover:scale-110 transition-transform">
                  <i className="fas fa-cloud-upload-alt text-2xl"></i>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-200">Drop video file here</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Cloud sync will begin immediately after upload</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="video/*" 
              className="hidden" 
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                <i className="fas fa-bolt text-[10px]"></i>
              </div>
              <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-tighter">Auto Capture</p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-tight">Frames captured at peak quality for the library.</p>
            </div>
            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
                <i className="fas fa-shield-alt text-[10px]"></i>
              </div>
              <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-tighter">Local Sync</p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-tight">Metadata stays in your browser's cloud vault.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
