class SoundSynth {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public playBeep(freq = 520, type: OscillatorType = 'sine', duration = 0.12) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
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
    } catch {
      // Audio blocked before user gesture
    }
  }

  public playCelebration() {
    if (this.isMuted) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 'triangle', 0.22), idx * 110);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {
        // Haptic optional
      }
    }
  }

  public playMilestone1KmAlert() {
    if (this.isMuted) return;
    // Ascending double chime for 1KM accomplishment
    [587.33, 880.00, 1174.66].forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 'sine', 0.18), idx * 130);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Haptic optional
      }
    }
  }

  public playNegativeTick(secondsRemaining: number) {
    if (secondsRemaining === 4) this.playBeep(750, 'sine', 0.14);
    else if (secondsRemaining === 3) this.playBeep(650, 'sine', 0.14);
    else if (secondsRemaining === 2) this.playBeep(550, 'sine', 0.14);
    else if (secondsRemaining === 1) this.playBeep(450, 'sine', 0.14);
    else if (secondsRemaining === 0) this.playCelebration();
  }
}

export const sound = new SoundSynth();
