import React, { useState, useEffect } from 'react';
import { Sparkles, Triangle, Droplet, Navigation } from 'lucide-react';
import { WeightEntry } from '@/types/workout.types';
import { UserProfile } from '@/types/profile.types';
import { indexedDbService } from '@/infrastructure/db/indexedDb.service';
import { soundSynthService } from '@/infrastructure/audio/soundSynth.service';
import { GOLDEN_RATIO_SWR } from '@/constants/biomechanics.constants';

interface VTaperViewProps {
  profile: UserProfile;
  onOpenCardioHistory?: () => void;
}

export const VTaperView: React.FC<VTaperViewProps> = ({ profile, onOpenCardioHistory }) => {
  const [shoulder, setShoulder] = useState<number>(112);
  const [waist, setWaist] = useState<number>(88);
  const [protein, setProtein] = useState<number>(0);
  const [water, setWater] = useState<number>(0);
  const [weightInput, setWeightInput] = useState<string>('');
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [cardioCount, setCardioCount] = useState<number>(0);
  const [cardioDistance, setCardioDistance] = useState<number>(0);

  useEffect(() => {
    indexedDbService.getMetric<number>('shoulder_cm', 112).then(setShoulder);
    indexedDbService.getMetric<number>('waist_cm', 88).then(setWaist);
    indexedDbService.getMetric<number>('protein_today', 0).then(setProtein);
    indexedDbService.getMetric<number>('water_today', 0).then(setWater);
    indexedDbService.getWeights().then(setWeights);
    indexedDbService.getCardioLogs().then((logs) => {
      setCardioCount(logs.length);
      const totalKm = logs.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0);
      setCardioDistance(totalKm);
    });
  }, []);

  const handleShoulderChange = (val: number) => {
    setShoulder(val);
    indexedDbService.setMetric('shoulder_cm', val);
  };

  const handleWaistChange = (val: number) => {
    setWaist(val);
    indexedDbService.setMetric('waist_cm', val);
  };

  const ratio = waist > 0 ? (shoulder / waist).toFixed(3) : '0';
  const progressPercent = Math.min(100, Math.round((parseFloat(ratio) / GOLDEN_RATIO_SWR) * 100));

  // Dynamic Doritos Silhouette Coordinates based on user profile height
  const centerX = 110;
  const heightRatio = profile.heightCm / 170;
  const topHalfWidth = Math.min(95, Math.max(60, (shoulder / (170 * heightRatio)) * 125));
  const bottomHalfWidth = Math.min(85, Math.max(40, (waist / (170 * heightRatio)) * 110));
  const x1 = Math.round(centerX - topHalfWidth);
  const x2 = Math.round(centerX + topHalfWidth);
  const x3 = Math.round(centerX + bottomHalfWidth);
  const x4 = Math.round(centerX - bottomHalfWidth);

  const handleAddProtein = (amt: number) => {
    const next = protein + amt;
    setProtein(next);
    indexedDbService.setMetric('protein_today', next);
    soundSynthService.playBeep(700, 'sine', 0.1);
  };

  const handleAddWater = (amt: number) => {
    const next = Math.min(5, water + amt);
    setWater(next);
    indexedDbService.setMetric('water_today', next);
    soundSynthService.playBeep(600, 'sine', 0.08);
  };

  const handleResetWater = () => {
    setWater(0);
    indexedDbService.setMetric('water_today', 0);
  };

  const handleSaveWeight = async () => {
    const w = parseFloat(weightInput);
    if (!w || isNaN(w)) return;
    await indexedDbService.saveWeight(w);
    setWeightInput('');
    const updated = await indexedDbService.getWeights();
    setWeights(updated);
    soundSynthService.playBeep(700, 'sine', 0.1);
  };

  const diffWaist = Math.max(0, Math.round(waist - shoulder / GOLDEN_RATIO_SWR));

  return (
    <div className="space-y-4">
      {/* SWR Calculator & Morphing Silhouette */}
      <div className="p-5 rounded-3xl bg-white border border-red-100 shadow-card-lift relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950">V-Taper Ratio (SWR)</h3>
              <p className="text-[10px] font-bold text-zinc-400 font-mono">
                Golden Ratio Target: ≥ {GOLDEN_RATIO_SWR}
              </p>
            </div>
          </div>
          <span className="text-sm font-mono font-black px-3 py-1 rounded-xl bg-red-600 text-white shadow-sm">
            {ratio}
          </span>
        </div>

        {/* Dynamic Doritos Polygon SVG */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-zinc-200/80 mb-4 flex flex-col items-center justify-center relative">
          <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 mb-2 flex items-center gap-1">
            <Triangle className="w-3 h-3 text-red-600 rotate-180" /> Visualisasi Bentuk Torso Doritos ({profile.name})
          </div>
          <svg width="220" height="110" viewBox="0 0 220 110" className="transition-all duration-300">
            {/* Reference Golden Ratio Line (Dashed) */}
            <polygon
              points="20,15 200,15 145,95 75,95"
              fill="none"
              stroke="#fecdd3"
              strokeWidth="2"
              strokeDasharray="4"
            />
            {/* User Real Polygon */}
            <defs>
              <linearGradient id="torsoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <polygon
              points={`${x1},15 ${x2},15 ${x3},95 ${x4},95`}
              fill="url(#torsoGrad)"
              opacity="0.85"
            />
            <text x="110" y="12" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#71717a" textAnchor="middle">
              LEBAR BAHU
            </text>
            <text x="110" y="105" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#71717a" textAnchor="middle">
              PINGGANG
            </text>
          </svg>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-zinc-200">
            <label className="text-[10px] text-zinc-500 font-bold block mb-1">
              LINGKAR BAHU (CM)
            </label>
            <input
              type="number"
              value={shoulder}
              onChange={(e) => handleShoulderChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-base font-mono font-bold text-zinc-900 focus:outline-none focus:border-red-600 transition"
            />
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-zinc-200">
            <label className="text-[10px] text-zinc-500 font-bold block mb-1">
              LINGKAR PINGGANG (CM)
            </label>
            <input
              type="number"
              value={waist}
              onChange={(e) => handleWaistChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-base font-mono font-bold text-zinc-900 focus:outline-none focus:border-red-600 transition"
            />
          </div>
        </div>

        {/* Gauge Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono font-bold">
            <span className="text-zinc-600">
              Rasio Anda: <strong className="text-red-600">{ratio}</strong>
            </span>
            <span className="text-red-600">Target: {GOLDEN_RATIO_SWR}</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xs font-medium text-zinc-600 mt-3 pt-3 border-t border-zinc-100 leading-relaxed">
          {parseFloat(ratio) >= GOLDEN_RATIO_SWR ? (
            <span className="text-red-600 font-bold">
              🏆 Rasio Emas Tercapai! Proporsi bahu ke pinggang Anda sudah berada dalam kategori V-Taper ideal.
            </span>
          ) : (
            <span>
              Fokus Rekomposisi: Turunkan lingkar pinggang sebesar <strong>{diffWaist} cm</strong> lagi via defisit kalori & kencangkan otot sayap Lats.
            </span>
          )}
        </p>
      </div>

      {/* Daily Macro Blueprint */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-card-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-950">Target Nutrisi Harian</h3>
            <p className="text-[10px] text-zinc-400 font-bold">
              Target Defisit: {profile.startWeightKg} kg → {profile.targetWeightKg} kg
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-extrabold">
            {profile.dailyCalorieTarget} kcal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
          <div className="p-3 rounded-2xl bg-red-50/70 border border-red-100">
            <span className="text-[10px] text-zinc-500 block font-sans font-bold">PROTEIN</span>
            <strong className="text-base text-red-600 font-black">{profile.dailyProteinTarget}g</strong>
            <span className="text-[9px] text-zinc-500 block font-sans">Anti-Atrofi</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 block font-sans font-bold">KARBO</span>
            <strong className="text-base text-zinc-900 font-black">195g</strong>
            <span className="text-[9px] text-zinc-500 block font-sans">Energi</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-500 block font-sans font-bold">LEMAK</span>
            <strong className="text-base text-zinc-900 font-black">48g</strong>
            <span className="text-[9px] text-zinc-500 block font-sans">Hormon</span>
          </div>
        </div>

        {/* Quick Food Buttons */}
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-zinc-900">Catat Protein Cepat Hari Ini:</span>
            <span className="text-xs font-mono font-bold text-red-600">
              {protein} / {profile.dailyProteinTarget}g
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => handleAddProtein(30)}
              className="btn-spring p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-center hover:border-red-600"
            >
              <span className="text-[10px] text-zinc-500 block">Dada Ayam</span>
              <strong className="text-zinc-900 font-bold">+30g P</strong>
            </button>
            <button
              onClick={() => handleAddProtein(12)}
              className="btn-spring p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-center hover:border-red-600"
            >
              <span className="text-[10px] text-zinc-500 block">2 Telur</span>
              <strong className="text-zinc-900 font-bold">+12g P</strong>
            </button>
            <button
              onClick={() => handleAddProtein(15)}
              className="btn-spring p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-center hover:border-red-600"
            >
              <span className="text-[10px] text-zinc-500 block">Tempe</span>
              <strong className="text-zinc-900 font-bold">+15g P</strong>
            </button>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-zinc-800">
              <Droplet className="w-4 h-4 text-red-600" /> Target Air Putih
            </span>
            <span className="font-mono text-red-600 font-black">{water.toFixed(1)} / 3.0 Liter</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddWater(0.5)}
              className="btn-spring flex-1 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100"
            >
              + 500 ml
            </button>
            <button
              onClick={handleResetWater}
              className="btn-spring px-3 py-2 rounded-xl bg-zinc-100 text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Weight Logger */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-card-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-zinc-950">Log Timbangan Mingguan</h3>
          <span className="text-[10px] text-zinc-400 font-mono font-bold">
            Start: {profile.startWeightKg} kg • Goal: {profile.targetWeightKg} kg
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Berat hari ini (kg)"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-zinc-900 focus:outline-none focus:border-red-600"
          />
          <button
            onClick={handleSaveWeight}
            className="btn-spring px-5 py-2 bg-red-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-red-600/25"
          >
            Simpan
          </button>
        </div>

        <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto no-scrollbar text-xs font-mono">
          {weights.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between py-1.5 border-b border-zinc-100 last:border-0"
            >
              <span className="text-zinc-500">{item.date}</span>
              <span className={`font-bold ${idx === 0 ? 'text-red-600' : 'text-zinc-800'}`}>
                {item.weight.toFixed(1)} kg
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hybrid Cardio History Summary Card */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-card-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950">Riwayat Kardio GPS</h3>
              <p className="text-[10px] text-zinc-400 font-mono font-bold">
                {cardioCount} Sesi Tercatat • {cardioDistance.toFixed(2)} KM Terakumulasi
              </p>
            </div>
          </div>
          {onOpenCardioHistory && (
            <button
              onClick={onOpenCardioHistory}
              className="btn-spring px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs shadow-md transition"
            >
              Buka Histori
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
