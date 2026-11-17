import React from 'react';
import { ZoomIn, Timer, Activity, Navigation } from 'lucide-react';
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
  onOpenGpsTracker?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  setsData,
  backpackPresets,
  onUpdateSet,
  onOpenModal,
  onOpenNegativeTimer,
  onPromptRestTimer,
  onOpenGpsTracker
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
  const isCardioExercise = exercise.isCardio || exercise.pattern.toLowerCase().includes('aerobic');

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

      {/* Hybrid Cardio Mode Presets & Live GPS Button */}
      {isCardioExercise && (
        <div className="space-y-2.5 pt-1">
          {/* Live GPS Launcher Button */}
          {onOpenGpsTracker && (
            <button
              type="button"
              onClick={onOpenGpsTracker}
              className="btn-spring w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>MULAI LACAK GPS LIVE (SPEED & JARAK)</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-red-600" />
            <span>PILIH FASE HYBRID RUNNER:</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono font-bold">
            <button
              type="button"
              onClick={() => {
                onUpdateSet(1, 'reps', 45);
                onUpdateSet(1, 'kg', 0);
                sound.playBeep(580, 'sine', 0.08);
              }}
              className="btn-spring p-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-center hover:bg-red-100"
            >
              <span className="block text-[8px] opacity-75">FASE 1</span>
              <span>45m Jalan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateSet(1, 'reps', 30);
                onUpdateSet(1, 'kg', 3.5);
                sound.playBeep(580, 'sine', 0.08);
              }}
              className="btn-spring p-1.5 rounded-xl bg-zinc-50 text-zinc-700 border border-zinc-200 text-center hover:bg-red-50 hover:text-red-700"
            >
              <span className="block text-[8px] opacity-75">FASE 2</span>
              <span>Walk / Jog</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateSet(1, 'reps', 28);
                onUpdateSet(1, 'kg', 5.0);
                sound.playBeep(580, 'sine', 0.08);
              }}
              className="btn-spring p-1.5 rounded-xl bg-zinc-50 text-zinc-700 border border-zinc-200 text-center hover:bg-red-50 hover:text-red-700"
            >
              <span className="block text-[8px] opacity-75">FASE 3</span>
              <span>5K Run</span>
            </button>
          </div>
        </div>
      )}

      {/* Per-Set Rows Table */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-100">
        <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-zinc-400 px-1 mb-1">
          <span className="col-span-2 text-center">{isCardioExercise ? 'SESI' : 'SET'}</span>
          <span className="col-span-4">{isCardioExercise ? 'JARAK (KM)' : 'BEBAN TAS'}</span>
          <span className="col-span-3">{isCardioExercise ? 'MENIT' : 'REPS'}</span>
          <span className="col-span-3 text-right">STATUS</span>
        </div>

        {Array.from({ length: exercise.sets }, (_, i) => i + 1).map((setNum) => {
          const item = setsData[setNum] || {
            kg: isCardioExercise ? 0 : (exercise.defaultKg || ''),
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

              {/* Input Beban Tas / Jarak KM */}
              <div className="col-span-4 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  placeholder={isCardioExercise ? "0.0" : String(exercise.defaultKg || 0)}
                  value={
                    isCardioExercise
                      ? (item.distanceKm !== undefined && item.distanceKm !== '' ? item.distanceKm : (item.kg ?? ''))
                      : (item.kg ?? '')
                  }
                  onChange={(e) => {
                    if (isCardioExercise) {
                      onUpdateSet(setNum, 'distanceKm', e.target.value);
                      onUpdateSet(setNum, 'kg', e.target.value);
                    } else {
                      onUpdateSet(setNum, 'kg', e.target.value);
                    }
                  }}
                  className="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none"
                />
                <span className="text-[9px] font-mono text-zinc-400 ml-1">
                  {isCardioExercise ? 'km' : 'kg'}
                </span>
              </div>

              {/* Input Repetisi / Menit Durasi */}
              <div className="col-span-3 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
                <input
                  type="number"
                  placeholder={String(exercise.targetReps)}
                  value={item.reps !== undefined ? item.reps : ''}
                  onChange={(e) => onUpdateSet(setNum, 'reps', e.target.value)}
                  className="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none"
                />
                {isCardioExercise && <span className="text-[9px] font-mono text-zinc-400 ml-0.5">m</span>}
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
