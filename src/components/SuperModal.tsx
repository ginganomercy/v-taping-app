import React from 'react';
import { X, ShieldAlert, Timer } from 'lucide-react';
import { Exercise } from '../types/workout';

interface SuperModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onOpenNegativeTimer: () => void;
}

export const SuperModal: React.FC<SuperModalProps> = ({
  exercise,
  onClose,
  onOpenNegativeTimer
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto no-scrollbar p-6 space-y-4 shadow-2xl relative">
        {/* Top Drag Handle */}
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-1"></div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-200">
            {exercise.muscle}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-res Image Preview Frame */}
        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/90 relative shadow-sm">
          <img
            src={exercise.image}
            alt={exercise.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './pull-up.png';
            }}
          />
        </div>

        <div>
          <h3 className="text-lg font-black text-zinc-950">{exercise.title}</h3>
          <div className="mt-1 flex items-center gap-2 font-mono font-bold text-red-600 text-xs">
            <span>{exercise.sets} Set Target</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>{exercise.repsLabel}</span>
          </div>
        </div>

        {/* 3 Tactical Spec Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] text-zinc-400 block font-sans font-bold">ALAT</span>
            <strong className="text-zinc-800 font-bold text-[11px]">{exercise.equip}</strong>
          </div>
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] text-zinc-400 block font-sans font-bold">POLA</span>
            <strong className="text-zinc-800 font-bold text-[11px]">{exercise.pattern}</strong>
          </div>
          <div className="p-2 rounded-xl bg-red-50 border border-red-100">
            <span className="text-[9px] text-red-600 block font-sans font-bold">TEMPO</span>
            <strong className="text-red-600 font-black text-[11px]">{exercise.tempo}</strong>
          </div>
        </div>

        {/* Form Checklist */}
        <div className="space-y-1.5 text-xs text-zinc-600 bg-slate-50 p-3.5 rounded-2xl border border-zinc-200">
          <h4 className="font-extrabold text-zinc-900 flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-600" /> Petunjuk Form & Biomekanika:
          </h4>
          <p className="leading-relaxed font-medium text-zinc-700">{exercise.tip}</p>
        </div>

        {/* Action Button for Timer inside modal */}
        {exercise.hasNegativeTimer && (
          <button
            onClick={() => {
              onClose();
              onOpenNegativeTimer();
            }}
            className="btn-spring w-full py-3.5 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <Timer className="w-4 h-4" /> Buka Beeper 4 Detik Negatif
          </button>
        )}

        <button
          onClick={onClose}
          className="btn-spring w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-xs transition"
        >
          Tutup Detail
        </button>
      </div>
    </div>
  );
};
