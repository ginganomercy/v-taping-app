/**
 * Non-negotiable domain constants for Cardio & Live GPS Tracking.
 * Adheres to Master Prompt Rule 1: All numeric thresholds must be named constants.
 */

export type CardioPhase = 1 | 2 | 3;

export interface CardioPhaseConfig {
  phase: CardioPhase;
  name: string;
  badge: string;
  repsMinutes: number;
  targetDistanceKm: number;
  minSpeedKmh: number;
  maxSpeedKmh: number;
  targetPaceStr: string;
  desc: string;
  instructions: string;
  optimalBadgeText: string;
}

/** Phase 1: Zone 2 Brisk Walking (Current 79 kg baseline) */
export const PHASE1_MIN_SPEED_KMH = 5.0;
export const PHASE1_MAX_SPEED_KMH = 6.2;
export const PHASE1_DEFAULT_MINUTES = 45;
export const PHASE1_TARGET_KM = 4.0;

/** Phase 2: Walk / Jog Intervals (~75 kg intermediate) */
export const PHASE2_MIN_SPEED_KMH = 5.5;
export const PHASE2_MAX_SPEED_KMH = 8.0;
export const PHASE2_DEFAULT_MINUTES = 30;
export const PHASE2_TARGET_KM = 3.5;

/** Phase 3: Continuous 5K Run (<70 kg advanced) */
export const PHASE3_MIN_SPEED_KMH = 8.0;
export const PHASE3_MAX_SPEED_KMH = 11.0;
export const PHASE3_DEFAULT_MINUTES = 28;
export const PHASE3_TARGET_KM = 5.0;

export const CARDIO_PHASES: Record<CardioPhase, CardioPhaseConfig> = {
  1: {
    phase: 1,
    name: 'Fase 1: Jalan Cepat (Zone 2 Base)',
    badge: '45m Jalan',
    repsMinutes: PHASE1_DEFAULT_MINUTES,
    targetDistanceKm: PHASE1_TARGET_KM,
    minSpeedKmh: PHASE1_MIN_SPEED_KMH,
    maxSpeedKmh: PHASE1_MAX_SPEED_KMH,
    targetPaceStr: "10'00\" - 12'00\"/km",
    desc: 'Langkah cepat berirama, 0% benturan pinggul, fokus oksidasi asam lemak.',
    instructions: 'Pertahankan 5.0 - 6.2 km/j. Sangat protektif untuk tendon pinggul dan otot sayap.',
    optimalBadgeText: 'ZONA 2 OPTIMAL (5.0 - 6.2 km/j)'
  },
  2: {
    phase: 2,
    name: 'Fase 2: Walk / Jog Interval',
    badge: 'Walk / Jog',
    repsMinutes: PHASE2_DEFAULT_MINUTES,
    targetDistanceKm: PHASE2_TARGET_KM,
    minSpeedKmh: PHASE2_MIN_SPEED_KMH,
    maxSpeedKmh: PHASE2_MAX_SPEED_KMH,
    targetPaceStr: "7'30\" - 10'00\"/km",
    desc: 'Interval rasio 2 menit jalan cepat : 1 menit jogging santai.',
    instructions: 'Selang-seling jalan dan jog santai. Jika pinggul luar terasa pegal, kembali ke jalan cepat.',
    optimalBadgeText: 'INTERVAL ZONE (5.5 - 8.0 km/j)'
  },
  3: {
    phase: 3,
    name: 'Fase 3: 5K Continuous Run',
    badge: '5K Run',
    repsMinutes: PHASE3_DEFAULT_MINUTES,
    targetDistanceKm: PHASE3_TARGET_KM,
    minSpeedKmh: PHASE3_MIN_SPEED_KMH,
    maxSpeedKmh: PHASE3_MAX_SPEED_KMH,
    targetPaceStr: "5'30\" - 7'00\"/km",
    desc: 'Lari stabil 5 Kilometer setelah bobot mendekati < 70 kg.',
    instructions: 'Lari kontinu ritmis tanpa henti. Hanya dieksekusi saat pinggul sudah 100% bebas nyeri.',
    optimalBadgeText: 'RUN PACE TARGET (8.0 - 11.0 km/j)'
  }
};

/** Minimum speed threshold for Zone 2 fat oxidation brisk walking (km/h) */
export const ZONE2_MIN_SPEED_KMH = PHASE1_MIN_SPEED_KMH;

/** Maximum speed threshold for Zone 2 fat oxidation brisk walking (km/h) */
export const ZONE2_MAX_SPEED_KMH = PHASE1_MAX_SPEED_KMH;

/** GPS accuracy threshold: positions with accuracy worse than 30m are dropped */
export const GPS_ACCURACY_THRESHOLD_METERS = 30;

/** Maximum realistic speed filter (km/h) to eliminate GPS teleportation anomalies */
export const MAX_SPEED_JITTER_FILTER_KMH = 22.0;

/** Interval in meters to trigger acoustic celebration chime */
export const MILESTONE_INTERVAL_METERS = 1000;

/** Metabolic Equivalent of Task (MET) for brisk walking */
export const MET_BRISK_WALKING = 4.3;

/** Phase 1 default duration in minutes */
export const DEFAULT_CARDIO_MINUTES = PHASE1_DEFAULT_MINUTES;
