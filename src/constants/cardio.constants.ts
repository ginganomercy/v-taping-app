/**
 * Non-negotiable domain constants for Cardio & Live GPS Tracking.
 * Adheres to Master Prompt Rule 1: All numeric thresholds must be named constants.
 */

/** Minimum speed threshold for Zone 2 fat oxidation brisk walking (km/h) */
export const ZONE2_MIN_SPEED_KMH = 5.0;

/** Maximum speed threshold for Zone 2 fat oxidation brisk walking (km/h) */
export const ZONE2_MAX_SPEED_KMH = 6.2;

/** GPS accuracy threshold: positions with accuracy worse than 30m are dropped */
export const GPS_ACCURACY_THRESHOLD_METERS = 30;

/** Maximum realistic speed filter (km/h) to eliminate GPS teleportation anomalies */
export const MAX_SPEED_JITTER_FILTER_KMH = 22.0;

/** Interval in meters to trigger acoustic celebration chime */
export const MILESTONE_INTERVAL_METERS = 1000;

/** Metabolic Equivalent of Task (MET) for 5.5-6.0 km/h brisk walking */
export const MET_BRISK_WALKING = 4.3;

/** Phase 1 default duration in minutes (Wednesday/Saturday base) */
export const DEFAULT_CARDIO_MINUTES = 45;
