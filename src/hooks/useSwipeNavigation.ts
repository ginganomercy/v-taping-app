/**
 * Application hook for touch screen horizontal swiping to switch between workout days.
 */

import { useRef, useCallback } from 'react';
import { DayIndex } from '../types/workout.types';
import { soundSynthService } from '../infrastructure/audio/soundSynth.service';
import { SWIPE_MIN_DISTANCE_PX, SWIPE_HORIZONTAL_RATIO } from '../constants/biomechanics.constants';

export const DAY_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];

export function useSwipeNavigation(
  currentDay: DayIndex,
  onDayChange: (nextDay: DayIndex) => void,
  enabled: boolean = true
) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) {
        return;
      }
      touchStartX.current = e.changedTouches[0].screenX;
      touchStartY.current = e.changedTouches[0].screenY;
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) {
        return;
      }

      const deltaX = e.changedTouches[0].screenX - touchStartX.current;
      const deltaY = e.changedTouches[0].screenY - touchStartY.current;

      if (
        Math.abs(deltaX) > SWIPE_MIN_DISTANCE_PX &&
        Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_HORIZONTAL_RATIO
      ) {
        const curIdx = DAY_ORDER.indexOf(currentDay);
        if (deltaX < 0) {
          // Swipe Left -> Next Day
          const nextIdx = (curIdx + 1) % DAY_ORDER.length;
          onDayChange(DAY_ORDER[nextIdx]);
          soundSynthService.playBeep(480, 'sine', 0.08);
        } else {
          // Swipe Right -> Prev Day
          const prevIdx = (curIdx - 1 + DAY_ORDER.length) % DAY_ORDER.length;
          onDayChange(DAY_ORDER[prevIdx]);
          soundSynthService.playBeep(420, 'sine', 0.08);
        }
      }
    },
    [enabled, currentDay, onDayChange]
  );

  return {
    handleTouchStart,
    handleTouchEnd
  };
}
