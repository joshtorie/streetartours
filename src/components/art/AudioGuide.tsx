import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioGuideProps {
  audioUrl: string;
  title: string;
}

export function AudioGuide({ audioUrl, title }: AudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        
        <div>
          <h3 className="font-semibold">Audio Guide</h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
        
        <Volume2 className="w-5 h-5 text-gray-400 ml-auto" />
      </div>
      
      <audio ref={audioRef} src={audioUrl} className="hidden" />
    </div>
  );
}