import React from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { DayIndex } from '@/types/workout.types';
import { WORKOUT_SCHEDULE, DAY_ORDER } from '@/data/workoutData';

interface DayCarouselProps {
  currentDay: DayIndex;
  onSelectDay: (day: DayIndex) => void;
}

export const DayCarousel: React.FC<DayCarouselProps> = ({ currentDay, onSelectDay }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-red-600" /> Jadwal Latihan
        </span>
        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <ArrowLeftRight className="w-3 h-3" /> Geser Layar
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 text-xs">
        {DAY_ORDER.map((dayIdx) => {
          const session = WORKOUT_SCHEDULE[dayIdx];
          const isSelected = currentDay === dayIdx;
          return (
            <button
              key={dayIdx}
              onClick={() => onSelectDay(dayIdx)}
              className={`btn-spring flex-shrink-0 px-3.5 py-2 rounded-2xl font-bold border transition flex flex-col items-center gap-0.5 min-w-[58px] ${
                isSelected
                  ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-600/25 scale-105'
                  : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-sm'
              }`}
            >
              <span className="text-[10px] opacity-75">{session.dayShort}</span>
              <span className="text-xs">{session.focus.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
