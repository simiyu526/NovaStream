
import React, { useState, useEffect } from 'react';
import { VideoData } from './types';
import { analyzeVideoFrame, generateVideo } from './services/geminiService';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import Header from './components/Header';
import UploadModal from './components/UploadModal';
import DreamStatus from './components/DreamStatus';

const STORAGE_KEY = 'novastream_library_v2';

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Generation States
  const [isDreaming, setIsDreaming] = useState(false);
  const [dreamMessage, setDreamMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as VideoData[];
        setVideos(parsed.map(v => ({ ...v, isSynced: true })));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const dataToSave = videos.map(({ url, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [videos]);

  const activeVideo = videos.find(v => v.id === activeVideoId);

  const handleUpload = (newVideo: VideoData) => {
    setIsSyncing(true);
    setVideos(prev => [{ ...newVideo, isSynced: true }, ...prev]);
    setActiveVideoId(newVideo.id);
    setIsUploadOpen(false);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleStartDream = async () => {
    if (!searchQuery.trim()) return;

    // Check for API Key selection (mandatory for Veo models)
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Proceed assuming success as per race condition guidelines
    }

    setIsDreaming(true);
    const prompt = searchQuery;
    setSearchQuery(''); 

    try {
      const videoUrl = await generateVideo(prompt, setDreamMessage);
      
      // Auto-generate thumbnail
      const video = document.createElement('video');
      video.src = videoUrl;
      await new Promise(r => video.onloadedmetadata = r);
      video.currentTime = 1;
      await new Promise(r => video.onseeked = r);
      
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 360;
      canvas.getContext('2d')?.drawImage(video, 0, 0, 640, 360);
      const thumb = canvas.toDataURL('image/jpeg');

      const newVideo: VideoData = {
        id: `dream-${Date.now()}`,
        title: `Dream: ${prompt.substring(0, 20)}...`,
        url: videoUrl,
        thumbnail: thumb,
        duration: "0:05",
        uploadDate: new Date().toLocaleDateString(),
        fileSize: "AI Gen",
        isGenerated: true,
        prompt: prompt,
        isSynced: true
      };

      setVideos(prev => [newVideo, ...prev]);
      setActiveVideoId(newVideo.id);
    } catch (e: any) {
      console.error(e);
      // Reset key selection if entity not found error occurs (SDK specific recovery)
      if (e?.message?.includes("Requested entity was not found.")) {
        await (window as any).aistudio.openSelectKey();
      }
      alert("The dream manifestation was interrupted. Please try again.");
    } finally {
      setIsDreaming(false);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.aiTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      <Sidebar 
        videos={filteredVideos} 
        activeVideoId={activeVideoId} 
        onSelect={setActiveVideoId} 
        onDelete={(id) => setVideos(v => v.filter(x => x.id !== id))}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onUploadClick={() => setIsUploadOpen(true)}
          onDream={handleStartDream}
          isSyncing={isSyncing || isDreaming}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isDreaming ? (
            <DreamStatus message={dreamMessage} />
          ) : activeVideo ? (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <VideoPlayer video={activeVideo} />
              <VideoDetails 
                video={activeVideo} 
                onAnalyze={async (v, frame) => {
                  setVideos(prev => prev.map(x => x.id === v.id ? { ...x, isAnalyzing: true } : x));
                  try {
                    const res = await analyzeVideoFrame(frame, "Analyze this cinematic video frame and provide descriptive insights.");
                    setVideos(prev => prev.map(x => x.id === v.id ? { 
                      ...x, aiSummary: res.summary, aiTags: res.tags, isAnalyzing: false 
                    } : x));
                  } catch (err) {
                    console.error("Frame analysis failed:", err);
                    setVideos(prev => prev.map(x => x.id === v.id ? { ...x, isAnalyzing: false } : x));
                  }
                }} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl">
                  <i className="fas fa-wand-magic-sparkles text-4xl text-indigo-500/50"></i>
                </div>
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full -z-10 animate-pulse"></div>
              </div>
              <div className="text-center max-w-sm">
                <p className="text-xl font-bold text-zinc-200">Welcome to NovaDream</p>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Enter a prompt in the top bar to generate cinematic AI videos or upload your own clips to begin.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleUpload} 
        />
      )}
    </div>
  );
};

export default App;
