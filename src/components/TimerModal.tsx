import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { sound } from '../services/sound';

interface TimerModalProps {
  isOpen: boolean;
  type: 'rest' | 'negative';
  initialSeconds: number;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  type,
  initialSeconds,
  onClose
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTick = useCallback((sec: number) => {
    if (type === 'negative') {
      sound.playNegativeTick(sec);
    } else {
      if (sec <= 3 && sec > 0) sound.playBeep(520, 'sine', 0.1);
      if (sec === 0) sound.playCelebration();
    }
  }, [type]);

  useEffect(() => {
    if (!isOpen) {
      clearTimer();
      return;
    }

    setSecondsRemaining(initialSeconds);
    setIsRunning(true);

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        handleTick(next);
        if (next <= 0) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearTimer();
  }, [isOpen, initialSeconds, type, handleTick]);

  if (!isOpen) return null;

  const toggleTimer = () => {
    if (isRunning) {
      clearTimer();
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          handleTick(next);
          if (next <= 0) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
  };

  const setDuration = (sec: number) => {
    clearTimer();
    setSecondsRemaining(sec);
    setIsRunning(true);
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        handleTick(next);
        if (next <= 0) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 relative shadow-2xl border border-red-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono tracking-widest uppercase text-red-600 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 font-bold">
          {type === 'negative' ? 'TEMPO 4-DETIK NEGATIF' : 'REST TIMER'}
        </span>

        {/* Big Numeric Display */}
        <div className="py-2">
          <div className="text-6xl font-mono font-black text-red-600 tracking-tighter">
            {secondsRemaining}
          </div>
          <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono font-bold">
            Detik Tersisa
          </span>
        </div>

        {/* Quick Select Buttons (Rest Timer only) */}
        {type === 'rest' && (
          <div className="flex justify-center gap-2">
            {[30, 60, 90].map((s) => (
              <button
                key={s}
                onClick={() => setDuration(s)}
                className="btn-spring px-3 py-1.5 rounded-xl bg-zinc-100 text-xs font-mono font-bold text-zinc-700 hover:bg-red-50 hover:text-red-600"
              >
                {s}s
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={toggleTimer}
            className={`btn-spring flex-1 py-3.5 rounded-2xl font-black text-xs shadow-sm transition ${
              isRunning ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white shadow-red-600/30'
            }`}
          >
            {isRunning ? 'Jeda' : 'Mulai'}
          </button>
          <button
            onClick={() => setDuration(initialSeconds)}
            className="btn-spring px-4 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
