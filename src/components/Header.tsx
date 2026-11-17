import React, { useState } from 'react';
import { Flame, Timer, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../services/sound';

interface HeaderProps {
  onOpenRestTimer: () => void;
  quickTimerSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRestTimer, quickTimerSeconds }) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const toggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playBeep(600, 'sine', 0.1);
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md shadow-red-500/25 btn-spring">
          <Flame className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-tight text-zinc-950 flex items-center gap-1.5">
            V-TAPER <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold tracking-widest shadow-sm">PRO</span>
          </h1>
          <p className="text-[11px] font-semibold text-zinc-500">{currentDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className={`btn-spring w-8 h-8 rounded-xl flex items-center justify-center transition ${
            isMuted ? 'bg-zinc-200 text-zinc-400' : 'bg-red-50 text-red-600'
          }`}
          title="Toggle Suara"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenRestTimer}
          className="btn-spring flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/70 text-red-600 font-mono text-xs font-bold shadow-sm"
        >
          <Timer className="w-4 h-4 text-red-600" />
          <span>{quickTimerSeconds}s</span>
        </button>
      </div>
    </header>
  );
};
