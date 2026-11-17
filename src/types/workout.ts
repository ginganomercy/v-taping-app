export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Minggu, 1 = Senin, dst.

export interface Exercise {
  id: string;
  title: string;
  muscle: string;
  equip: string;
  pattern: string;
  tempo: string;
  sets: number;
  targetReps: number;
  defaultKg: number;
  repsLabel: string;
  image: string;
  hasNegativeTimer?: boolean;
  tip: string;
}

export interface DaySession {
  dayIndex: DayIndex;
  dayShort: string;
  dayName: string;
  title: string;
  focus: string;
  desc: string;
  alert?: string;
  exercises: Exercise[];
}

export interface SetRecord {
  kg: number | string;
  reps: number | string;
  done: boolean;
}

export interface WeightEntry {
  date: string;
  weight: number;
}
