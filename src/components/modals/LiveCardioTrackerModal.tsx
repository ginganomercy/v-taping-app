import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, Flame, Gauge, Clock, Navigation } from 'lucide-react';
import { gpsTrackerService } from '@/infrastructure/sensors/gpsTracker.service';
import { soundSynthService } from '@/infrastructure/audio/soundSynth.service';
import { GpsTelemetry, GpsTrackingResult } from '@/types/telemetry.types';

interface LiveCardioTrackerModalProps {
  isOpen: boolean;
  userWeightKg: number;
  onClose: () => void;
  onFinish: (result: GpsTrackingResult) => void;
}

export const LiveCardioTrackerModal: React.FC<LiveCardioTrackerModalProps> = ({
  isOpen,
  userWeightKg,
  onClose,
  onFinish
}) => {
  const [telemetry, setTelemetry] = useState<GpsTelemetry>({
    distanceKm: 0,
    currentSpeedKmh: 0,
    averageSpeedKmh: 0,
    paceMinKm: "--'--\"",
    durationSeconds: 0,
    caloriesKcal: 0,
    isZoneOptimal: true,
    speedStatus: 'optimal',
    accuracyMeters: 0
  });

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    gpsTrackerService.startTracking(userWeightKg, (data) => {
      setTelemetry(data);
    });

    return () => {
      if (gpsTrackerService.isTracking) {
        gpsTrackerService.stopTracking();
      }
    };
  }, [isOpen, userWeightKg]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinishSession = () => {
    soundSynthService.playCelebration();
    const result = gpsTrackerService.stopTracking();
    onFinish(result);
  };

  const getSpeedZoneBadge = () => {
    if (telemetry.currentSpeedKmh < 0.8) {
      return (
        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 font-bold text-xs">
          Diam / Bersiap
        </span>
      );
    }
    if (telemetry.isZoneOptimal) {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/30 flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          ZONA 2 OPTIMAL (5.0 - 6.2 km/j)
        </span>
      );
    }
    if (telemetry.speedStatus === 'slow') {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs">
          Percepat Langkah (&lt; 5.0 km/j)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs">
        Terlalu Cepat! Jaga Sendi Pinggul (&gt; 6.8 km/j)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white safe-top safe-bottom">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-500">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-white">LIVE GPS CARDIO HUD</h3>
            <p className="text-[10px] text-zinc-400 font-mono">Sensor Oppo GPS Active &bull; Presisi &plusmn;{telemetry.accuracyMeters}m</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main HUD Body */}
      <div className="space-y-6 my-auto text-center py-4">
        {/* Speed Zone Status */}
        <div className="flex justify-center">{getSpeedZoneBadge()}</div>

        {/* Big Speedometer Display */}
        <div className="py-2">
          <div className="text-8xl font-mono font-black tracking-tighter text-white">
            {telemetry.currentSpeedKmh.toFixed(1)}
          </div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block mt-1">
            Kecepatan Real-Time (KM/JAM)
          </span>
        </div>

        {/* 4 Primary Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {/* Jarak Tempuh */}
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-red-500" /> JARAK TEMPUH
            </span>
            <div className="text-3xl font-mono font-black text-white mt-1">
              {telemetry.distanceKm.toFixed(2)}
              <span className="text-sm text-zinc-500 ml-1">km</span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">Bip tiap 1.0 km tercapai</p>
          </div>

          {/* Pace */}
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-500" /> PACE RUNNER
            </span>
            <div className="text-3xl font-mono font-black text-white mt-1">
              {telemetry.paceMinKm}
              <span className="text-sm text-zinc-500 ml-1">/km</span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">Target: 10'00" - 12'00"</p>
          </div>

          {/* Stopwatch Durasi */}
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> DURASI JALAN
            </span>
            <div className="text-3xl font-mono font-black text-white mt-1">
              {formatSeconds(telemetry.durationSeconds)}
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">Target: 40–45 Menit</p>
          </div>

          {/* Estimasi Kalori */}
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> ESTIMASI KALORI
            </span>
            <div className="text-3xl font-mono font-black text-white mt-1">
              {telemetry.caloriesKcal}
              <span className="text-sm text-zinc-500 ml-1">kcal</span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">MET 4.3 (Bobot 79 kg)</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex gap-3 max-w-sm mx-auto w-full pt-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`btn-spring flex-1 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition ${
            isPaused
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'Lanjutkan' : 'Jeda Sesi'}</span>
        </button>

        <button
          onClick={handleFinishSession}
          className="btn-spring flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesai & Simpan</span>
        </button>
      </div>
    </div>
  );
};
