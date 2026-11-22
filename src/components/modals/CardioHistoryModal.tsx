import React, { useState, useEffect } from 'react';
import { X, Trash2, Activity, Calendar, Clock, Flame, Gauge, Navigation, Sparkles } from 'lucide-react';
import { CardioLogEntry } from '@/types/telemetry.types';
import { CardioPhase, CARDIO_PHASES } from '@/constants/cardio.constants';
import { indexedDbService } from '@/infrastructure/db/indexedDb.service';
import { soundSynthService } from '@/infrastructure/audio/soundSynth.service';

interface CardioHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CardioHistoryModal: React.FC<CardioHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [logs, setLogs] = useState<CardioLogEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | CardioPhase>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    const data = await indexedDbService.getCardioLogs();
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: number) => {
    soundSynthService.playBeep(400, 'sine', 0.1);
    await indexedDbService.deleteCardioLog(id);
    setDeleteConfirmId(null);
    await fetchLogs();
  };

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'all') return true;
    return log.phase === activeFilter;
  });

  // Calculate Cumulative Metrics
  const totalSessions = logs.length;
  const totalDistanceKm = logs.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0);
  const totalSeconds = logs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const totalCalories = logs.reduce((acc, curr) => acc + (curr.caloriesKcal || 0), 0);

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes} Menit`;
  };

  const formatDurationDetail = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const getPhaseBadgeColor = (phase: CardioPhase) => {
    switch (phase) {
      case 1:
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 2:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 3:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 safe-top safe-bottom">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-zinc-950 tracking-tight">
                  Riwayat Kardio GPS
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  {totalSessions} Sesi
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">
                Histori lari & jalan tersimpan 100% offline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lifetime Statistics Summary */}
        <div className="p-4 bg-zinc-950 text-white shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Total Akumulatif Kardio
            </span>
            <span className="text-[10px] font-mono text-zinc-400">IndexedDB v2</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-400 block font-sans font-bold">TOTAL JARAK</span>
              <strong className="text-sm sm:text-base font-black text-rose-400">
                {totalDistanceKm.toFixed(2)}
              </strong>
              <span className="text-[8px] text-zinc-400 block font-sans">Kilometer</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-400 block font-sans font-bold">DURASI</span>
              <strong className="text-sm sm:text-base font-black text-white">
                {formatTotalTime(totalSeconds)}
              </strong>
              <span className="text-[8px] text-zinc-400 block font-sans">Waktu Aktif</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[9px] text-zinc-400 block font-sans font-bold">KALORI</span>
              <strong className="text-sm sm:text-base font-black text-amber-400">
                {totalCalories}
              </strong>
              <span className="text-[8px] text-zinc-400 block font-sans">kcal Terbakar</span>
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200/80 flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar text-xs font-mono font-bold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeFilter === 'all'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Semua ({logs.length})
          </button>
          {([1, 2, 3] as CardioPhase[]).map((phase) => {
            const count = logs.filter((l) => l.phase === phase).length;
            return (
              <button
                key={phase}
                onClick={() => setActiveFilter(phase)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                  activeFilter === phase
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                Fase {phase} ({count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Session List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
          {isLoading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-mono">
              Memuat histori kardio...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-3 bg-white rounded-3xl border border-zinc-200 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Activity className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Belum Ada Riwayat Sesi</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Setiap kali Anda menekan <strong className="text-red-600">"Selesai & Simpan"</strong> pada Live GPS Speedometer, histori lari Anda akan otomatis tercatat permanen di sini.
                </p>
              </div>
            </div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id || item.timestamp}
                className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-sm hover:border-red-200 transition space-y-3"
              >
                {/* Header Row: Phase Badge + Date + Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg border ${getPhaseBadgeColor(
                        item.phase
                      )}`}
                    >
                      FASE {item.phase}: {CARDIO_PHASES[item.phase]?.badge || 'HYBRID'}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {item.dateFormatted}
                    </span>
                  </div>

                  {/* Delete Button / Confirmation */}
                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-zinc-200 text-zinc-700 rounded-lg text-[10px] font-bold"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => item.id && setDeleteConfirmId(item.id)}
                      title="Hapus sesi ini"
                      className="text-zinc-300 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 4-Column Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center font-mono py-1 border-y border-zinc-100">
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-sans font-bold">JARAK</span>
                    <strong className="text-base text-zinc-950 font-black">
                      {item.distanceKm.toFixed(2)}
                    </strong>
                    <span className="text-[8px] text-zinc-400 block font-sans font-bold">KM</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-sans font-bold">DURASI</span>
                    <strong className="text-base text-zinc-950 font-black">
                      {formatDurationDetail(item.durationSeconds || item.durationMin * 60)}
                    </strong>
                    <span className="text-[8px] text-zinc-400 block font-sans font-bold">Waktu</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-sans font-bold">PACE</span>
                    <strong className="text-base text-zinc-950 font-black">
                      {item.paceMinKm || "--'--\""}
                    </strong>
                    <span className="text-[8px] text-zinc-400 block font-sans font-bold">/km</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-sans font-bold">KALORI</span>
                    <strong className="text-base text-rose-600 font-black">
                      {item.caloriesKcal}
                    </strong>
                    <span className="text-[8px] text-zinc-400 block font-sans font-bold">kcal</span>
                  </div>
                </div>

                {/* Bottom Row: Average Speed and Phase Advice */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1 font-bold">
                    <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Kecepatan Rata-Rata: </span>
                    <strong className="text-zinc-800 font-black">{item.averageSpeedKmh} km/j</strong>
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate max-w-[140px]">
                    {CARDIO_PHASES[item.phase]?.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-zinc-100 flex items-center justify-between shrink-0">
          <p className="text-[10px] text-zinc-400 font-mono">
            💡 Cadangan riwayat disertakan otomatis pada Ekspor JSON.
          </p>
          <button
            onClick={onClose}
            className="btn-spring px-5 py-2 rounded-xl bg-zinc-950 text-white font-extrabold text-xs shadow-md hover:bg-zinc-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
