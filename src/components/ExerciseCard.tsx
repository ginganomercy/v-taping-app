import React from 'react';
import { ZoomIn, Timer } from 'lucide-react';
import { Exercise, SetRecord } from '../types/workout';
import { sound } from '../services/sound';

interface ExerciseCardProps {
  exercise: Exercise;
  setsData: Record<number, SetRecord>;
  backpackPresets: number[];
  onUpdateSet: (setNum: number, field: keyof SetRecord, value: unknown) => void;
  onOpenModal: () => void;
  onOpenNegativeTimer: () => void;
  onPromptRestTimer: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  setsData,
  backpackPresets,
  onUpdateSet,
  onOpenModal,
  onOpenNegativeTimer,
  onPromptRestTimer
}) => {
  const handleToggleDone = (setNum: number, currentDone: boolean) => {
    sound.playBeep(650, 'sine', 0.1);
    const nextState = !currentDone;
    onUpdateSet(setNum, 'done', nextState);

    if (nextState && setNum < exercise.sets) {
      setTimeout(() => onPromptRestTimer(), 250);
    }
  };

  const isBackpackExercise = exercise.equip.toLowerCase().includes('tas');

  return (
    <div className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-card-soft space-y-3">
      {/* Top Card Row */}
      <div className="flex gap-3 items-center">
        <div
          onClick={onOpenModal}
          className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex-shrink-0 cursor-pointer relative group shadow-sm"
        >
          <img
            src={exercise.image}
            alt={exercise.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './pull-up.png';
            }}
          />
          <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0" onClick={onOpenModal}>
          <span className="text-[9px] font-mono uppercase tracking-wider text-red-600 font-black block truncate">
            {exercise.muscle}
          </span>
          <h3 className="text-sm font-extrabold text-zinc-950 truncate hover:text-red-600 transition cursor-pointer">
            {exercise.title}
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">
            {exercise.repsLabel}
          </p>
        </div>

        {exercise.hasNegativeTimer && (
          <button
            onClick={onOpenNegativeTimer}
            className="btn-spring p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 shadow-sm"
            title="Buka Timer 4s Negatif"
          >
            <Timer className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Backpack Quick Chips if relevant */}
      {isBackpackExercise && backpackPresets && backpackPresets.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[9px] font-mono font-bold text-zinc-400">PINTAS BEBAN:</span>
          {backpackPresets.map((kg) => (
            <button
              key={kg}
              type="button"
              onClick={() => {
                // Apply to first undone set
                for (let s = 1; s <= exercise.sets; s++) {
                  if (!setsData[s]?.done) {
                    onUpdateSet(s, 'kg', kg);
                    break;
                  }
                }
                sound.playBeep(520, 'sine', 0.08);
              }}
              className="btn-spring px-2 py-0.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-bold hover:bg-red-100"
            >
              +{kg}kg
            </button>
          ))}
        </div>
      )}

      {/* Per-Set Rows Table */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-100">
        <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-zinc-400 px-1 mb-1">
          <span className="col-span-2 text-center">SET</span>
          <span className="col-span-4">BEBAN TAS</span>
          <span className="col-span-3">REPS</span>
          <span className="col-span-3 text-right">STATUS</span>
        </div>

        {Array.from({ length: exercise.sets }, (_, i) => i + 1).map((setNum) => {
          const item = setsData[setNum] || {
            kg: exercise.defaultKg || '',
            reps: exercise.targetReps || '',
            done: false
          };

          return (
            <div
              key={setNum}
              className={`grid grid-cols-12 items-center gap-1.5 p-1.5 rounded-xl border transition ${
                item.done ? 'bg-red-50/60 border-red-200' : 'bg-slate-50 border-zinc-200/80'
              }`}
            >
              <span className="col-span-2 font-mono font-black text-xs text-center text-zinc-700">
                #{setNum}
              </span>

              {/* Input Beban Tas (kg) */}
              <div className="col-span-4 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
                <input
                  type="number"
                  step="0.5"
                  placeholder={String(exercise.defaultKg || 0)}
                  value={item.kg !== undefined ? item.kg : ''}
                  onChange={(e) => onUpdateSet(setNum, 'kg', e.target.value)}
                  className="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none"
                />
                <span className="text-[9px] font-mono text-zinc-400 ml-1">kg</span>
              </div>

              {/* Input Repetisi Aktual */}
              <div className="col-span-3 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
                <input
                  type="number"
                  placeholder={String(exercise.targetReps)}
                  value={item.reps !== undefined ? item.reps : ''}
                  onChange={(e) => onUpdateSet(setNum, 'reps', e.target.value)}
                  className="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none"
                />
              </div>

              {/* Done Check Button */}
              <div className="col-span-3 text-right">
                <button
                  onClick={() => handleToggleDone(setNum, item.done)}
                  className={`btn-spring w-full py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1 transition ${
                    item.done
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white border border-zinc-300 text-zinc-600 hover:border-red-600'
                  }`}
                >
                  {item.done ? '✓ Done' : 'Check'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
