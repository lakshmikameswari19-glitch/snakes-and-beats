import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc3 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  { id: 1, title: "DATA_STREAM_01.WAV", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPTED_SECTOR.MP3", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NOISE_INJECTION.DAT", artist: "GHOST_IN_MACHINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => handleNext();
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };
  const togglePlay = () => setIsPlaying(!isPlaying);

  // ASCII Progress bar generator
  const getAsciiProgress = () => {
    const totalBlocks = 20;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    return '[' + '#'.repeat(filledBlocks) + '-'.repeat(totalBlocks - filledBlocks) + ']';
  };

  return (
    <div className="w-full bg-black jarring-border-alt p-6 font-retro">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleTrackEnd} />

      <div className="flex items-center gap-4 mb-6 border-b-2 border-magenta pb-4">
        <div className="w-16 h-16 bg-cyan text-black flex items-center justify-center screen-tear">
          <Disc3 className={`w-10 h-10 ${isPlaying ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold truncate text-cyan">{currentTrack.title}</h3>
          <p className="text-lg text-magenta truncate">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 text-cyan text-xl tracking-widest whitespace-pre">
        {getAsciiProgress()}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} className="p-2 text-magenta hover:bg-magenta hover:text-black border-2 border-transparent hover:border-magenta transition-none">
          <SkipBack className="w-8 h-8" />
        </button>

        <button onClick={togglePlay} className="p-4 bg-cyan text-black border-4 border-cyan hover:bg-black hover:text-cyan transition-none">
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>

        <button onClick={handleNext} className="p-2 text-magenta hover:bg-magenta hover:text-black border-2 border-transparent hover:border-magenta transition-none">
          <SkipForward className="w-8 h-8" />
        </button>

        <div className="flex items-center gap-2 text-cyan">
          <Volume2 className="w-6 h-6 screen-tear" />
        </div>
      </div>
    </div>
  );
};
