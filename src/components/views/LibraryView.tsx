import React from 'react';
import { Exercise } from '@/types/workout.types';
import { WORKOUT_SCHEDULE } from '@/data/workoutData';

interface LibraryViewProps {
  onOpenModal: (ex: Exercise) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onOpenModal }) => {
  // Extract all unique exercises
  const allExercises: Exercise[] = [];
  const seen = new Set<string>();

  Object.values(WORKOUT_SCHEDULE).forEach((day) => {
    day.exercises.forEach((ex) => {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        allExercises.push(ex);
      }
    });
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1 px-1">
        <h2 className="text-sm font-extrabold text-zinc-950">Katalog 15 Gerakan Rumah</h2>
        <span className="text-[10px] text-red-600 font-mono font-bold">100% Home Protocol</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {allExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => onOpenModal(ex)}
            className="btn-spring p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-600 transition"
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-50 mb-2 border border-zinc-100">
              <img
                src={ex.image}
                alt={ex.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pull-up.png';
                }}
              />
            </div>
            <div>
              <span className="text-[8px] font-mono uppercase text-red-600 font-black block truncate">
                {ex.muscle}
              </span>
              <h4 className="text-xs font-black text-zinc-950 truncate">{ex.title}</h4>
              <p className="text-[10px] text-zinc-400 font-medium truncate mt-0.5">{ex.repsLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
