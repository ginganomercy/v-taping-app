import React from 'react';
import { Dumbbell, Gauge, Shield, LayoutGrid } from 'lucide-react';

export type TabType = 'workout' | 'metrics' | 'hip' | 'library';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-red-100 px-3 pt-2 safe-bottom flex justify-around items-center z-50 shadow-lg">
      <button
        onClick={() => onSelectTab('workout')}
        className={`btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-bold transition ${
          activeTab === 'workout' ? 'text-red-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-700'
        }`}
      >
        <Dumbbell className="w-5 h-5 stroke-[2.5]" />
        <span className="text-[10px] tracking-tight">Workout</span>
      </button>

      <button
        onClick={() => onSelectTab('metrics')}
        className={`btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-bold transition ${
          activeTab === 'metrics' ? 'text-red-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-700'
        }`}
      >
        <Gauge className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] tracking-tight">V-Taper</span>
      </button>

      <button
        onClick={() => onSelectTab('hip')}
        className={`btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-bold transition ${
          activeTab === 'hip' ? 'text-red-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-700'
        }`}
      >
        <Shield className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] tracking-tight">Hip Shield</span>
      </button>

      <button
        onClick={() => onSelectTab('library')}
        className={`btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-bold transition ${
          activeTab === 'library' ? 'text-red-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-700'
        }`}
      >
        <LayoutGrid className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] tracking-tight">Katalog</span>
      </button>
    </nav>
  );
};
