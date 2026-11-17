import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, CheckCircle, AlertOctagon } from 'lucide-react';
import { indexedDbService } from '@/infrastructure/db/indexedDb.service';

export const HipShieldView: React.FC = () => {
  const [painLevel, setPainLevel] = useState<number>(4);

  useEffect(() => {
    indexedDbService.getMetric<number>('pain_level', 4).then(setPainLevel);
  }, []);

  const handleSliderChange = (val: number) => {
    setPainLevel(val);
    indexedDbService.setMetric('pain_level', val);
  };

  const getFeedback = (val: number) => {
    if (val <= 2) {
      return (
        <span className="text-emerald-700 font-bold">
          🟢 Fase Aman: Tendon dalam kondisi baik. Anda dapat berlatih bela diri dengan kontrol.
        </span>
      );
    } else if (val <= 5) {
      return (
        <span className="text-amber-700 font-bold">
          🟡 Fase Waspada: Batasi tendangan melingkar tinggi atau pivot bertumpu 1 kaki.
        </span>
      );
    } else {
      return (
        <span className="text-red-600 font-bold">
          🔴 Fase Radang Akut: Istirahat total dari tendangan. Fokus murni pada Side-Lying Hip Abduction!
        </span>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Diagnosis Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/25">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black">Proteksi Nyeri Pinggul Samping</h3>
            <p className="text-[10px] text-red-100 font-mono">Greater Trochanter / Tendon Gluteus Medius</p>
          </div>
        </div>
        <p className="text-xs text-red-50 leading-relaxed font-medium">
          Nyeri samping panggul saat bergerak lincah di bela diri terjadi karena <strong className="text-white font-bold">Gluteus Medius</strong> belum cukup kuat menahan inersia massa tubuh 79 kg saat tumpuan 1 kaki (pivot/tendang).
        </p>
      </div>

      {/* Pain Severity Slider */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-card-soft space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide">
            Monitor Nyeri Pinggul Bela Diri
          </h4>
          <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Level {painLevel}/10
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className="w-full accent-red-600 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-bold text-zinc-400 font-mono">
          <span>0 (Bebas Nyeri)</span>
          <span>5 (Mengganggu)</span>
          <span>10 (Nyeri Akut)</span>
        </div>

        <p className="text-[11px] text-zinc-600 font-medium pt-1">
          {getFeedback(painLevel)}
        </p>
      </div>

      {/* 5-Minute Warmup Checklist */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-card-soft">
        <h4 className="text-xs font-black text-zinc-900 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-600" /> Pemanasan 5-Menit Pra-Bela Diri:
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-red-600 rounded" />
            <span className="font-medium text-zinc-800">10x Standing Hip Circles (Buka Sendi Panggul)</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-red-600 rounded" />
            <span className="font-medium text-zinc-800">15x Glute Bridges (Aktivasi Bokong)</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-red-600 rounded" />
            <span className="font-medium text-zinc-800">30 Detik Side-Lying Isometric Hold</span>
          </label>
        </div>
      </div>

      {/* The Rules of Combat (Do's & Don'ts) */}
      <div className="grid grid-cols-1 gap-2.5">
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <h4 className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> PROTOKOL REHABILITASI
          </h4>
          <ul className="text-[11px] text-zinc-700 space-y-1 list-disc list-inside font-medium">
            <li>Lakukan <strong>Side-Lying Hip Abduction</strong> tiap Selasa (tahan 2s di atas).</li>
            <li>Tahan <strong>Isometric Glute Bridge</strong> 30 detik untuk mengunci panggul.</li>
            <li>Jalan cepat (Zona 2) di lintasan datar tanpa tanjakan terjal.</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-sm">
          <h4 className="text-xs font-extrabold text-red-600 flex items-center gap-1.5 mb-1">
            <AlertOctagon className="w-4 h-4 text-red-600" /> KONTRAINDIKASI (JANGAN LAKUKAN)
          </h4>
          <ul className="text-[11px] text-zinc-700 space-y-1 list-disc list-inside font-medium">
            <li><strong>Dilarang Cross-Body Stretch:</strong> Menyilangkan kaki ke arah dalam akan menekan tendon yang meradang ke tulang.</li>
            <li><strong>Kurangi Tendangan Melingkar Tinggi</strong> selama 1–2 pekan pertama.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
