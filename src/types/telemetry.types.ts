/**
 * Domain types for Live GPS Speedometer, Telemetry, and Hybrid Cardio metrics.
 */

import { CardioPhase } from '../constants/cardio.constants';

export interface GpsTelemetry {
  distanceKm: number;
  currentSpeedKmh: number;
  averageSpeedKmh: number;
  paceMinKm: string;
  durationSeconds: number;
  caloriesKcal: number;
  isZoneOptimal: boolean;
  speedStatus: 'slow' | 'optimal' | 'fast';
  accuracyMeters: number;
}

export type TelemetryCallback = (data: GpsTelemetry) => void;

export interface GpsTrackingResult {
  distanceKm: number;
  durationMin: number;
  durationSeconds: number;
  averageSpeedKmh: number;
  caloriesKcal: number;
  paceMinKm: string;
}

export interface CardioLogEntry {
  id?: number;
  timestamp: number;
  dateFormatted: string;
  phase: CardioPhase;
  phaseName: string;
  distanceKm: number;
  durationSeconds: number;
  durationMin: number;
  averageSpeedKmh: number;
  paceMinKm: string;
  caloriesKcal: number;
}
