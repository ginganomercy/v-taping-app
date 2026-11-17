import { UserProfile, DEFAULT_PROFILE } from '../types/profile';
import { dbService } from './db';

const STORAGE_KEYS = {
  PROFILE: 'vtaper_user_profile',
  SHOULDER: 'vtaper_shoulder_cm',
  WAIST: 'vtaper_waist_cm',
  WATER: 'vtaper_water_today',
  PROTEIN: 'vtaper_protein_today',
  PAIN_LEVEL: 'vtaper_pain_level',
};

export const storage = {
  // Synchronous LocalStorage Profile (Instant Hydration)
  getProfileSync(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('LocalStorage profile read fallback:', e);
    }
    return DEFAULT_PROFILE;
  },

  // Save to both LocalStorage and IndexedDB
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      await dbService.setMetric('user_profile', profile);
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  },

  // Export full JSON backup
  async exportFullBackup(): Promise<string> {
    const profile = this.getProfileSync();
    const weights = await dbService.getWeights();
    
    // Gather 7 days of logs
    const dayLogs: Record<number, unknown> = {};
    for (let d = 0; d <= 6; d++) {
      dayLogs[d] = await dbService.getDayData(d);
    }

    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      weights,
      dayLogs,
      metrics: {
        shoulder: await dbService.getMetric('shoulder_cm', 112),
        waist: await dbService.getMetric('waist_cm', 88),
        painLevel: await dbService.getMetric('pain_level', 4),
      }
    };

    return JSON.stringify(backupData, null, 2);
  },

  // Import JSON backup
  async importBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) {
        await this.saveProfile(data.profile);
      }
      if (Array.isArray(data.weights)) {
        localStorage.setItem('vtaper_weight_history', JSON.stringify(data.weights));
      }
      if (data.dayLogs) {
        for (const [day, log] of Object.entries(data.dayLogs)) {
          localStorage.setItem(`vtaper_day_${day}`, JSON.stringify(log));
        }
      }
      return true;
    } catch (e) {
      console.error('Import backup failed:', e);
      return false;
    }
  }
};
