/**
 * IndexedDB persistence layer using `idb`.
 * Provides offline-first transactional storage for workout logs, biometric weights, and daily macros.
 */

import { openDB, IDBPDatabase } from 'idb';
import { SetRecord, WeightEntry } from '../../types/workout.types';
import { DB_NAME, DB_VERSION, DB_STORES, STORAGE_KEYS } from '../../constants/storage.constants';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDatabaseInstance(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DB_STORES.SETTINGS)) {
          db.createObjectStore(DB_STORES.SETTINGS);
        }
        if (!db.objectStoreNames.contains(DB_STORES.DAY_LOGS)) {
          db.createObjectStore(DB_STORES.DAY_LOGS);
        }
        if (!db.objectStoreNames.contains(DB_STORES.WEIGHTS)) {
          db.createObjectStore(DB_STORES.WEIGHTS, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

export const indexedDbService = {
  /**
   * Retrieves logged sets for a specific day index (0-6).
   */
  async getDayData(dayIndex: number): Promise<Record<string, Record<number, SetRecord>>> {
    try {
      const db = await getDatabaseInstance();
      const data = await db.get(DB_STORES.DAY_LOGS, `day_${dayIndex}`);
      return data || {};
    } catch {
      const local = localStorage.getItem(`${STORAGE_KEYS.DAY_PREFIX}${dayIndex}`);
      return local ? JSON.parse(local) : {};
    }
  },

  /**
   * Updates an individual field of a specific exercise set and synchronizes to localStorage.
   */
  async saveSetField(
    dayIndex: number,
    exerciseId: string,
    setNumber: number,
    field: keyof SetRecord,
    value: unknown
  ): Promise<void> {
    try {
      const db = await getDatabaseInstance();
      const current = (await db.get(DB_STORES.DAY_LOGS, `day_${dayIndex}`)) || {};
      if (!current[exerciseId]) current[exerciseId] = {};
      if (!current[exerciseId][setNumber]) {
        current[exerciseId][setNumber] = { kg: '', reps: '', done: false };
      }
      current[exerciseId][setNumber][field] = value;
      await db.put(DB_STORES.DAY_LOGS, current, `day_${dayIndex}`);
      localStorage.setItem(`${STORAGE_KEYS.DAY_PREFIX}${dayIndex}`, JSON.stringify(current));
    } catch (e) {
      console.warn('[IndexedDB] Save fallback triggered:', e);
    }
  },

  /**
   * Fetches weight progression entries.
   */
  async getWeights(): Promise<WeightEntry[]> {
    try {
      const db = await getDatabaseInstance();
      const all = await db.getAll(DB_STORES.WEIGHTS);
      if (all && all.length > 0) {
        return all.reverse();
      }
    } catch {
      // Fallback to localStorage
    }
    const local = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
    return local ? JSON.parse(local) : [{ date: 'Start Baseline', weight: 79.0 }];
  },

  /**
   * Records a new body weight measurement.
   */
  async saveWeight(weight: number): Promise<void> {
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const entry = { date: dateStr, weight };
    try {
      const db = await getDatabaseInstance();
      await db.add(DB_STORES.WEIGHTS, entry);
    } catch {
      // Fallback to localStorage
    }
    const current = await this.getWeights();
    current.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(current));
  },

  /**
   * Generic key-value metric getter.
   */
  async getMetric<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await getDatabaseInstance();
      const val = await db.get(DB_STORES.SETTINGS, key);
      return val !== undefined ? val : defaultValue;
    } catch {
      const val = localStorage.getItem(`vtaper_${key}`);
      return val !== null ? JSON.parse(val) : defaultValue;
    }
  },

  /**
   * Generic key-value metric setter.
   */
  async saveMetric<T>(key: string, value: T): Promise<void> {
    try {
      const db = await getDatabaseInstance();
      await db.put(DB_STORES.SETTINGS, value, key);
    } catch {
      // Fallback
    }
    localStorage.setItem(`vtaper_${key}`, JSON.stringify(value));
  },

  async setMetric<T>(key: string, value: T): Promise<void> {
    return this.saveMetric(key, value);
  }
};
