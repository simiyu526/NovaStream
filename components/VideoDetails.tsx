
import React from 'react';
import { VideoData } from '../types';

interface VideoDetailsProps {
  video: VideoData;
  onAnalyze: (video: VideoData, frameData: string) => void;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({ video, onAnalyze }) => {
  // Capture the current frame from the video player for AI analysis
  const handleAnalyzeClick = () => {
    const videoElement = document.getElementById('main-video-player') as HTMLVideoElement;
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      onAnalyze(video, frameData);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                <i className="far fa-heart"></i>
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
          <p className="text-zinc-500 mt-2 flex items-center space-x-3 text-sm">
            <span>Uploaded on {video.uploadDate}</span>
            <span>•</span>
            <span>{video.fileSize}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {video.aiTags?.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-full">
              #{tag}
            </span>
          ))}
          {!video.aiTags && (
             <span className="text-xs text-zinc-600 italic">No tags yet.</span>
          )}
        </div>

        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <i className="fas fa-magic text-indigo-400"></i>
              <span>AI Insights</span>
            </h3>
            <button 
              onClick={handleAnalyzeClick}
              disabled={video.isAnalyzing}
              title="Analyze current video frame"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                video.isAnalyzing
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {video.isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-brain"></i>
                  <span>Analyze Frame</span>
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {video.aiSummary ? (
              <p className="text-zinc-300 text-sm leading-relaxed">
                {video.aiSummary}
              </p>
            ) : (
              <div className="py-8 text-center text-zinc-600">
                <p className="text-sm">
                  Click the analysis button to generate a neural summary of this video frame.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-zinc-500">Source Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Type</span>
              <span className="text-zinc-300 font-medium">{video.isGenerated ? 'NovaDream Generation' : 'Local File'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Duration</span>
              <span className="text-zinc-300">{video.duration}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-6 border border-indigo-500/10">
          <h3 className="font-semibold mb-2 text-sm text-indigo-400">NovaStream AI</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Experience high-performance neural video analysis. Local files support full frame-by-frame inspection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
