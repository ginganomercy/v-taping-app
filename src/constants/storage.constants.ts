/**
 * Storage keys and database constants for dual-layer offline persistence.
 */

export const DB_NAME = 'vtaper_athlete_db';
export const DB_VERSION = 2;

export const DB_STORES = {
  SETTINGS: 'settings',
  DAY_LOGS: 'dayLogs',
  WEIGHTS: 'weights',
  CARDIO_LOGS: 'cardioLogs'
} as const;

export const STORAGE_KEYS = {
  PROFILE: 'vtaper_user_profile',
  WEIGHT_HISTORY: 'vtaper_weight_history',
  PROTEIN_LOG: 'vtaper_daily_protein',
  WATER_LOG: 'vtaper_daily_water',
  DAY_PREFIX: 'vtaper_day_',
  CARDIO_HISTORY: 'vtaper_cardio_history'
} as const;
