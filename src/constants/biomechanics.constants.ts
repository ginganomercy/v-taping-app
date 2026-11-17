/**
 * Biomechanical constants for V-Taper calisthenics, caloric deficit, and touch gestures.
 * Adheres to Master Prompt Rule 1: All numeric thresholds must be named constants.
 */

/** Golden ratio for Shoulder-to-Waist Ratio (SWR) */
export const GOLDEN_RATIO_SWR = 1.618;

/** Daily caloric budget for progressive fat loss (kcal) */
export const TARGET_CALORIES_KCAL = 1800;

/** Daily protein requirement for muscle preservation at 79 kg baseline (grams) */
export const TARGET_PROTEIN_GRAMS = 145;

/** Daily target hydration volume (milliliters) */
export const TARGET_WATER_ML = 3000;

/** Standard eccentric negative tempo duration for pull-up development (seconds) */
export const NEGATIVE_PHASE_DURATION_SECONDS = 4;

/** Standard rest interval between hypertrophy sets (seconds) */
export const DEFAULT_REST_SECONDS = 60;

/** Minimum touch displacement (pixels) required to register horizontal swipe */
export const SWIPE_MIN_DISTANCE_PX = 45;

/** Minimum horizontal-to-vertical ratio to distinguish intentional horizontal swipe from scroll */
export const SWIPE_HORIZONTAL_RATIO = 1.25;

/** Default baseline user body metrics */
export const BASELINE_HEIGHT_CM = 170;
export const BASELINE_WEIGHT_KG = 79.0;
export const TARGET_WEIGHT_KG = 66.0;
export const BASELINE_PULLUPS = 2;
