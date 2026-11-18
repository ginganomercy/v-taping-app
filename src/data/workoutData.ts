import { DayIndex, DaySession } from '@/types/workout.types';

export const WORKOUT_SCHEDULE: Record<DayIndex, DaySession> = {
  1: {
    dayIndex: 1,
    dayShort: "SEN",
    dayName: "Senin",
    title: "Upper A: Lats & Side Delts",
    focus: "FOKUS PELEBARAN",
    desc: "Membangun sayap punggung dan melebarkan diameter bahu samping.",
    alert: "💡 Aturan Khusus: Untuk pull-up, lakukan 2 repetisi bersih, lalu langsung sambung 3 repetisi negatif (turun 4 detik) menggunakan bantuan kursi.",
    exercises: [
      {
        id: "pull-up",
        title: "Pull-Up Bersih (Overhand)",
        muscle: "Latissimus Dorsi (Sayap)",
        equip: "Bar Pull-Up",
        pattern: "Vertical Pull",
        tempo: "2-0-1-0",
        sets: 4,
        targetReps: 2,
        defaultKg: 0,
        repsLabel: "2 Reps Bersih (Chin melewati bar)",
        image: "./pull-up.png",
        tip: "Pegang bar 1.5x selebar bahu. Tarik siku ke arah saku celana untuk mengaktifkan sayap. Dagu wajib melewati bar tanpa mengayunkan kaki."
      },
      {
        id: "negative-pull-up",
        title: "Negative Pull-Up (Eksentrik Lambat)",
        muscle: "Latissimus Dorsi & Biceps",
        equip: "Bar + Kursi",
        pattern: "Eccentric Pull",
        tempo: "4s Negatif",
        sets: 4,
        targetReps: 3,
        defaultKg: 0,
        repsLabel: "3 Reps (Turun perlahan 4 Detik)",
        image: "./negative-pull-up.png",
        hasNegativeTimer: true,
        tip: "Pijak kursi untuk langsung naik ke puncak bar. Lepaskan kaki, lalu tahan tubuh turun perlahan selama 4 detik penuh. Ini melatih serat otot cepat tanpa menguras tenaga tarik."
      },
      {
        id: "pike-push-up",
        title: "Pike Push-Up (Bahu Vertikal)",
        muscle: "Anterior & Lateral Deltoid",
        equip: "Lantai",
        pattern: "Vertical Push",
        tempo: "2-1-1-0",
        sets: 4,
        targetReps: 10,
        defaultKg: 0,
        repsLabel: "8 – 10 Reps",
        image: "./pike-push-up.png",
        tip: "Bentuk tubuh seperti huruf V terbalik. Tekuk siku ke arah belakang (sudut panah 45 derajat, bukan melebar 90 derajat) agar sendi bahu tetap aman."
      },
      {
        id: "single-arm-lateral-raise",
        title: "Tas Beban Lateral Raise",
        muscle: "Lateral Deltoid (Kunci Bahu Lebar)",
        equip: "Tas Ransel",
        pattern: "Shoulder Abduction",
        tempo: "2-1-1-1 (Hold 1s)",
        sets: 4,
        targetReps: 15,
        defaultKg: 4,
        repsLabel: "12 – 15 Reps per sisi",
        image: "./single-arm-lateral-raise.png",
        tip: "Gunakan tas ransel berisi beban 3-5 kg. Angkat ke samping setinggi bahu dengan siku sedikit ditekuk. Tahan 1 detik di atas. Jangan mengayunkan pinggang!"
      },
      {
        id: "single-arm-row",
        title: "Tas Beban Single-Arm Row",
        muscle: "Punggung Tengah & Lats Bawah",
        equip: "Tas + Kursi",
        pattern: "Horizontal Pull",
        tempo: "2-0-1-1 (Squeeze)",
        sets: 3,
        targetReps: 12,
        defaultKg: 6,
        repsLabel: "10 – 12 Reps per sisi",
        image: "./pull-up.png",
        tip: "Bungkukkan badan bertumpu pada kursi. Tarik tas ke arah pinggul (bukan ke dada) sambil merapatkan belikat untuk ketebalan sayap punggung."
      }
    ]
  },
  2: {
    dayIndex: 2,
    dayShort: "SEL",
    dayName: "Selasa",
    title: "Lower Body & Hip Shield",
    focus: "STABILITAS PINGGUL",
    desc: "Memperbaiki kelemahan pinggul lateral untuk kelincahan bela diri.",
    alert: "🛡️ Catatan Klinis: Gerakan hari ini dirancang tanpa benturan kejut (zero-impact) untuk mengobati radang tendon samping luar pinggul Anda.",
    exercises: [
      {
        id: "side-lying-hip-abduction",
        title: "Side-Lying Hip Abduction (Obat Pinggul)",
        muscle: "Gluteus Medius (Penstabil Utama)",
        equip: "Matras",
        pattern: "Hip Abduction",
        tempo: "2-2-1-0 (Tahan 2s)",
        sets: 4,
        targetReps: 15,
        defaultKg: 0,
        repsLabel: "12 – 15 Reps (Tahan 2s di atas)",
        image: "./side-lying-hip-abduction.png",
        tip: "Tidur menyamping, angkat kaki atas setinggi 45 derajat dengan tumit memimpin (jari kaki agak mengarah ke lantai). Rasakan kontraksi di samping pantat luar."
      },
      {
        id: "isometric-glute-bridge",
        title: "Isometric Glute Bridge",
        muscle: "Glutes & Hamstring (Kunci Pelvis)",
        equip: "Matras",
        pattern: "Pelvic Lock",
        tempo: "30s Hold",
        sets: 4,
        targetReps: 30,
        defaultKg: 0,
        repsLabel: "30 Detik Tahan per set",
        image: "./isometric-glute-bridge.png",
        tip: "Tidur telentang, dorong pinggul ke atas hingga lurus dengan paha. Kunci dan jepit otot bokong sekuat tenaga selama 30 detik tanpa menjatuhkan panggul."
      },
      {
        id: "bodyweight-box",
        title: "Box / Chair Step-Down",
        muscle: "Eksentrik Pelvis & Paha",
        equip: "Kursi Pendek",
        pattern: "Unilateral Squat",
        tempo: "3-1-1-0",
        sets: 3,
        targetReps: 10,
        defaultKg: 0,
        repsLabel: "8 – 10 Reps per kaki",
        image: "./bodyweight-box.png",
        tip: "Berdiri di atas undakan/bangku pendek dengan satu kaki. Turunkan kaki satunya perlahan menyentuh lantai tanpa membiarkan panggul miring atau lutut goyang."
      },
      {
        id: "controlled-bodyweight-squat",
        title: "Controlled Bodyweight Squat",
        muscle: "Quadriceps & Panggul",
        equip: "Bodyweight",
        pattern: "Bilateral Squat",
        tempo: "3-0-1-0",
        sets: 3,
        targetReps: 15,
        defaultKg: 0,
        repsLabel: "12 – 15 Reps (Tempo 3-0-1)",
        image: "./controlled-bodyweight-squat.png",
        tip: "Turun dalam 3 detik terkontrol. Pastikan lutut mengarah ke luar mengikuti jari kaki dan tidak menekuk ke dalam."
      }
    ]
  },
  3: {
    dayIndex: 3,
    dayShort: "RAB",
    dayName: "Rabu",
    title: "Mid-Week Recovery & Hip Decompression",
    focus: "REGENERASI PINGGUL & CNS",
    desc: "Memberikan jeda waktu 48 jam bagi tendon Gluteus Medius dan sendi panggul untuk memperbarui kolagen pasca latihan kaki Selasa.",
    alert: "🛡️ Protokol Perlindungan Tubuh: Sesuai rekomendasi biomekanika, sesi kardio hybrid difokuskan HANYA pada hari Sabtu pagi. Hari Rabu dikhususkan untuk dekompresi tulang belakang dan peregangan pasif ringan agar otot sayap lats dan bahu Anda 100% segar untuk Upper B besok Kamis.",
    exercises: [
      {
        id: "spine-decompression-hang",
        title: "Dead Hang Spine Decompression",
        muscle: "Tulang Belakang & Relaksasi Sayap",
        equip: "Bar Pull-Up",
        pattern: "Passive Traction",
        tempo: "20-30s Hang",
        sets: 3,
        targetReps: 30,
        defaultKg: 0,
        repsLabel: "3 Set x 20–30 Detik Gantung Pasif",
        image: "./pull-up.png",
        tip: "Gantung rileks pada bar pull-up tanpa menarik. Biarkan berat tubuh mendekompresi ruas tulang punggung dan membuka rongga bahu."
      },
      {
        id: "pelvic-restoration",
        title: "Peregangan Panggul Ringan & Hidrasi",
        muscle: "Kapsul Sendi Panggul & Tendon",
        equip: "Matras",
        pattern: "Passive Mobility",
        tempo: "Napas Lambat",
        sets: 1,
        targetReps: 5,
        defaultKg: 0,
        repsLabel: "5 Menit Peregangan Pasif + 3L Air",
        image: "./side-lying-hip-abduction.png",
        tip: "Lakukan peregangan panggul tanpa memaksakan rentang gerak. Cukupi kebutuhan air 3 Liter hari ini untuk mempercepat regenerasi cairan sendi."
      }
    ]
  },
  4: {
    dayIndex: 4,
    dayShort: "KAM",
    dayName: "Kamis",
    title: "Upper B: Upper Chest & Bahu 3D",
    focus: "POSTUR TEGAK 3D",
    desc: "Mengisi dada bagian atas dan bahu belakang agar tidak bungkuk.",
    alert: "📐 Taper Tip: Dada atas yang terisi tebal akan membuat bahu terlihat terhubung kokoh ke leher, mempertegas siluet V.",
    exercises: [
      {
        id: "decline-push-up",
        title: "Feet-Elevated (Decline) Push-Up",
        muscle: "Clavicular Head (Dada Atas)",
        equip: "Kursi/Ranjang",
        pattern: "Incline Push",
        tempo: "2-1-1-0",
        sets: 4,
        targetReps: 12,
        defaultKg: 0,
        repsLabel: "10 – 12 Reps",
        image: "./decline-push-up.png",
        tip: "Letakkan kedua kaki di atas kursi atau ranjang, tangan di lantai selebar bahu. Turun perlahan sampai hidung hampir menyentuh lantai."
      },
      {
        id: "overhead-shoulder-press",
        title: "Tas Beban Overhead Press",
        muscle: "Bahu Depan & Triceps",
        equip: "Tas Ransel",
        pattern: "Vertical Push",
        tempo: "2-0-1-0",
        sets: 4,
        targetReps: 10,
        defaultKg: 6,
        repsLabel: "10 – 12 Reps",
        image: "./overhead-shoulder-press.png",
        tip: "Pegang tas beban dengan kedua tangan di depan dada. Dorong lurus tegak ke atas kepala. Kunci otot perut agar pinggang tidak melengkung ke belakang."
      },
      {
        id: "prone-ytw-raises",
        title: "Prone Y-T-W Raises di Lantai",
        muscle: "Rear Deltoid & Lower Traps",
        equip: "Matras/Lantai",
        pattern: "Scapular Control",
        tempo: "1-1-1-1",
        sets: 3,
        targetReps: 10,
        defaultKg: 0,
        repsLabel: "10 Reps tiap formasi (Y, T, W)",
        image: "./prone-ytw-raises.png",
        tip: "Tidur tengkurap di matras/lantai. Angkat lengan membentuk huruf Y, lalu T, lalu W dengan jempol mengarah ke atas untuk melatih bahu belakang."
      },
      {
        id: "incline-floor-press",
        title: "Tas Beban Floor Press",
        muscle: "Pectoralis Major & Triceps",
        equip: "Tas + Bantal",
        pattern: "Horizontal Push",
        tempo: "2-0-1-0",
        sets: 3,
        targetReps: 12,
        defaultKg: 8,
        repsLabel: "12 – 15 Reps",
        image: "./incline-floor-press.png",
        tip: "Tidur di lantai dengan bantal menyangga punggung atas. Dorong tas ransel ke atas seperti dumbbell bench press."
      }
    ]
  },
  5: {
    dayIndex: 5,
    dayShort: "JUM",
    dayName: "Jumat",
    title: "Full Core (TVA) & Pinggang Ramping",
    focus: "MENGECILKAN PINGGANG",
    desc: "Mengencangkan korset dinding perut alami untuk mengecilkan lingkar pinggang.",
    alert: "⏳ Korset Alami: Latihan Transverse Abdominis (TVA) terbukti mengecilkan perut buncit bawah lebih efektif daripada ribuan sit-up.",
    exercises: [
      {
        id: "stomach-vacuum",
        title: "Stomach Vacuum (Paling Krusial)",
        muscle: "Transverse Abdominis (Korset Alami)",
        equip: "Tanpa Alat",
        pattern: "Internal Compression",
        tempo: "25s Hold",
        sets: 4,
        targetReps: 25,
        defaultKg: 0,
        repsLabel: "20 – 30 Detik Tahan Napas",
        image: "./stomach-vacuum.png",
        tip: "Buang seluruh udara dari paru-paru sampai kosong. Tarik pusar sedalam mungkin ke arah tulang belakang. Kunci dan tahan tanpa bernapas selama 25 detik."
      },
      {
        id: "posterior-pelvic-tilt",
        title: "Plank Posterior Pelvic Tilt",
        muscle: "Deep Core & Stabilitas Panggul",
        equip: "Matras",
        pattern: "Anti-Extension",
        tempo: "45s Hold",
        sets: 3,
        targetReps: 45,
        defaultKg: 0,
        repsLabel: "45 Detik Tahan",
        image: "./posterior-pelvic-tilt.png",
        tip: "Posisi plank bertumpu pada siku. Putar panggul sedikit ke dalam (jepit bokong keras) agar punggung bawah tidak melengkung ke bawah."
      },
      {
        id: "controlled-deadbug",
        title: "Controlled Deadbug (Hip Safe)",
        muscle: "Anti-Ekstensi Core & Koordinasi",
        equip: "Matras",
        pattern: "Cross-Coordination",
        tempo: "3-1-1-0",
        sets: 3,
        targetReps: 10,
        defaultKg: 0,
        repsLabel: "10 Reps per sisi",
        image: "./controlled-deadbug.png",
        tip: "Tidur telentang, tempelkan seluruh punggung bawah ke lantai. Gerakkan tangan kanan dan kaki kiri bergantian secara lambat tanpa pinggang terangkat."
      }
    ]
  },
  6: {
    dayIndex: 6,
    dayShort: "SAB",
    dayName: "Sabtu",
    title: "Hybrid Cardio Engine: Sesi Tunggal Mingguan",
    focus: "KARDIO HYBRID & VO2 MAX",
    desc: "Satu-satunya sesi kardio hybrid mingguan yang terkonsentrasi untuk melatih kapasitas aerobik tanpa membebani sendi pinggul.",
    alert: "👟 Sesi Kardio Utama (Sabtu): Eksekusi di pagi hari saat udara segar. Pilih Fase 1 (Jalan Cepat), Fase 2 (Walk/Jog), atau Fase 3 (5K Run) sesuai kesiapan fisik Anda. Pantau kecepatan real-time via GPS Speedometer di bawah!",
    exercises: [
      {
        id: "hybrid-cardio-engine",
        title: "Hybrid Cardio: Aerobic Engine & Fat Oxidation",
        muscle: "Kapasitas Paru & Pembakaran Lemak",
        equip: "Sepatu Lari & GPS",
        pattern: "Aerobic LISS / Hybrid Runner",
        tempo: "Pace Terkalibrasi",
        sets: 1,
        targetReps: 45,
        defaultKg: 0,
        isCardio: true,
        repsLabel: "Sesi Kardio Terpilih (Fase 1 / 2 / 3)",
        image: "./controlled-bodyweight-squat.png",
        tip: "Pilih fase latihan Anda: [Fase 1] Jalan cepat 45 menit (5.0-6.2 km/j), [Fase 2] Walk/Jog interval (5.5-8.0 km/j), [Fase 3] 5K Run kontinu. Tekan tombol 'MULAI LACAK GPS LIVE' untuk membuka speedometer digital!"
      }
    ]
  },
  0: {
    dayIndex: 0,
    dayShort: "MIN",
    dayName: "Minggu",
    title: "Full Rest & Pemulihan Otot",
    focus: "REGENERASI TOTAL",
    desc: "Otot bertumbuh saat Anda istirahat, bukan saat latihan.",
    alert: "🛌 Rest Protocol: Pastikan tidur 7–8 jam malam ini dan penuhi target 145g protein agar jaringan otot yang rusak terbangun lebih tebal.",
    exercises: [
      {
        id: "rest-day",
        title: "Full Recovery & Hidrasi",
        muscle: "Sistem Saraf Pusat (CNS) & Serat Otot",
        equip: "Tempat Tidur",
        pattern: "Restoration",
        tempo: "Tidur 8 Jam",
        sets: 1,
        targetReps: 8,
        defaultKg: 0,
        repsLabel: "Tidur 8 Jam + Asupan 145g Protein",
        image: "./pull-up.png",
        tip: "Luangkan waktu untuk peregangan ringan atau jalan santai. Jangan lakukan angkat beban atau latihan intensitas tinggi hari ini."
      }
    ]
  }
};

export const DAY_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];
