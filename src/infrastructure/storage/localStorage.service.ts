/**
 * LocalStorage adapter providing synchronous zero-latency hydration and JSON export/import backup.
 */

import { UserProfile, DEFAULT_USER_PROFILE } from '../../types/profile.types';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { indexedDbService } from '../db/indexedDb.service';

export const localStorageService = {
  /**
   * Synchronously reads profile to eliminate FOUC (Flash of Unstyled Content).
   */
  getProfileSync(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('[Storage] Profile read failure:', e);
    }
    return DEFAULT_USER_PROFILE;
  },

  /**
   * Saves profile to localStorage and synchronizes with IndexedDB.
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      await indexedDbService.saveMetric('user_profile', profile);
    } catch (e) {
      console.error('[Storage] Save profile error:', e);
    }
  },

  /**
   * Exports complete user workout journey and logs as a portable JSON object.
   */
  async exportCompleteBackup(): Promise<string> {
    const profile = this.getProfileSync();
    const weights = await indexedDbService.getWeights();
    const cardioLogs = await indexedDbService.getCardioLogs();
    const dayLogs: Record<string, unknown> = {};

    for (let day = 0; day <= 6; day++) {
      dayLogs[`day_${day}`] = await indexedDbService.getDayData(day);
    }

    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      profile,
      weights,
      cardioLogs,
      dayLogs
    };

    return JSON.stringify(payload, null, 2);
  },

  async exportFullBackup(): Promise<string> {
    return this.exportCompleteBackup();
  },

  /**
   * Imports a verified JSON backup into storage and IndexedDB.
   */
  async restoreBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.profile) {
        throw new Error('Format cadangan JSON tidak valid');
      }

      await this.saveProfile(parsed.profile);

      if (parsed.weights && Array.isArray(parsed.weights)) {
        localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(parsed.weights));
      }

      if (parsed.cardioLogs && Array.isArray(parsed.cardioLogs)) {
        localStorage.setItem(STORAGE_KEYS.CARDIO_HISTORY, JSON.stringify(parsed.cardioLogs));
      }

      if (parsed.dayLogs) {
        for (let day = 0; day <= 6; day++) {
          const key = `day_${day}`;
          if (parsed.dayLogs[key]) {
            localStorage.setItem(`${STORAGE_KEYS.DAY_PREFIX}${day}`, JSON.stringify(parsed.dayLogs[key]));
          }
        }
      }

      return true;
    } catch (e) {
      console.error('[Storage] Restore failed:', e);
      return false;
    }
  },

  async importBackup(jsonString: string): Promise<boolean> {
    return this.restoreBackup(jsonString);
  }
};
