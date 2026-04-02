import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-retro text-cyan">
      {/* Overlays */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-40" />
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />
      
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-magenta text-black jarring-border-alt screen-tear">
            <Terminal className="w-8 h-8" />
          </div>
          <div>
            <h1 
              className="text-4xl md:text-5xl font-pixel text-cyan glitch-text"
              data-text="SNAKE.EXE"
            >
              SNAKE.EXE
            </h1>
            <p className="text-xl text-magenta uppercase tracking-widest mt-2">SYS.ERR // OVERRIDE</p>
          </div>
        </div>

        <div className="flex items-center gap-8 jarring-border p-4 bg-black">
          <div className="flex flex-col items-end">
            <span className="text-sm text-magenta">MEM_ALLOC</span>
            <span className="text-4xl font-pixel text-cyan">{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="w-1 h-12 bg-magenta screen-tear" />
          <div className="flex flex-col items-end">
            <span className="text-sm text-magenta">MAX_OVERFLOW</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan" />
              <span className="text-4xl font-pixel text-cyan">{highScore.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Sidebar */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="p-6 bg-black jarring-border">
            <h3 className="text-xl text-magenta mb-4 flex items-center gap-2 font-pixel">
              <AlertTriangle className="w-6 h-6" /> INSTRUCT
            </h3>
            <ul className="space-y-4 text-xl text-cyan">
              <li className="flex items-start gap-2">
                <span className="text-magenta">{'>'}</span>
                INPUT: WASD / ARROWS
              </li>
              <li className="flex items-start gap-2">
                <span className="text-magenta">{'>'}</span>
                TARGET: CORRUPT_DATA (MAGENTA)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-magenta">{'>'}</span>
                AVOID: SELF_INTERSECT
              </li>
              <li className="flex items-start gap-2">
                <span className="text-magenta">{'>'}</span>
                EXECUTE: SPACE TO HALT
              </li>
            </ul>
          </div>
        </div>

        {/* Center - Game Window */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full">
          <MusicPlayer />
          
          <div className="mt-4 p-4 bg-magenta text-black font-pixel text-xs screen-tear">
            <p className="leading-loose">
              DIAGNOSTIC:<br/>
              CPU: 104% [WARN]<br/>
              RAM: CORRUPTED<br/>
              AUDIO: FORCED_PLAYBACK
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
