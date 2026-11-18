import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, Flame, Gauge, Clock, Navigation } from 'lucide-react';
import { gpsTrackerService } from '@/infrastructure/sensors/gpsTracker.service';
import { soundSynthService } from '@/infrastructure/audio/soundSynth.service';
import { GpsTelemetry, GpsTrackingResult } from '@/types/telemetry.types';
import { CardioPhase, CARDIO_PHASES } from '@/constants/cardio.constants';

interface LiveCardioTrackerModalProps {
  isOpen: boolean;
  userWeightKg: number;
  phase?: CardioPhase;
  onClose: () => void;
  onFinish: (result: GpsTrackingResult) => void;
}

export const LiveCardioTrackerModal: React.FC<LiveCardioTrackerModalProps> = ({
  isOpen,
  userWeightKg,
  phase = 1,
  onClose,
  onFinish
}) => {
  const phaseConfig = CARDIO_PHASES[phase];

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

  // Phase-adaptive speed zone status
  const getSpeedZoneBadge = () => {
    if (telemetry.currentSpeedKmh < 0.8) {
      return (
        <span className="px-3.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700">
          Diam / Bersiap Melangkah
        </span>
      );
    }

    const isOptimal =
      telemetry.currentSpeedKmh >= phaseConfig.minSpeedKmh &&
      telemetry.currentSpeedKmh <= phaseConfig.maxSpeedKmh;

    if (isOptimal) {
      return (
        <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/40 flex items-center gap-2 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
          {phaseConfig.optimalBadgeText}
        </span>
      );
    }

    if (telemetry.currentSpeedKmh < phaseConfig.minSpeedKmh) {
      return (
        <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/20">
          Percepat Langkah (&lt; {phaseConfig.minSpeedKmh} km/j)
        </span>
      );
    }

    return (
      <span className="px-3.5 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/30">
        Kurangi Kecepatan (&gt; {phaseConfig.maxSpeedKmh} km/j)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white safe-top safe-bottom overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-500">
            <Navigation className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-tight text-white">LIVE GPS SPEEDOMETER</h3>
              <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-md bg-red-600 text-white shadow-sm">
                FASE {phase}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 flex-wrap">
              <span>{phaseConfig.name}</span>
              <span>&bull;</span>
              {telemetry.accuracyMeters > 0 && telemetry.accuracyMeters <= 30 ? (
                <span className="text-emerald-400 font-bold">Akurasi GPS &plusmn;{telemetry.accuracyMeters}m</span>
              ) : (
                <span className="text-amber-400 animate-pulse font-bold">Mencari Sinyal GPS...</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main HUD Body */}
      <div className="space-y-3 sm:space-y-4 my-auto text-center py-2 shrink-0">
        {/* Phase Specific Tactical Advice */}
        <div className="max-w-xs mx-auto p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 font-medium">
          💡 {phaseConfig.instructions}
        </div>

        {/* Speed Zone Status */}
        <div className="flex justify-center">{getSpeedZoneBadge()}</div>

        {/* Big Speedometer Display */}
        <div className="py-1">
          <div className="text-7xl sm:text-8xl font-mono font-black tracking-tighter text-white">
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
            <p className="text-[9px] mt-0.5 font-mono">
              {phaseConfig.primaryTarget === 'duration' ? (
                <span className="text-zinc-400">{phaseConfig.secondaryTargetLabel}</span>
              ) : (
                <span className="text-emerald-400 font-bold">{phaseConfig.primaryTargetLabel}</span>
              )}
            </p>
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
            <p className="text-[9px] text-zinc-400 mt-0.5 font-mono">Target: {phaseConfig.targetPaceStr}</p>
          </div>

          {/* Stopwatch Durasi */}
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left">
            <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> DURASI
            </span>
            <div className="text-3xl font-mono font-black text-white mt-1">
              {formatSeconds(telemetry.durationSeconds)}
            </div>
            <p className="text-[9px] mt-0.5 font-mono">
              {phaseConfig.primaryTarget === 'duration' ? (
                <span className="text-emerald-400 font-bold">{phaseConfig.primaryTargetLabel}</span>
              ) : (
                <span className="text-zinc-400">{phaseConfig.secondaryTargetLabel}</span>
              )}
            </p>
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
            <p className="text-[9px] text-zinc-500 mt-0.5">Bip tiap 1.0 KM</p>
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
