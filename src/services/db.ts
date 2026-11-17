import { openDB, IDBPDatabase } from 'idb';
import { SetRecord, WeightEntry } from '../types/workout';

const DB_NAME = 'vtaper_athlete_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('dayLogs')) {
          db.createObjectStore('dayLogs');
        }
        if (!db.objectStoreNames.contains('weights')) {
          db.createObjectStore('weights', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

export const dbService = {
  // Day Set Records: { [exerciseId]: { [setNumber]: SetRecord } }
  async getDayData(dayIndex: number): Promise<Record<string, Record<number, SetRecord>>> {
    try {
      const db = await getDB();
      const data = await db.get('dayLogs', `day_${dayIndex}`);
      return data || {};
    } catch {
      const local = localStorage.getItem(`vtaper_day_${dayIndex}`);
      return local ? JSON.parse(local) : {};
    }
  },

  async saveSetField(
    dayIndex: number,
    exerciseId: string,
    setNumber: number,
    field: keyof SetRecord,
    value: unknown
  ) {
    try {
      const db = await getDB();
      const current = (await db.get('dayLogs', `day_${dayIndex}`)) || {};
      if (!current[exerciseId]) current[exerciseId] = {};
      if (!current[exerciseId][setNumber]) {
        current[exerciseId][setNumber] = { kg: '', reps: '', done: false };
      }
      current[exerciseId][setNumber][field] = value;
      await db.put('dayLogs', current, `day_${dayIndex}`);
      localStorage.setItem(`vtaper_day_${dayIndex}`, JSON.stringify(current));
    } catch (e) {
      console.warn('DB Save fallback:', e);
    }
  },

  // Weight History
  async getWeights(): Promise<WeightEntry[]> {
    try {
      const db = await getDB();
      const all = await db.getAll('weights');
      if (all && all.length > 0) {
        return all.reverse();
      }
    } catch {
      // fallback
    }
    const local = localStorage.getItem('vtaper_weight_history');
    return local ? JSON.parse(local) : [{ date: 'Start Baseline', weight: 79.0 }];
  },

  async saveWeight(weight: number) {
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const entry = { date: dateStr, weight };
    try {
      const db = await getDB();
      await db.add('weights', entry);
    } catch {
      // fallback
    }
    const current = await this.getWeights();
    current.unshift(entry);
    localStorage.setItem('vtaper_weight_history', JSON.stringify(current));
  },

  // Daily Nutrition & Metrics
  async getMetric<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await getDB();
      const val = await db.get('settings', key);
      return val !== undefined ? val : defaultValue;
    } catch {
      const val = localStorage.getItem(`vtaper_${key}`);
      return val !== null ? JSON.parse(val) : defaultValue;
    }
  },

  async setMetric(key: string, value: unknown) {
    try {
      const db = await getDB();
      await db.put('settings', value, key);
      localStorage.setItem(`vtaper_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Set metric error:', e);
    }
  }
};
