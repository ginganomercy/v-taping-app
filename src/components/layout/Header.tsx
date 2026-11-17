import React, { useState } from 'react';
import { Flame, Timer, Volume2, VolumeX, User } from 'lucide-react';
import { soundSynthService } from '@/infrastructure/audio/soundSynth.service';
import { UserProfile } from '@/types/profile.types';

interface HeaderProps {
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenRestTimer: () => void;
  quickTimerSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenRestTimer,
  quickTimerSeconds
}) => {
  const [isMuted, setIsMuted] = useState(soundSynthService.isMuted);

  const toggleMute = () => {
    soundSynthService.isMuted = !soundSynthService.isMuted;
    setIsMuted(soundSynthService.isMuted);
    if (!soundSynthService.isMuted) {
      soundSynthService.playBeep(600, 'sine', 0.1);
    }
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  const remainingKg = Math.max(0, profile.startWeightKg - profile.targetWeightKg);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 px-4 py-3 safe-top flex items-center justify-between shadow-sm">
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
        {/* Profile Pill Button */}
        <button
          onClick={onOpenProfile}
          className="btn-spring flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-zinc-200 text-zinc-700 hover:border-red-600 shadow-sm"
          title="Buka Profil Atlet"
        >
          <User className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[10px] font-mono font-bold">-{remainingKg}kg</span>
        </button>

        {/* Audio Mute Button */}
        <button
          onClick={toggleMute}
          className={`btn-spring w-8 h-8 rounded-xl flex items-center justify-center transition shadow-sm ${
            isMuted ? 'bg-zinc-200 text-zinc-400' : 'bg-red-50 text-red-600'
          }`}
          title="Toggle Suara"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Quick Rest Timer Trigger */}
        <button
          onClick={onOpenRestTimer}
          className="btn-spring flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 text-white font-mono font-bold text-[10px] shadow-sm shadow-red-500/25"
          title="Buka Rest Timer"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>{quickTimerSeconds}s</span>
        </button>
      </div>
    </header>
  );
};
