import React, { useState } from 'react';
import { Dumbbell, Trophy, Medal } from 'lucide-react';
import { DaySession, Exercise, SetRecord } from '../types/workout';
import { ExerciseCard } from './ExerciseCard';
import { sound } from '../services/sound';

interface WorkoutViewProps {
  session: DaySession;
  dayData: Record<string, Record<number, SetRecord>>;
  baselinePullUps: number;
  backpackPresets: number[];
  onUpdateSet: (exerciseId: string, setNum: number, field: keyof SetRecord, value: unknown) => void;
  onOpenModal: (ex: Exercise) => void;
  onOpenNegativeTimer: () => void;
  onPromptRestTimer: () => void;
  onOpenGpsTracker?: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  session,
  dayData,
  baselinePullUps,
  backpackPresets,
  onUpdateSet,
  onOpenModal,
  onOpenNegativeTimer,
  onPromptRestTimer,
  onOpenGpsTracker
}) => {
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Calculate Progress
  let totalSets = 0;
  let doneSets = 0;

  session.exercises.forEach((ex) => {
    totalSets += ex.sets;
    const exData = dayData[ex.id] || {};
    for (let s = 1; s <= ex.sets; s++) {
      if (exData[s]?.done) doneSets++;
    }
  });

  const completionPercent = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  const handleFinish = () => {
    sound.playCelebration();
    setShowFinishModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Session Hero Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/25 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
          <Dumbbell className="w-36 h-36" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white font-extrabold backdrop-blur-md border border-white/25">
              {session.focus}
            </span>
            <span className="text-xs font-mono font-black bg-black/25 px-2.5 py-0.5 rounded-full border border-white/20">
              {completionPercent}% SELESAI
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white mt-1">{session.title}</h2>
          <p className="text-xs text-red-100 font-medium mt-1 leading-relaxed">{session.desc}</p>

          <div className="w-full h-2 bg-black/25 rounded-full mt-4 p-0.5 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Alert tip if exists */}
      {session.alert && (
        <div className="p-3.5 rounded-2xl border text-xs font-medium leading-relaxed bg-red-50/80 border-red-200 text-red-950">
          {session.alert}
        </div>
      )}

      {/* Exercise Cards */}
      <div className="space-y-3.5">
        {session.exercises.map((ex) => {
          // Dynamic Pull-Up Reps Adjustment based on user's calibrated baseline
          const exerciseWithCalibration: Exercise = {
            ...ex,
            targetReps: ex.id === 'pull-up' ? baselinePullUps : ex.targetReps,
            repsLabel:
              ex.id === 'pull-up'
                ? `${baselinePullUps} Reps Bersih (Chin melewati bar)`
                : ex.repsLabel
          };

          return (
            <ExerciseCard
              key={ex.id}
              exercise={exerciseWithCalibration}
              setsData={dayData[ex.id] || {}}
              backpackPresets={backpackPresets}
              onUpdateSet={(setNum, field, val) => onUpdateSet(ex.id, setNum, field, val)}
              onOpenModal={() => onOpenModal(exerciseWithCalibration)}
              onOpenNegativeTimer={onOpenNegativeTimer}
              onPromptRestTimer={onPromptRestTimer}
              onOpenGpsTracker={ex.isCardio ? onOpenGpsTracker : undefined}
            />
          );
        })}
      </div>

      {/* Finish Workout Action */}
      <div className="pt-2">
        <button
          onClick={handleFinish}
          className="btn-spring w-full py-4 rounded-2xl bg-zinc-950 text-white font-black text-sm tracking-wide shadow-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <Trophy className="w-4 h-4 text-rose-400" />
          <span>SELESAIKAN LATIHAN HARI INI</span>
        </button>
      </div>

      {/* Celebration Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 relative shadow-2xl border border-red-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-md shadow-red-500/20">
              <Medal className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-950">Latihan Selesai!</h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Satu langkah lebih dekat ke bentuk V-Taper idaman Anda.
              </p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Set:</span>
                <strong className="text-zinc-900 font-bold">{totalSets} Set</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status Sayap/Bahu:</span>
                <strong className="text-red-600 font-bold">Terkonstruksi</strong>
              </div>
            </div>
            <button
              onClick={() => setShowFinishModal(false)}
              className="btn-spring w-full py-3.5 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/30"
            >
              Mantap, Tutup!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
