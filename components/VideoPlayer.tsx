
import React from 'react';
import { VideoData } from '../types';

interface VideoPlayerProps {
  video: VideoData;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  return (
    <div className="relative group">
      <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-800">
        <video 
          key={video.url}
          id="main-video-player"
          src={video.url}
          controls
          className="w-full h-full"
          autoPlay
          crossOrigin="anonymous"
        />
      </div>
      <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
    </div>
  );
};

export default VideoPlayer;
