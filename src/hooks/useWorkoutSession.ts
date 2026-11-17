/**
 * Application hook for managing workout session state and IndexedDB persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { DayIndex, SetRecord } from '../types/workout.types';
import { indexedDbService } from '../infrastructure/db/indexedDb.service';

export function useWorkoutSession(initialDay?: DayIndex) {
  const [currentDay, setCurrentDay] = useState<DayIndex>(() => {
    if (initialDay !== undefined) return initialDay;
    const today = new Date().getDay() as DayIndex;
    return today >= 0 && today <= 6 ? today : 1;
  });

  const [dayData, setDayData] = useState<Record<string, Record<number, SetRecord>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load day logs whenever active day changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    indexedDbService.getDayData(currentDay).then((data) => {
      if (isMounted) {
        setDayData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentDay]);

  const handleUpdateSet = useCallback(
    async (
      exerciseId: string,
      setNum: number,
      field: keyof SetRecord,
      value: unknown
    ): Promise<void> => {
      // Optimistic update for instant UI feedback
      setDayData((prev) => {
        const copy = { ...prev };
        if (!copy[exerciseId]) copy[exerciseId] = {};
        copy[exerciseId] = {
          ...copy[exerciseId],
          [setNum]: {
            ...(copy[exerciseId][setNum] || { kg: '', reps: '', done: false }),
            [field]: value
          }
        };
        return copy;
      });

      await indexedDbService.saveSetField(currentDay, exerciseId, setNum, field, value);
    },
    [currentDay]
  );

  const handleUpdateSetRecord = useCallback(
    async (
      exerciseId: string,
      setNum: number,
      partialRecord: Partial<SetRecord>
    ): Promise<void> => {
      // Optimistic batch update for instant UI feedback
      setDayData((prev) => {
        const copy = { ...prev };
        if (!copy[exerciseId]) copy[exerciseId] = {};
        copy[exerciseId] = {
          ...copy[exerciseId],
          [setNum]: {
            ...(copy[exerciseId][setNum] || { kg: '', reps: '', done: false }),
            ...partialRecord
          }
        };
        return copy;
      });

      await indexedDbService.saveSetRecord(currentDay, exerciseId, setNum, partialRecord);
    },
    [currentDay]
  );

  return {
    currentDay,
    setCurrentDay,
    dayData,
    setDayData,
    isLoading,
    handleUpdateSet,
    handleUpdateSetRecord
  };
}
