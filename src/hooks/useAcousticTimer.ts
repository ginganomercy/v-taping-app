/**
 * Application hook for managing acoustic rest and negative pull-up tempo timers.
 */

import { useState, useCallback } from 'react';
import {
  DEFAULT_REST_SECONDS,
  NEGATIVE_PHASE_DURATION_SECONDS
} from '../constants/biomechanics.constants';

export type TimerType = 'rest' | 'negative';

export function useAcousticTimer() {
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>('rest');
  const [timerDuration, setTimerDuration] = useState<number>(DEFAULT_REST_SECONDS);

  const openRestTimer = useCallback((seconds: number = DEFAULT_REST_SECONDS) => {
    setTimerType('rest');
    setTimerDuration(seconds);
    setIsTimerOpen(true);
  }, []);

  const openNegativeTimer = useCallback(() => {
    setTimerType('negative');
    setTimerDuration(NEGATIVE_PHASE_DURATION_SECONDS);
    setIsTimerOpen(true);
  }, []);

  const closeTimer = useCallback(() => {
    setIsTimerOpen(false);
  }, []);

  return {
    isTimerOpen,
    timerType,
    timerDuration,
    openRestTimer,
    openNegativeTimer,
    closeTimer
  };
}
