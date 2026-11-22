/**
 * Live GPS tracking engine using Geolocation API with Haversine distance,
 * jitter filtering, Zone 2 speed cruise control, and automated 1KM audio milestones.
 */

import { soundSynthService } from '../audio/soundSynth.service';
import { wakeLockService } from './wakeLock.service';
import { GpsTelemetry, TelemetryCallback, GpsTrackingResult } from '../../types/telemetry.types';
import {
  ZONE2_MIN_SPEED_KMH,
  ZONE2_MAX_SPEED_KMH,
  GPS_ACCURACY_THRESHOLD_METERS,
  MAX_SPEED_JITTER_FILTER_KMH,
  MILESTONE_INTERVAL_METERS,
  MET_BRISK_WALKING
} from '../../constants/cardio.constants';

class GpsTrackerService {
  private watchId: number | null = null;
  private timerInterval: number | null = null;
  private userWeightKg: number = 79;

  private lastLat: number | null = null;
  private lastLng: number | null = null;
  private lastTimestamp: number | null = null;

  private totalDistanceMeters: number = 0;
  private elapsedSeconds: number = 0;
  private currentSpeedKmh: number = 0;
  private lastMilestoneKm: number = 0;
  private speedSamples: number[] = [];
  private lastAccuracyMeters: number = 0;

  private subscriber: TelemetryCallback | null = null;
  public isTracking: boolean = false;

  /**
   * Calculates geodesic distance between two coordinates in meters via Haversine formula.
   */
  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const EARTH_RADIUS_METERS = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
  }

  public async startTracking(userWeightKg = 79, onUpdate: TelemetryCallback): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      alert('Perangkat Anda tidak mendukung sensor Geolocation GPS.');
      return false;
    }

    this.reset();
    this.userWeightKg = userWeightKg;
    this.subscriber = onUpdate;
    this.isTracking = true;

    // Acquire Screen WakeLock
    await wakeLockService.requestLock();

    // Start Stopwatch Timer (1 second interval)
    this.timerInterval = window.setInterval(() => {
      this.elapsedSeconds++;
      this.emitUpdate(userWeightKg, this.lastAccuracyMeters);
    }, 1000);

    // Start GPS Watcher with high accuracy
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const now = pos.timestamp;

        // Discard low-accuracy readings (e.g. cell tower triangulation > 30m)
        if (accuracy > GPS_ACCURACY_THRESHOLD_METERS) {
          return;
        }

        if (this.lastLat !== null && this.lastLng !== null && this.lastTimestamp !== null) {
          const dt = (now - this.lastTimestamp) / 1000;
          if (dt >= 1) {
            const dist = this.calculateDistanceMeters(this.lastLat, this.lastLng, latitude, longitude);
            const calcSpeedKmh = (dist / dt) * 3.6;

            // Filter out GPS teleportation anomalies & micro-drift
            if (calcSpeedKmh < MAX_SPEED_JITTER_FILTER_KMH && dist > 1.0) {
              this.totalDistanceMeters += dist;

              // Check 1KM milestone audio alert
              const currentKmInt = Math.floor(this.totalDistanceMeters / MILESTONE_INTERVAL_METERS);
              if (currentKmInt > this.lastMilestoneKm) {
                this.lastMilestoneKm = currentKmInt;
                soundSynthService.playMilestone1KmAlert();
              }

              this.currentSpeedKmh = calcSpeedKmh;
              this.speedSamples.push(calcSpeedKmh);
              if (this.speedSamples.length > 5) this.speedSamples.shift();
            } else if (dist <= 1.0) {
              this.currentSpeedKmh = 0;
            }
          }
        }

        this.lastLat = latitude;
        this.lastLng = longitude;
        this.lastTimestamp = now;
        this.lastAccuracyMeters = Math.round(accuracy);

        this.emitUpdate(userWeightKg, this.lastAccuracyMeters);
      },
      (err) => {
        console.warn('[GPS] Watch position error:', err.message);
        if (err.code === 1) {
          alert('⚠️ Izin Akses Lokasi Ditolak!\n\nUntuk melacak kecepatan dan jarak, silakan izinkan akses lokasi (GPS) pada aplikasi V-Taper Protocol di Pengaturan HP Anda.');
        } else if (err.code === 2) {
          alert('⚠️ Sensor Lokasi/GPS HP Belum Aktif!\n\nMohon nyalakan tombol "Lokasi / GPS" di bilah notifikasi atas HP Anda (Oppo A5i Pro) agar kecepatan dapat diukur secara presisi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    return true;
  }

  public stopTracking(): GpsTrackingResult {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    wakeLockService.releaseLock();
    this.isTracking = false;

    const distanceKm = Math.round((this.totalDistanceMeters / 1000) * 100) / 100;
    const durationMin = Math.round(this.elapsedSeconds / 60);
    const avgSpeed = this.elapsedSeconds > 0 ? (distanceKm / (this.elapsedSeconds / 3600)) : 0;
    const calories = Math.round(MET_BRISK_WALKING * this.userWeightKg * (this.elapsedSeconds / 3600));

    let paceStr = "--'--\"";
    if (avgSpeed > 0.5) {
      const paceDecimal = 60 / avgSpeed;
      const paceMin = Math.floor(paceDecimal);
      const paceSec = Math.round((paceDecimal - paceMin) * 60);
      paceStr = `${paceMin}'${paceSec < 10 ? '0' : ''}${paceSec}"`;
    }

    return {
      distanceKm,
      durationMin,
      durationSeconds: this.elapsedSeconds,
      averageSpeedKmh: Math.round(avgSpeed * 10) / 10,
      caloriesKcal: calories,
      paceMinKm: paceStr
    };
  }

  private emitUpdate(userWeightKg: number, accuracyMeters: number): void {
    if (!this.subscriber) return;

    const distanceKm = Math.round((this.totalDistanceMeters / 1000) * 100) / 100;
    const avgSpeed = this.elapsedSeconds > 0 ? (distanceKm / (this.elapsedSeconds / 3600)) : 0;

    // Format pace (min/km)
    let paceStr = "--'--\"";
    if (this.currentSpeedKmh > 0.5) {
      const paceDecimal = 60 / this.currentSpeedKmh;
      const paceMin = Math.floor(paceDecimal);
      const paceSec = Math.round((paceDecimal - paceMin) * 60);
      paceStr = `${paceMin}'${paceSec < 10 ? '0' : ''}${paceSec}"`;
    }

    // Zone 2 optimal check (5.0 - 6.2 km/h)
    const isZoneOptimal =
      this.currentSpeedKmh >= ZONE2_MIN_SPEED_KMH && this.currentSpeedKmh <= ZONE2_MAX_SPEED_KMH;
    const speedStatus =
      this.currentSpeedKmh < ZONE2_MIN_SPEED_KMH
        ? 'slow'
        : this.currentSpeedKmh > ZONE2_MAX_SPEED_KMH
        ? 'fast'
        : 'optimal';

    const caloriesKcal = Math.round(
      MET_BRISK_WALKING * userWeightKg * (this.elapsedSeconds / 3600)
    );

    this.subscriber({
      distanceKm,
      currentSpeedKmh: Math.round(this.currentSpeedKmh * 10) / 10,
      averageSpeedKmh: Math.round(avgSpeed * 10) / 10,
      paceMinKm: paceStr,
      durationSeconds: this.elapsedSeconds,
      caloriesKcal,
      isZoneOptimal,
      speedStatus,
      accuracyMeters: Math.round(accuracyMeters)
    });
  }

  private reset(): void {
    this.totalDistanceMeters = 0;
    this.elapsedSeconds = 0;
    this.currentSpeedKmh = 0;
    this.lastMilestoneKm = 0;
    this.lastLat = null;
    this.lastLng = null;
    this.lastTimestamp = null;
    this.speedSamples = [];
    this.lastAccuracyMeters = 0;
  }
}

export const gpsTrackerService = new GpsTrackerService();
