/**
 * Synthesizer sound engine leveraging Web Audio API.
 * Generates procedural audio chimes for rest countdowns, tempo pacing, and 1KM distance milestones.
 */

class SoundSynthesizerService {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playBeep(freq = 520, type: OscillatorType = 'sine', duration = 0.12): void {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

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
      // Audio autoplay restrictions before initial user gesture
    }
  }

  public playCelebration(): void {
    if (this.isMuted) return;
    const celebrationNotes = [523.25, 659.25, 783.99, 1046.5];
    celebrationNotes.forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 'triangle', 0.22), idx * 110);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {
        // Haptic feedback fallback
      }
    }
  }

  public playMilestone1KmAlert(): void {
    if (this.isMuted) return;
    // Ascending melodic chime for 1KM accomplishment
    const milestoneNotes = [587.33, 880.0, 1174.66];
    milestoneNotes.forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 'sine', 0.18), idx * 130);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Haptic feedback fallback
      }
    }
  }

  public playNegativeTick(secondsRemaining: number): void {
    if (secondsRemaining === 4) this.playBeep(750, 'sine', 0.14);
    else if (secondsRemaining === 3) this.playBeep(650, 'sine', 0.14);
    else if (secondsRemaining === 2) this.playBeep(550, 'sine', 0.14);
    else if (secondsRemaining === 1) this.playBeep(450, 'sine', 0.14);
    else if (secondsRemaining === 0) this.playCelebration();
  }
}

export const soundSynthService = new SoundSynthesizerService();
