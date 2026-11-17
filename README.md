# 🛡️ V-Taper Athlete Protocol & Hybrid Cardio Tracker

Aplikasi latihan fisik calisthenics rumahan dan pelacak kardio harian berstandar **Hybrid Athlete**. Dirancang khusus untuk transformasi postur **V-Taper ("Doritos Shape")** dari baseline **79 kg menuju target 66 kg**, rehabilitasi tendinopati pinggul samping (*Gluteus Medius*), serta pemantauan kecepatan jalan cepat (*Zone 2 Aerobic Base*) secara real-time via sensor GPS perangkat Android / iOS.

---

## 🚀 Fitur Unggulan

1. **Live GPS Speedometer & Odometer (Tanpa Minimap)**
   - **HUD Angka Real-Time:** Menampilkan kecepatan saat ini ($km/jam$), jarak tempuh ($km$), *pace* lari ($min/km$), durasi, dan estimasi pembakaran kalori (MET 4.3).
   - **Zone 2 Cruise Control:** Indikator visual hijau otomatis ketika berada pada rentang jalan cepat optimal ($5.0 - 6.2\ \text{km/jam}$) untuk membakar asam lemak tanpa mengikis glikogen otot sayap/bahu.
   - **Peringatan Audio Bip 1 KM:** Chime synthesizer Web Audio API otomatis berbunyi setiap kelipatan 1 KM sebagai umpan balik ritme tanpa perlu melihat layar ponsel.
   - **Screen WakeLock:** Mencegah layar Oppo A5i Pro mati secara otomatis saat sesi kardio aktif.
   - **Hemat Baterai & Nol Lag:** Minimap ditiadakan untuk efisiensi daya maksimal dan performa bebas patah-patah.

2. **Full-Offline Dual-Layer Storage**
   - Menggabungkan **IndexedDB (`idb`)** sebagai penyimpanan primer terstruktur dan **`localStorage`** untuk sinkronisasi seketika (*instant zero-FOUC hydration*).
   - Dilengkapi fitur **Backup & Restore JSON** sekali klik di menu Profil.

3. **Biomekanik V-Taper Terkalibrasi**
   - Progresi Pull-Up dinamis (baseline 2 reps bersih) dengan 4 detik fase negatif berirama bip countdown.
   - Pintas beban tas ransel (`+3kg`, `+5kg`, `+8kg`) untuk progressive overload instan.
   - Visualisasi siluet torso SVG dinamis yang merespons rasio bahu-ke-pinggang (*Shoulder-to-Waist Ratio* $\ge 1.618$).

4. **Protokol Perlindungan Pinggul (Hip Shield)**
   - Skala nyeri 0–10 (*Greater Trochanteric Pain Syndrome*) dengan panduan klinis otomatis.
   - Protokol pemanasan isometrik 5 menit sebelum latihan bela diri atau tendangan kaki.

5. **Cloud CI/CD Automated APK Release**
   - GitHub Actions workflow (`.github/workflows/build-apk.yml`) otomatis mengompilasi `app-debug.apk` dan menerbitkan GitHub Releases ketika tag versi dipublikasikan.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend Core:** React 18 + TypeScript + Vite (ESM Build System)
- **Styling:** Tailwind CSS (Athletic Red-White High Contrast `#dc2626` / `#ffffff` / `#09090b`)
- **Sensors & Audio:** Geolocation API (Haversine Formula + Accuracy Filtering), Web Audio API Synth, Screen WakeLock API
- **Mobile Hybrid Engine:** Capacitor 6 (`@capacitor/core`, `@capacitor/android`)
- **Offline Database:** IndexedDB via `idb` v8.0.0
- **CI/CD:** GitHub Actions (Ubuntu + JDK 21 + Android SDK Tools)

---

## 💻 Cara Menjalankan Aplikasi

Jalankan perintah standar terminal berikut:
```bash
# Pastikan dependensi sudah terpasang
npm install

# Jalankan dev server lokal dengan akses IP lokal (untuk laptop dan HP)
npm run dev
```

Terminal akan menampilkan link akses lokal (`http://localhost:5173`) dan link jaringan Wi-Fi (`http://192.168.x.x:5173`).

---

## 📱 Cara Mengakses dari HP Android (Oppo A5i Pro)

1. Pastikan laptop dan HP Oppo terhubung ke **jaringan Wi-Fi yang sama** (atau via Hotspot HP).
2. Periksa output terminal Vite:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.x.x:5173/
   ```
3. Buka Chrome di HP Oppo dan ketik alamat **`http://192.168.x.x:5173`**.
4. Izinkan izin **Lokasi / GPS** saat menekan tombol **"MULAI LACAK GPS LIVE"** di menu latihan Rabu/Sabtu.
5. *(Opsional)* Tekan menu titik tiga di Chrome HP $\rightarrow$ **"Tambahkan ke Layar Utama" (Add to Home screen)** untuk menjadikannya aplikasi layar penuh mandiri.

---

## 📦 Cara Build APK via GitHub Release

Aplikasi sudah dilengkapi file `.github/workflows/build-apk.yml`. Untuk menghasilkan file installer `.apk` secara otomatis tanpa memerlukan Android Studio di laptop:

1. Buat repositori baru di GitHub (misal: `v-taper-protocol`).
2. Sambungkan remote git dan push branch master:
   ```bash
   git remote add origin https://github.com/USERNAME/v-taper-protocol.git
   git branch -M master
   git push -u origin master
   ```
3. Buat dan push git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. Buka tab **Actions** atau **Releases** di repositori GitHub Anda.
5. Unduh file **`app-debug.apk`** langsung ke HP Oppo Anda dan instal!
