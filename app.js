/**
 * V-TAPER ATHLETIC ENGINE (RED & WHITE HIGH-CONTRAST EDITION)
 * Mobile-First Vanilla JS Architecture with Native Touch Swipe & Clean Typography
 */

// ==========================================
// 1. DATA BLUEPRINT & EXERCISE CATALOG
// ==========================================
const WORKOUT_SCHEDULE = {
  1: { // SENIN
    title: "Upper A: Lats & Side Delts",
    focus: "FOKUS PELEBARAN",
    desc: "Membangun sayap punggung dan melebarkan diameter bahu samping.",
    alert: "💡 <strong>Aturan Khusus:</strong> Untuk pull-up, lakukan 2 repetisi bersih, lalu langsung sambung 3 repetisi negatif (turun 4 detik) menggunakan bantuan kursi.",
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
        image: "pull-up.png",
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
        image: "negative-pull-up.png",
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
        image: "pike-push-up.png",
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
        image: "single-arm-lateral-raise.png",
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
        image: "pull-up.png",
        tip: "Bungkukkan badan bertumpu pada kursi. Tarik tas ke arah pinggul (bukan ke dada) sambil merapatkan belikat untuk ketebalan sayap punggung."
      }
    ]
  },
  2: { // SELASA
    title: "Lower Body & Hip Shield",
    focus: "STABILITAS PINGGUL",
    desc: "Memperbaiki kelemahan pinggul lateral untuk kelincahan bela diri.",
    alert: "🛡️ <strong>Catatan Klinis:</strong> Gerakan hari ini dirancang tanpa benturan kejut (zero-impact) untuk mengobati radang tendon samping luar pinggul Anda.",
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
        image: "side-lying-hip-abduction.png",
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
        image: "isometric-glute-bridge.png",
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
        image: "bodyweight-box.png",
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
        image: "controlled-bodyweight-squat.png",
        tip: "Turun dalam 3 detik terkontrol. Pastikan lutut mengarah ke luar mengikuti jari kaki dan tidak menekuk ke dalam."
      }
    ]
  },
  3: { // RABU
    title: "Kardio Zona 2 (Rest Aktif)",
    focus: "OKSIDASI LEMAK",
    desc: "Jalan cepat 45 menit untuk membakar lemak tanpa merusak otot.",
    alert: "🚶 <strong>Metode Zona 2:</strong> Jangan berlari cepat atau sprint. Jalan cepat dengan napas stabil menjaga massa otot bahu dan tidak menghentak pinggul.",
    exercises: [
      {
        id: "brisk-walking",
        title: "Brisk Walking / Jalan Cepat",
        muscle: "Sistem Kardiorespirasi & Asam Lemak",
        equip: "Sepatu Lari",
        pattern: "Aerobic LISS",
        tempo: "115-130 BPM",
        sets: 1,
        targetReps: 45,
        defaultKg: 0,
        repsLabel: "40 – 45 Menit Nonstop",
        image: "controlled-bodyweight-squat.png",
        tip: "Pilih rute datar. Pertahankan kecepatan di mana Anda masih bisa berbicara 1 kalimat penuh tanpa terengah-engah. Target detak jantung 115-130 BPM."
      }
    ]
  },
  4: { // KAMIS
    title: "Upper B: Upper Chest & Bahu 3D",
    focus: "POSTUR TEGAK 3D",
    desc: "Mengisi dada bagian atas dan bahu belakang agar tidak bungkuk.",
    alert: "📐 <strong>Taper Tip:</strong> Dada atas yang terisi tebal akan membuat bahu terlihat terhubung kokoh ke leher, mempertegas siluet V.",
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
        image: "decline-push-up.png",
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
        image: "overhead-shoulder-press.png",
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
        image: "prone-ytw-raises.png",
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
        image: "incline-floor-press.png",
        tip: "Tidur di lantai dengan bantal menyangga punggung atas. Dorong tas ransel ke atas seperti dumbbell bench press."
      }
    ]
  },
  5: { // JUMAT
    title: "Full Core (TVA) & Pinggang Ramping",
    focus: "MENGECILKAN PINGGANG",
    desc: "Mengencangkan korset dinding perut alami untuk mengecilkan lingkar pinggang.",
    alert: "⏳ <strong>Korset Alami:</strong> Latihan Transverse Abdominis (TVA) terbukti mengecilkan perut buncit bawah lebih efektif daripada ribuan sit-up.",
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
        image: "stomach-vacuum.png",
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
        image: "posterior-pelvic-tilt.png",
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
        image: "controlled-deadbug.png",
        tip: "Tidur telentang, tempelkan seluruh punggung bawah ke lantai. Gerakkan tangan kanan dan kaki kiri bergantian secara lambat tanpa pinggang terangkat."
      }
    ]
  },
  6: { // SABTU
    title: "Kardio Zona 2 (Rest Aktif)",
    focus: "OKSIDASI LEMAK",
    desc: "Sesi kedua jalan cepat 45 menit untuk mempertahankan defisit mingguan.",
    alert: "👟 <strong>Konsistensi:</strong> Lakukan sesi ini di pagi hari sebelum sarapan atau sore hari.",
    exercises: [
      {
        id: "brisk-walking-2",
        title: "Brisk Walking / Jalan Cepat",
        muscle: "Defisit Kalori & Kesehatan Kardio",
        equip: "Sepatu Lari",
        pattern: "Aerobic LISS",
        tempo: "115-130 BPM",
        sets: 1,
        targetReps: 45,
        defaultKg: 0,
        repsLabel: "40 – 45 Menit Nonstop",
        image: "controlled-bodyweight-squat.png",
        tip: "Pertahankan ritme langkah cepat namun rileks. Jangan sampai detak jantung melonjak ke zona anaerobik."
      }
    ]
  },
  0: { // MINGGU
    title: "Full Rest & Pemulihan Otot",
    focus: "REGENERASI TOTAL",
    desc: "Otot bertumbuh saat Anda istirahat, bukan saat latihan.",
    alert: "🛌 <strong>Rest Protocol:</strong> Pastikan tidur 7–8 jam malam ini dan penuhi target 145g protein agar jaringan otot yang rusak terbangun lebih tebal.",
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
        image: "pull-up.png",
        tip: "Luangkan waktu untuk peregangan ringan atau jalan santai. Jangan lakukan angkat beban atau latihan intensitas tinggi hari ini."
      }
    ]
  }
};

// ==========================================
// 2. WEB AUDIO API SYNTHESIZER
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }
  playBeep(freq = 520, type = 'sine', duration = 0.12) {
    if (this.isMuted) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context may be restricted before user gesture
    }
  }
  playCelebration() {
    if (this.isMuted) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 'triangle', 0.22), idx * 110);
    });
    if ('vibrate' in navigator) {
      try { navigator.vibrate([100, 50, 150]); } catch (e) {}
    }
  }
}
const audio = new SoundSynth();

function toggleAudioMute() {
  audio.isMuted = !audio.isMuted;
  const btn = document.getElementById('btnAudioMute');
  if (audio.isMuted) {
    btn.innerHTML = '<i data-lucide="volume-x" class="w-4 h-4 text-zinc-400"></i>';
    btn.classList.add('bg-zinc-200');
  } else {
    btn.innerHTML = '<i data-lucide="volume-2" class="w-4 h-4 text-brand-crimson"></i>';
    btn.classList.remove('bg-zinc-200');
    audio.playBeep(600, 'sine', 0.1);
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 3. PERSISTENT STORAGE ENGINE
// ==========================================
const storage = {
  getDayData(dayIndex) {
    const key = `vtaper_day_data_${dayIndex}`;
    return JSON.parse(localStorage.getItem(key)) || {};
  },
  saveSetField(dayIndex, exerciseId, setNumber, field, value) {
    const key = `vtaper_day_data_${dayIndex}`;
    const data = this.getDayData(dayIndex);
    if (!data[exerciseId]) data[exerciseId] = {};
    if (!data[exerciseId][setNumber]) data[exerciseId][setNumber] = { kg: '', reps: '', done: false };
    data[exerciseId][setNumber][field] = value;
    localStorage.setItem(key, JSON.stringify(data));
  },
  getWeights() {
    return JSON.parse(localStorage.getItem('vtaper_weight_history')) || [
      { date: 'Start Baseline', weight: 79.0 }
    ];
  },
  saveWeight(val) {
    const list = this.getWeights();
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    list.unshift({ date: dateStr, weight: parseFloat(val) });
    localStorage.setItem('vtaper_weight_history', JSON.stringify(list));
  },
  getWater() {
    return parseFloat(localStorage.getItem('vtaper_water_val')) || 0;
  },
  saveWater(val) {
    localStorage.setItem('vtaper_water_val', val.toFixed(1));
  },
  getProtein() {
    return parseInt(localStorage.getItem('vtaper_protein_today')) || 0;
  },
  saveProtein(val) {
    localStorage.setItem('vtaper_protein_today', val);
  },
  getPainLevel() {
    return parseInt(localStorage.getItem('vtaper_pain_level')) || 4;
  },
  savePainLevel(val) {
    localStorage.setItem('vtaper_pain_level', val);
  }
};

// ==========================================
// 4. DAY SELECTION & SLIDE ANIMATION
// ==========================================
let currentSelectedDay = new Date().getDay(); // 0-6
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Senin -> Minggu

function selectDay(dayIndex, animate = false, direction = 'right') {
  currentSelectedDay = dayIndex;

  document.querySelectorAll('.day-btn').forEach(btn => {
    const bDay = parseInt(btn.getAttribute('data-day'));
    if (bDay === dayIndex) {
      btn.className = 'day-btn btn-spring flex-shrink-0 px-3.5 py-2 rounded-2xl font-black border transition flex flex-col items-center gap-0.5 min-w-[58px] bg-brand-crimson text-white border-brand-dark shadow-glow-sm scale-105';
    } else {
      btn.className = 'day-btn btn-spring flex-shrink-0 px-3.5 py-2 rounded-2xl font-bold border transition flex flex-col items-center gap-0.5 min-w-[58px] bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900';
    }
  });

  const session = WORKOUT_SCHEDULE[dayIndex];
  if (!session) return;

  document.getElementById('sessionTag').innerText = session.focus;
  document.getElementById('sessionTitle').innerText = session.title;
  document.getElementById('sessionDesc').innerText = session.desc;

  const alertEl = document.getElementById('sessionAlert');
  if (session.alert) {
    alertEl.innerHTML = session.alert;
    alertEl.classList.remove('hidden');
  } else {
    alertEl.classList.add('hidden');
  }

  const container = document.getElementById('workoutSwipeContainer');
  if (animate) {
    container.classList.remove('animate-slide-right', 'animate-slide-left');
    void container.offsetWidth;
    container.classList.add(direction === 'right' ? 'animate-slide-right' : 'animate-slide-left');
  }

  renderExercises(session.exercises, dayIndex);
  updateSessionProgress(dayIndex);
}

function goToNextDay() {
  const currentIdx = DAY_ORDER.indexOf(currentSelectedDay);
  const nextIdx = (currentIdx + 1) % DAY_ORDER.length;
  selectDay(DAY_ORDER[nextIdx], true, 'right');
  audio.playBeep(480, 'sine', 0.08);
}

function goToPrevDay() {
  const currentIdx = DAY_ORDER.indexOf(currentSelectedDay);
  const prevIdx = (currentIdx - 1 + DAY_ORDER.length) % DAY_ORDER.length;
  selectDay(DAY_ORDER[prevIdx], true, 'left');
  audio.playBeep(420, 'sine', 0.08);
}

// ==========================================
// 5. TOUCH GESTURE ENGINE (HORIZONTAL SWIPE)
// ==========================================
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function setupSwipeGestures() {
  const swipeTarget = document.getElementById('mainContainer');

  swipeTarget.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  swipeTarget.addEventListener('touchend', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });
}

function handleSwipeGesture() {
  const workoutView = document.getElementById('viewWorkout');
  if (workoutView.classList.contains('hidden')) return;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  const minHorizontalDistance = 45;
  if (Math.abs(deltaX) > minHorizontalDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
    if (deltaX < 0) {
      goToNextDay();
    } else {
      goToPrevDay();
    }
  }
}

// ==========================================
// 6. DETAILED EXERCISE CARD RENDERER
// ==========================================
function renderExercises(exercises, dayIndex) {
  const container = document.getElementById('exerciseList');
  container.innerHTML = '';

  const dayData = storage.getDayData(dayIndex);

  exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-card-soft space-y-3';

    let headerHTML = `
      <div class="flex gap-3 items-center">
        <div onclick="openExerciseModal('${ex.id}', ${dayIndex})" class="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex-shrink-0 cursor-pointer relative group shadow-sm">
          <img src="${ex.image}" alt="${ex.title}" class="w-full h-full object-cover group-hover:scale-105 transition" onerror="this.src='pull-up.png'">
          <div class="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <i data-lucide="zoom-in" class="w-4 h-4 text-white"></i>
          </div>
        </div>

        <div class="flex-1 min-w-0" onclick="openExerciseModal('${ex.id}', ${dayIndex})">
          <span class="text-[9px] font-mono uppercase tracking-wider text-brand-crimson font-black block truncate">${ex.muscle}</span>
          <h3 class="text-sm font-extrabold text-zinc-950 truncate hover:text-brand-crimson transition cursor-pointer">${ex.title}</h3>
          <p class="text-[11px] text-zinc-500 font-medium truncate mt-0.5">${ex.repsLabel}</p>
        </div>

        ${ex.hasNegativeTimer ? `
          <button onclick="openTimerModal('negative', 4)" class="btn-spring p-2 rounded-xl bg-red-50 text-brand-crimson border border-red-200" title="Buka Timer 4s Negatif">
            <i data-lucide="timer" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>
    `;

    let setRowsHTML = `
      <div class="space-y-1.5 pt-2 border-t border-zinc-100">
        <div class="grid grid-cols-12 text-[10px] font-mono font-bold text-zinc-400 px-1 mb-1">
          <span class="col-span-2 text-center">SET</span>
          <span class="col-span-4">BEBAN TAS</span>
          <span class="col-span-3">REPS</span>
          <span class="col-span-3 text-right">STATUS</span>
        </div>
    `;

    const exData = dayData[ex.id] || {};

    for (let s = 1; s <= ex.sets; s++) {
      const setItem = exData[s] || { kg: ex.defaultKg || '', reps: ex.targetReps || '', done: false };
      const isDone = setItem.done;

      setRowsHTML += `
        <div class="grid grid-cols-12 items-center gap-1.5 p-1.5 rounded-xl border transition ${
          isDone ? 'bg-red-50/60 border-red-200' : 'bg-surface-muted border-zinc-200/80'
        }">
          <span class="col-span-2 font-mono font-black text-xs text-center text-zinc-700">#${s}</span>
          
          <div class="col-span-4 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
            <input type="number" step="0.5" placeholder="${ex.defaultKg || 0}" value="${setItem.kg !== undefined ? setItem.kg : ''}" 
              oninput="updateSetKg(${dayIndex}, '${ex.id}', ${s}, this.value)" 
              class="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none">
            <span class="text-[9px] font-mono text-zinc-400 ml-1">kg</span>
          </div>

          <div class="col-span-3 flex items-center bg-white border border-zinc-200 rounded-lg px-2 py-1 shadow-sm">
            <input type="number" placeholder="${ex.targetReps}" value="${setItem.reps !== undefined ? setItem.reps : ''}" 
              oninput="updateSetReps(${dayIndex}, '${ex.id}', ${s}, this.value)" 
              class="w-full text-xs font-mono font-bold text-zinc-900 focus:outline-none">
          </div>

          <div class="col-span-3 text-right">
            <button onclick="toggleSetCheck(${dayIndex}, '${ex.id}', ${s}, this)" 
              class="btn-spring w-full py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1 transition ${
                isDone 
                  ? 'bg-brand-crimson text-white shadow-sm' 
                  : 'bg-white border border-zinc-300 text-zinc-600 hover:border-brand-crimson'
              }">
              ${isDone ? '✓ Done' : 'Check'}
            </button>
          </div>
        </div>
      `;
    }

    setRowsHTML += `</div>`;

    card.innerHTML = headerHTML + setRowsHTML;
    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function updateSetKg(dayIndex, exerciseId, setNumber, value) {
  storage.saveSetField(dayIndex, exerciseId, setNumber, 'kg', value);
}

function updateSetReps(dayIndex, exerciseId, setNumber, value) {
  storage.saveSetField(dayIndex, exerciseId, setNumber, 'reps', value);
}

function toggleSetCheck(dayIndex, exerciseId, setNumber, btnElement) {
  audio.playBeep(650, 'sine', 0.1);

  const dayData = storage.getDayData(dayIndex);
  const currentSet = (dayData[exerciseId] && dayData[exerciseId][setNumber]) || { done: false };
  const nextDone = !currentSet.done;

  storage.saveSetField(dayIndex, exerciseId, setNumber, 'done', nextDone);

  const parentRow = btnElement.closest('.grid');
  if (nextDone) {
    btnElement.className = 'btn-spring w-full py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1 transition bg-brand-crimson text-white shadow-sm';
    btnElement.innerText = '✓ Done';
    parentRow.className = 'grid grid-cols-12 items-center gap-1.5 p-1.5 rounded-xl border transition bg-red-50/60 border-red-200';
    
    const session = WORKOUT_SCHEDULE[dayIndex];
    const ex = session.exercises.find(e => e.id === exerciseId);
    if (setNumber < ex.sets) {
      setTimeout(() => openTimerModal('rest', 60), 250);
    }
  } else {
    btnElement.className = 'btn-spring w-full py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1 transition bg-white border border-zinc-300 text-zinc-600 hover:border-brand-crimson';
    btnElement.innerText = 'Check';
    parentRow.className = 'grid grid-cols-12 items-center gap-1.5 p-1.5 rounded-xl border transition bg-surface-muted border-zinc-200/80';
  }

  updateSessionProgress(dayIndex);
}

function updateSessionProgress(dayIndex) {
  const session = WORKOUT_SCHEDULE[dayIndex];
  if (!session) return;

  const dayData = storage.getDayData(dayIndex);
  let totalSets = 0;
  let doneSets = 0;

  session.exercises.forEach(ex => {
    totalSets += ex.sets;
    const exData = dayData[ex.id] || {};
    for (let s = 1; s <= ex.sets; s++) {
      if (exData[s] && exData[s].done) doneSets++;
    }
  });

  const percentage = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  document.getElementById('completionRate').innerText = `${percentage}% SELESAI`;
  document.getElementById('sessionProgressBar').style.width = `${percentage}%`;

  if (percentage === 100 && totalSets > 0) {
    audio.playCelebration();
  }
}

function finishTodayWorkout() {
  const session = WORKOUT_SCHEDULE[currentSelectedDay];
  let totalSets = 0;
  session.exercises.forEach(e => totalSets += e.sets);

  document.getElementById('finishTotalSets').innerText = `${totalSets} Set`;
  document.getElementById('finishModal').classList.remove('hidden');
  audio.playCelebration();
}

function closeFinishModal() {
  document.getElementById('finishModal').classList.add('hidden');
}

// ==========================================
// 7. MODALS: DETAIL GERAKAN & COUNTDOWN TIMER
// ==========================================
function openExerciseModal(exerciseId, dayIndex) {
  const session = WORKOUT_SCHEDULE[dayIndex];
  const ex = session.exercises.find(e => e.id === exerciseId);
  if (!ex) return;

  document.getElementById('modalMuscleTag').innerText = ex.muscle;
  document.getElementById('modalTitle').innerText = ex.title;

  // CLEAN TYPOGRAPHY (No &bull; bugs!)
  document.getElementById('modalRepsInfo').innerHTML = `
    <span class="inline-flex items-center gap-2 font-mono font-bold text-brand-crimson text-xs">
      <span>${ex.sets} Set Target</span>
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-brand-crimson"></span>
      <span>${ex.repsLabel}</span>
    </span>
  `;

  // Populate 3 Tactical Badges
  document.getElementById('modalEquip').innerText = ex.equip || 'Rumah';
  document.getElementById('modalPattern').innerText = ex.pattern || 'Bilateral';
  document.getElementById('modalTempo').innerText = ex.tempo || '2-0-1-0';

  document.getElementById('modalDescription').innerText = ex.tip;
  
  const imgEl = document.getElementById('modalImage');
  imgEl.src = ex.image;
  imgEl.onerror = () => { imgEl.src = 'pull-up.png'; };

  const negAction = document.getElementById('modalNegativeTimerAction');
  if (ex.hasNegativeTimer) {
    negAction.classList.remove('hidden');
  } else {
    negAction.classList.add('hidden');
  }

  document.getElementById('exerciseModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeExerciseModal() {
  document.getElementById('exerciseModal').classList.add('hidden');
}

// Timer Logic with Acoustic Negative Tempo Guidance
let timerInterval = null;
let timerSecondsRemaining = 60;
let timerTotalSeconds = 60;
let timerCurrentType = 'rest';
let isTimerRunning = false;

function openTimerModal(type = 'rest', duration = 60) {
  timerCurrentType = type;
  timerTotalSeconds = duration;
  timerSecondsRemaining = duration;

  const typeTag = document.getElementById('timerTypeTag');
  const quickBtns = document.getElementById('timerQuickButtons');

  if (type === 'negative') {
    typeTag.innerText = "TEMPO 4-DETIK NEGATIF";
    typeTag.className = "text-[10px] font-mono tracking-widest uppercase text-brand-crimson px-2.5 py-1 rounded-full bg-red-50 border border-red-200 font-bold";
    quickBtns.classList.add('hidden');
  } else {
    typeTag.innerText = "REST TIMER";
    typeTag.className = "text-[10px] font-mono tracking-widest uppercase text-brand-crimson px-2.5 py-1 rounded-full bg-red-50 border border-red-200 font-bold";
    quickBtns.classList.remove('hidden');
  }

  updateTimerDisplay();
  document.getElementById('timerModal').classList.remove('hidden');
  startTimer();
}

function closeTimerModal() {
  pauseTimer();
  document.getElementById('timerModal').classList.add('hidden');
}

function setTimerDuration(sec) {
  pauseTimer();
  timerTotalSeconds = sec;
  timerSecondsRemaining = sec;
  updateTimerDisplay();
  startTimer();
}

function updateTimerDisplay() {
  document.getElementById('timerNumber').innerText = timerSecondsRemaining;
  document.getElementById('quickTimerBadge').innerText = `${timerSecondsRemaining}s`;

  // Acoustic Tempo Guide for Negative Pull-ups (4, 3, 2, 1)
  if (timerCurrentType === 'negative') {
    if (timerSecondsRemaining === 4) audio.playBeep(750, 'sine', 0.12);
    else if (timerSecondsRemaining === 3) audio.playBeep(650, 'sine', 0.12);
    else if (timerSecondsRemaining === 2) audio.playBeep(550, 'sine', 0.12);
    else if (timerSecondsRemaining === 1) audio.playBeep(450, 'sine', 0.12);
  } else {
    // Normal rest timer beep on final 3 seconds
    if (timerSecondsRemaining <= 3 && timerSecondsRemaining > 0) {
      audio.playBeep(520, 'sine', 0.1);
    }
  }
}

function toggleTimer() {
  if (isTimerRunning) pauseTimer();
  else startTimer();
}

function startTimer() {
  pauseTimer();
  isTimerRunning = true;
  document.getElementById('timerToggleBtn').innerText = 'Jeda';
  document.getElementById('timerToggleBtn').className = 'btn-spring flex-1 py-3.5 rounded-2xl bg-zinc-900 text-white font-black text-xs shadow-sm transition';

  timerInterval = setInterval(() => {
    if (timerSecondsRemaining > 0) {
      timerSecondsRemaining--;
      updateTimerDisplay();
    } else {
      pauseTimer();
      audio.playCelebration();
      document.getElementById('timerToggleBtn').innerText = 'Mulai';
    }
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
  if (timerInterval) clearInterval(timerInterval);
  document.getElementById('timerToggleBtn').innerText = 'Mulai';
  document.getElementById('timerToggleBtn').className = 'btn-spring flex-1 py-3.5 rounded-2xl bg-brand-crimson text-white font-black text-xs shadow-glow-sm transition';
}

function resetTimer() {
  pauseTimer();
  timerSecondsRemaining = timerTotalSeconds;
  updateTimerDisplay();
}

// ==========================================
// 8. METRICS, MACROS & NUTRITION ENGINE
// ==========================================
function calculateSWR() {
  const shoulder = parseFloat(document.getElementById('inputShoulder').value) || 0;
  const waist = parseFloat(document.getElementById('inputWaist').value) || 1;

  const ratio = (shoulder / waist).toFixed(3);
  document.getElementById('swrBadge').innerText = ratio;
  document.getElementById('swrValue').innerText = ratio;

  const golden = 1.618;
  const percent = Math.min(100, Math.round((ratio / golden) * 100));
  document.getElementById('swrProgressBar').style.width = `${percent}%`;

  // Update Dynamic Doritos Silhouette Polygon
  updateTorsoPolygon(shoulder, waist);

  const adviceEl = document.getElementById('swrAdvice');
  if (ratio >= 1.618) {
    adviceEl.innerHTML = "🏆 <strong class='text-brand-crimson'>Rasio Emas Tercapai!</strong> Proporsi bahu ke pinggang Anda sudah berada dalam kategori V-Taper ideal.";
  } else {
    const diffWaist = Math.max(0, Math.round(waist - (shoulder / golden)));
    adviceEl.innerHTML = `Fokus Rekomposisi: Turunkan lingkar pinggang sebesar <strong>${diffWaist} cm</strong> lagi via defisit kalori & kencangkan otot sayap Lats.`;
  }
}

// Update the SVG Torso Polygon (Shoulder width at top, Waist width at bottom)
function updateTorsoPolygon(shoulder, waist) {
  const poly = document.getElementById('userTorsoPolygon');
  if (!poly) return;

  const centerX = 110;
  // Scaled coordinates based on real proportions
  const topHalfWidth = Math.min(95, Math.max(60, (shoulder / 170) * 125));
  const bottomHalfWidth = Math.min(85, Math.max(40, (waist / 170) * 110));

  const x1 = Math.round(centerX - topHalfWidth);
  const x2 = Math.round(centerX + topHalfWidth);
  const x3 = Math.round(centerX + bottomHalfWidth);
  const x4 = Math.round(centerX - bottomHalfWidth);

  poly.setAttribute('points', `${x1},15 ${x2},15 ${x3},95 ${x4},95`);
}

function logQuickProtein(amount, foodName) {
  let cur = storage.getProtein();
  cur += amount;
  storage.saveProtein(cur);
  updateProteinUI();
  audio.playBeep(700, 'sine', 0.1);
}

function updateProteinUI() {
  const val = storage.getProtein();
  document.getElementById('proteinLoggedDisplay').innerText = `${val} / 145g`;
}

function addWater(amount) {
  let cur = storage.getWater();
  cur = Math.min(5, cur + amount);
  storage.saveWater(cur);
  updateWaterUI();
}

function resetWater() {
  storage.saveWater(0);
  updateWaterUI();
}

function updateWaterUI() {
  const val = storage.getWater();
  document.getElementById('waterCount').innerText = `${val.toFixed(1)} / 3.0 Liter`;
}

function logWeight() {
  const input = document.getElementById('inputWeightLog');
  const val = parseFloat(input.value);
  if (!val || isNaN(val)) return;

  storage.saveWeight(val);
  input.value = '';
  renderWeightHistory();
  audio.playBeep(700, 'sine', 0.1);
}

function renderWeightHistory() {
  const container = document.getElementById('weightLogHistory');
  const list = storage.getWeights();
  container.innerHTML = '';

  list.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'flex justify-between py-1.5 border-b border-zinc-100 last:border-0';
    row.innerHTML = `
      <span class="text-zinc-500">${item.date}</span>
      <span class="font-bold ${idx === 0 ? 'text-brand-crimson' : 'text-zinc-800'}">${item.weight.toFixed(1)} kg</span>
    `;
    container.appendChild(row);
  });
}

function updatePainLevel(val) {
  storage.savePainLevel(val);
  document.getElementById('painLevelBadge').innerText = `Level ${val}/10`;
  const fb = document.getElementById('painFeedback');
  if (val <= 2) {
    fb.innerHTML = "🟢 <strong class='text-emerald-700'>Fase Aman:</strong> Tendon dalam kondisi baik. Anda dapat berlatih bela diri dengan kontrol.";
  } else if (val <= 5) {
    fb.innerHTML = "🟡 <strong class='text-amber-700'>Fase Waspada:</strong> Batasi tendangan melingkar tinggi atau pivot bertumpu 1 kaki.";
  } else {
    fb.innerHTML = "🔴 <strong class='text-brand-crimson'>Fase Radang Akut:</strong> Istirahat total dari tendangan. Fokus murni pada Side-Lying Hip Abduction!";
  }
}

// ==========================================
// 9. EXERCISE LIBRARY
// ==========================================
function renderLibrary() {
  const grid = document.getElementById('libraryGrid');
  grid.innerHTML = '';

  const allExercises = [];
  const seen = new Set();

  Object.values(WORKOUT_SCHEDULE).forEach(day => {
    day.exercises.forEach(ex => {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        allExercises.push(ex);
      }
    });
  });

  allExercises.forEach(ex => {
    const item = document.createElement('div');
    item.className = 'btn-spring p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-brand-crimson transition';
    item.onclick = () => openExerciseModal(ex.id, 1);
    item.innerHTML = `
      <div class="aspect-video w-full rounded-xl overflow-hidden bg-zinc-50 mb-2 border border-zinc-100">
        <img src="${ex.image}" alt="${ex.title}" class="w-full h-full object-cover" onerror="this.src='pull-up.png'">
      </div>
      <div>
        <span class="text-[8px] font-mono uppercase text-brand-crimson font-black block truncate">${ex.muscle}</span>
        <h4 class="text-xs font-black text-zinc-950 leading-tight truncate mt-0.5">${ex.title}</h4>
      </div>
    `;
    grid.appendChild(item);
  });

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 10. TAB NAVIGATION ROUTER
// ==========================================
function switchTab(tabName) {
  ['viewWorkout', 'viewMetrics', 'viewHip', 'viewLibrary'].forEach(v => {
    document.getElementById(v).classList.add('hidden');
  });

  ['navWorkout', 'navMetrics', 'navHip', 'navLibrary'].forEach(b => {
    document.getElementById(b).className = 'nav-btn btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-zinc-400 hover:text-zinc-700 font-bold';
  });

  if (tabName === 'workout') {
    document.getElementById('viewWorkout').classList.remove('hidden');
    document.getElementById('navWorkout').className = 'nav-btn btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-brand-crimson font-extrabold';
  } else if (tabName === 'metrics') {
    document.getElementById('viewMetrics').classList.remove('hidden');
    document.getElementById('navMetrics').className = 'nav-btn btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-brand-crimson font-extrabold';
    calculateSWR();
    updateWaterUI();
    updateProteinUI();
    renderWeightHistory();
  } else if (tabName === 'hip') {
    document.getElementById('viewHip').classList.remove('hidden');
    document.getElementById('navHip').className = 'nav-btn btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-brand-crimson font-extrabold';
    const pVal = storage.getPainLevel();
    document.getElementById('painSlider').value = pVal;
    updatePainLevel(pVal);
  } else if (tabName === 'library') {
    document.getElementById('viewLibrary').classList.remove('hidden');
    document.getElementById('navLibrary').className = 'nav-btn btn-spring flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-brand-crimson font-extrabold';
    renderLibrary();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 11. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  document.getElementById('currentDateDisplay').innerText = dateStr;

  document.getElementById('inputShoulder').addEventListener('input', calculateSWR);
  document.getElementById('inputWaist').addEventListener('input', calculateSWR);

  setupSwipeGestures();
  selectDay(currentSelectedDay);

  if (window.lucide) lucide.createIcons();
});
