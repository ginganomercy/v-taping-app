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

export const DEFAULT_PROFILE: UserProfile = {
  name: "Athlete",
  heightCm: 170,
  startWeightKg: 79.0,
  currentWeightKg: 79.0,
  targetWeightKg: 66.0,
  dailyCalorieTarget: 1800,
  dailyProteinTarget: 145,
  baselinePullUps: 2,
  backpackPresetsKg: [3, 5, 8],
  martialArtsStyle: "Bela Diri Lincah",
  martialArtsFrequency: "2-3x per minggu",
  autoProgressPullUps: true
};
