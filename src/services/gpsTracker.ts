import { sound } from './sound';

export interface GpsTelemetry {
  distanceKm: number;
  currentSpeedKmh: number;
  averageSpeedKmh: number;
  paceMinKm: string;
  durationSeconds: number;
  caloriesKcal: number;
  isZoneOptimal: boolean; // 5.0 - 6.2 km/h
  speedStatus: 'slow' | 'optimal' | 'fast';
  accuracyMeters: number;
}

export type TelemetryCallback = (data: GpsTelemetry) => void;

class GpsTrackerService {
  private watchId: number | null = null;
  private timerInterval: number | null = null;
  private wakeLock: unknown = null;

  private lastLat: number | null = null;
  private lastLng: number | null = null;
  private lastTimestamp: number | null = null;

  private totalDistanceMeters: number = 0;
  private elapsedSeconds: number = 0;
  private currentSpeedKmh: number = 0;
  private lastMilestoneKm: number = 0;
  private speedSamples: number[] = [];

  private subscriber: TelemetryCallback | null = null;
  public isTracking: boolean = false;

  // Haversine formula
  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  public async startTracking(userWeightKg = 79, onUpdate: TelemetryCallback): Promise<boolean> {
    if (!('geolocation' in navigator)) {
      alert('Perangkat Anda tidak mendukung fitur Geolocation GPS.');
      return false;
    }

    this.reset();
    this.subscriber = onUpdate;
    this.isTracking = true;

    // Request Screen Wake Lock so Oppo screen does not turn off
    if ('wakeLock' in navigator) {
      try {
        const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
        this.wakeLock = await nav.wakeLock.request('screen');
      } catch {
        // WakeLock optional
      }
    }

    // Start Stopwatch Timer
    this.timerInterval = window.setInterval(() => {
      this.elapsedSeconds++;
      this.emitUpdate(userWeightKg, 10);
    }, 1000);

    // Start GPS Watcher
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, accuracy } = pos.coords;
        const now = pos.timestamp;

        // Ignore inaccurate GPS jitter (> 30 meters accuracy threshold)
        if (accuracy > 30) {
          return;
        }

        if (this.lastLat !== null && this.lastLng !== null && this.lastTimestamp !== null) {
          const dt = (now - this.lastTimestamp) / 1000; // seconds
          if (dt >= 1) {
            const dist = this.calculateDistanceMeters(this.lastLat, this.lastLng, latitude, longitude);
            
            // Filter out GPS teleportation spikes (> 20 km/h is unrealistic for walking)
            const calcSpeedKmh = (dist / dt) * 3.6;
            if (calcSpeedKmh < 22 && dist > 1.0) {
              this.totalDistanceMeters += dist;

              // Check 1KM milestone alert
              const currentKmInt = Math.floor(this.totalDistanceMeters / 1000);
              if (currentKmInt > this.lastMilestoneKm) {
                this.lastMilestoneKm = currentKmInt;
                sound.playMilestone1KmAlert();
              }
            }
          }
        }

        // Current speed calculation
        let reportedSpeedKmh = speed !== null && speed >= 0 ? speed * 3.6 : 0;
        if (reportedSpeedKmh < 0.5) reportedSpeedKmh = 0;

        this.currentSpeedKmh = reportedSpeedKmh;
        this.speedSamples.push(reportedSpeedKmh);
        if (this.speedSamples.length > 10) this.speedSamples.shift();

        this.lastLat = latitude;
        this.lastLng = longitude;
        this.lastTimestamp = now;

        this.emitUpdate(userWeightKg, accuracy);
      },
      (err) => {
        console.warn('GPS position error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    return true;
  }

  private emitUpdate(userWeightKg: number, accuracy: number) {
    if (!this.subscriber) return;

    const distanceKm = parseFloat((this.totalDistanceMeters / 1000).toFixed(2));
    const avgSpeed = this.elapsedSeconds > 0 ? (distanceKm / (this.elapsedSeconds / 3600)) : 0;

    // Pace calculation (min/km)
    let paceMinKm = "--'--\"";
    const effectiveSpeed = this.currentSpeedKmh > 1.5 ? this.currentSpeedKmh : avgSpeed;
    if (effectiveSpeed > 1.0) {
      const paceDecimal = 60 / effectiveSpeed;
      const paceMinutes = Math.floor(paceDecimal);
      const paceSeconds = Math.round((paceDecimal - paceMinutes) * 60);
      paceMinKm = `${paceMinutes}'${paceSeconds < 10 ? '0' : ''}${paceSeconds}"`;
    }

    // Calories MET (4.3 MET for brisk walking)
    const hours = this.elapsedSeconds / 3600;
    const caloriesKcal = Math.round(4.3 * userWeightKg * hours);

    // Speed status (Target: 5.0 - 6.2 km/h)
    let speedStatus: 'slow' | 'optimal' | 'fast' = 'optimal';
    if (this.currentSpeedKmh < 4.8) speedStatus = 'slow';
    else if (this.currentSpeedKmh > 6.8) speedStatus = 'fast';

    const isZoneOptimal = this.currentSpeedKmh >= 5.0 && this.currentSpeedKmh <= 6.5;

    this.subscriber({
      distanceKm,
      currentSpeedKmh: parseFloat(this.currentSpeedKmh.toFixed(1)),
      averageSpeedKmh: parseFloat(avgSpeed.toFixed(1)),
      paceMinKm,
      durationSeconds: this.elapsedSeconds,
      caloriesKcal,
      isZoneOptimal,
      speedStatus,
      accuracyMeters: Math.round(accuracy)
    });
  }

  public stopTracking(): { distanceKm: number; durationMin: number; caloriesKcal: number } {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const distanceKm = parseFloat((this.totalDistanceMeters / 1000).toFixed(2));
    const durationMin = Math.max(1, Math.round(this.elapsedSeconds / 60));
    const caloriesKcal = Math.round(4.3 * 79 * (this.elapsedSeconds / 3600));

    this.isTracking = false;
    this.subscriber = null;

    return { distanceKm, durationMin, caloriesKcal };
  }

  public reset() {
    this.totalDistanceMeters = 0;
    this.elapsedSeconds = 0;
    this.currentSpeedKmh = 0;
    this.lastMilestoneKm = 0;
    this.speedSamples = [];
    this.lastLat = null;
    this.lastLng = null;
    this.lastTimestamp = null;
  }
}

export const gpsTracker = new GpsTrackerService();
