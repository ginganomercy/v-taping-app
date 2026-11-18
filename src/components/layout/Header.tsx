import React, { useState } from 'react';
import { Timer, Volume2, VolumeX, User } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 px-3 sm:px-4 py-2.5 sm:py-3 safe-top flex items-center justify-between gap-2 shadow-sm">
      {/* Brand & Date Identity */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
        <div className="btn-spring shrink-0">
          <BrandLogo variant="icon" size={36} className="shadow-md shadow-zinc-950/20 rounded-xl sm:rounded-2xl" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-black tracking-tight text-zinc-950 flex items-center gap-1 font-['Montserrat',sans-serif] truncate">
            <span className="text-red-600 font-extrabold">V</span>
            <span className="text-zinc-400 font-light">-</span>
            <span>TAPING</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold tracking-wider shadow-sm shrink-0">
              PRO
            </span>
          </h1>
          <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 truncate">{currentDate}</p>
        </div>
      </div>

      {/* Action Buttons Group (Rigid shrink-0 protection against mobile crush) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Profile Pill Button */}
        <button
          onClick={onOpenProfile}
          className="btn-spring shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-50 border border-zinc-200 text-zinc-700 hover:border-red-600 shadow-sm"
          title="Buka Profil Atlet"
        >
          <User className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="text-[10px] font-mono font-bold whitespace-nowrap">-{remainingKg}kg</span>
        </button>

        {/* Audio Mute Button */}
        <button
          onClick={toggleMute}
          className={`btn-spring shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition shadow-sm ${
            isMuted ? 'bg-zinc-200 text-zinc-400' : 'bg-red-50 text-red-600'
          }`}
          title="Toggle Suara"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Quick Rest Timer Trigger */}
        <button
          onClick={onOpenRestTimer}
          className="btn-spring shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-red-600 text-white font-mono font-bold text-[10px] shadow-sm shadow-red-500/25 whitespace-nowrap"
          title="Buka Rest Timer"
        >
          <Timer className="w-3.5 h-3.5 shrink-0" />
          <span>{quickTimerSeconds}s</span>
        </button>
      </div>
    </header>
  );
};
