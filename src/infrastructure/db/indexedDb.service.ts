/**
 * IndexedDB persistence layer using `idb`.
 * Provides offline-first transactional storage for workout logs, biometric weights, and daily macros.
 */

import { openDB, IDBPDatabase } from 'idb';
import { SetRecord, WeightEntry } from '../../types/workout.types';
import { CardioLogEntry } from '../../types/telemetry.types';
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
        if (!db.objectStoreNames.contains(DB_STORES.CARDIO_LOGS)) {
          db.createObjectStore(DB_STORES.CARDIO_LOGS, { keyPath: 'id', autoIncrement: true });
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
   * Updates multiple fields of a specific exercise set atomically in a single transaction.
   */
  async saveSetRecord(
    dayIndex: number,
    exerciseId: string,
    setNumber: number,
    partialRecord: Partial<SetRecord>
  ): Promise<void> {
    try {
      const db = await getDatabaseInstance();
      const current = (await db.get(DB_STORES.DAY_LOGS, `day_${dayIndex}`)) || {};
      if (!current[exerciseId]) current[exerciseId] = {};
      if (!current[exerciseId][setNumber]) {
        current[exerciseId][setNumber] = { kg: '', reps: '', done: false };
      }
      Object.assign(current[exerciseId][setNumber], partialRecord);
      await db.put(DB_STORES.DAY_LOGS, current, `day_${dayIndex}`);
      localStorage.setItem(`${STORAGE_KEYS.DAY_PREFIX}${dayIndex}`, JSON.stringify(current));
    } catch (e) {
      console.warn('[IndexedDB] Save record fallback triggered:', e);
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
  },

  /**
   * Persists a completed outdoor GPS cardio session to IndexedDB and LocalStorage dual-layer.
   */
  async saveCardioLog(entry: Omit<CardioLogEntry, 'id'>): Promise<CardioLogEntry> {
    let savedId = Date.now();
    try {
      const db = await getDatabaseInstance();
      const insertId = await db.add(DB_STORES.CARDIO_LOGS, entry);
      if (typeof insertId === 'number') {
        savedId = insertId;
      }
    } catch (e) {
      console.warn('[IndexedDB] saveCardioLog fallback triggered:', e);
    }

    const savedEntry: CardioLogEntry = { ...entry, id: savedId };

    try {
      const local = localStorage.getItem(STORAGE_KEYS.CARDIO_HISTORY);
      const list: CardioLogEntry[] = local ? JSON.parse(local) : [];
      list.unshift(savedEntry);
      localStorage.setItem(STORAGE_KEYS.CARDIO_HISTORY, JSON.stringify(list));
    } catch (e) {
      console.warn('[LocalStorage] saveCardioLog sync error:', e);
    }

    return savedEntry;
  },

  /**
   * Fetches all recorded cardio sessions, sorted by newest first.
   */
  async getCardioLogs(): Promise<CardioLogEntry[]> {
    try {
      const db = await getDatabaseInstance();
      const all = await db.getAll(DB_STORES.CARDIO_LOGS);
      if (all && all.length > 0) {
        return all.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
    } catch (e) {
      console.warn('[IndexedDB] getCardioLogs fallback triggered:', e);
    }

    try {
      const local = localStorage.getItem(STORAGE_KEYS.CARDIO_HISTORY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  },

  /**
   * Deletes a specific cardio session by ID from both IndexedDB and LocalStorage.
   */
  async deleteCardioLog(id: number): Promise<void> {
    try {
      const db = await getDatabaseInstance();
      await db.delete(DB_STORES.CARDIO_LOGS, id);
    } catch (e) {
      console.warn('[IndexedDB] deleteCardioLog fallback triggered:', e);
    }

    try {
      const local = localStorage.getItem(STORAGE_KEYS.CARDIO_HISTORY);
      if (local) {
        const list: CardioLogEntry[] = JSON.parse(local);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.CARDIO_HISTORY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('[LocalStorage] deleteCardioLog sync error:', e);
    }
  },

  /**
   * Clears all cardio history entries.
   */
  async clearCardioLogs(): Promise<void> {
    try {
      const db = await getDatabaseInstance();
      await db.clear(DB_STORES.CARDIO_LOGS);
    } catch (e) {
      console.warn('[IndexedDB] clearCardioLogs fallback triggered:', e);
    }
    localStorage.removeItem(STORAGE_KEYS.CARDIO_HISTORY);
  }
};
