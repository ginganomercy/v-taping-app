/**
 * Domain types for User Profile, Biometrics, and Custom Presets.
 */

import {
  BASELINE_HEIGHT_CM,
  BASELINE_WEIGHT_KG,
  TARGET_WEIGHT_KG,
  BASELINE_PULLUPS,
  TARGET_CALORIES_KCAL,
  TARGET_PROTEIN_GRAMS
} from '../constants/biomechanics.constants';

export interface UserProfile {
  name: string;
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  baselinePullUps: number;
  backpackPresetsKg: number[];
  martialArtsStyle: string;
  martialArtsFrequency: string;
  autoProgressPullUps: boolean;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'V-Taper Athlete',
  heightCm: BASELINE_HEIGHT_CM,
  startWeightKg: BASELINE_WEIGHT_KG,
  currentWeightKg: BASELINE_WEIGHT_KG,
  targetWeightKg: TARGET_WEIGHT_KG,
  dailyCalorieTarget: TARGET_CALORIES_KCAL,
  dailyProteinTarget: TARGET_PROTEIN_GRAMS,
  baselinePullUps: BASELINE_PULLUPS,
  backpackPresetsKg: [3, 5, 8],
  martialArtsStyle: 'Bela Diri Lincah',
  martialArtsFrequency: '2-3x per minggu',
  autoProgressPullUps: true
};
