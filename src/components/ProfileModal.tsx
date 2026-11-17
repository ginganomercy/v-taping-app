import React, { useState } from 'react';
import { X, User, Save, Download, Upload, Check } from 'lucide-react';
import { UserProfile } from '../types/profile';
import { storage } from '../services/storage';
import { sound } from '../services/sound';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    sound.playCelebration();
    onClose();
  };

  const handleExport = async () => {
    const jsonStr = await storage.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v-taper-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playBeep(650, 'sine', 0.1);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const success = await storage.importBackup(text);
      if (success) {
        setImportStatus('Backup berhasil dipulihkan!');
        const reloaded = storage.getProfileSync();
        setFormData(reloaded);
        onSave(reloaded);
        sound.playCelebration();
      } else {
        setImportStatus('Gagal membaca file backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92dvh] overflow-y-auto no-scrollbar p-6 space-y-4 shadow-2xl relative">
        {/* Top Handle */}
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-1"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">Personalisasi Profil Atlet</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Kalibrasi Tubuh & Target Latihan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Nama / Alias */}
          <div>
            <label className="text-[10px] text-zinc-500 font-bold block mb-1">NAMA / PANGGILAN</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Tinggi & Berat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">TINGGI BADAN (CM)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold font-mono focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">BERAT AWAL (KG)</label>
              <input
                type="number"
                step="0.1"
                value={formData.startWeightKg}
                onChange={(e) => setFormData({ ...formData, startWeightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold font-mono focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Target Berat & Kapasitas Pull-Up */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">TARGET BERAT (KG)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-red-600 font-black font-mono focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">REPS PULL-UP BERSIH</label>
              <input
                type="number"
                value={formData.baselinePullUps}
                onChange={(e) => setFormData({ ...formData, baselinePullUps: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold font-mono focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Nutrisi Harian */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">TARGET KALORI (KCAL)</label>
              <input
                type="number"
                value={formData.dailyCalorieTarget}
                onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold font-mono focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">TARGET PROTEIN (GRAM)</label>
              <input
                type="number"
                value={formData.dailyProteinTarget}
                onChange={(e) => setFormData({ ...formData, dailyProteinTarget: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold font-mono focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Preset Beban Tas Ransel */}
          <div>
            <label className="text-[10px] text-zinc-500 font-bold block mb-1">
              PRESET BEBAN TAS RANSEL (CHIPS CEPAT)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center bg-slate-50 border border-zinc-200 rounded-xl px-2 py-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={formData.backpackPresetsKg[idx] || 0}
                    onChange={(e) => {
                      const updated = [...formData.backpackPresetsKg];
                      updated[idx] = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, backpackPresetsKg: updated });
                    }}
                    className="w-full bg-transparent font-mono font-bold text-zinc-900 text-center focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-zinc-400">kg</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-spring w-full py-3.5 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan Profil
          </button>
        </form>

        {/* Backup & Restore Zone */}
        <div className="pt-3 border-t border-zinc-100 space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
            CADANGAN & PEMULIHAN DATA (OFFLINE)
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="btn-spring flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor File Backup
            </button>

            <label className="btn-spring flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" /> Pulihkan Data
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {importStatus && (
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
              <Check className="w-3.5 h-3.5" /> {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
