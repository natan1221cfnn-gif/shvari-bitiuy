import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// מנוע צליל מתקדם – Web Audio API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class מנועצליל {
  private ctx: AudioContext | null = null;
  private עוצמה = 0.8;
  private רקעNodes: AudioNode[] = [];
  private רקעGain: GainNode | null = null;
  private רקעפועל = false;

  private get context(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(v: number) {
    this.עוצמה = v;
    if (this.רקעGain) {
      this.רקעGain.gain.setTargetAtTime(v * 0.08, this.context.currentTime, 0.1);
    }
  }

  private note(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.5,
    delay = 0,
    detune = 0
  ) {
    const ctx = this.context;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (detune) osc.detune.setValueAtTime(detune, t);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(this.עוצמה * gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(g);
    g.connect(comp);
    comp.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  // ─── הצלחה – אקורד C major מלא עם reverb ────────────────
  נגןהצלחה() {
    // Low bass hit
    this.note(130.81, 0.3, 'sine', 0.4, 0);
    // Major chord arpeggio
    this.note(261.63, 0.35, 'sine', 0.55, 0.02);
    this.note(329.63, 0.35, 'sine', 0.5, 0.06);
    this.note(392.0, 0.4, 'sine', 0.5, 0.10);
    this.note(523.25, 0.45, 'sine', 0.4, 0.14);
    // Shimmer
    this.note(1046.5, 0.3, 'sine', 0.2, 0.18);
    this.note(1568.0, 0.25, 'sine', 0.12, 0.22, 5);
  }

  // ─── קומבו – עולה עם כל מכפיל ──────────────────────────
  נגןקומבו(מכפיל: number) {
    const freqs = [349.23, 440, 523.25, 659.25, 783.99];
    for (let i = 0; i < Math.min(מכפיל, 5); i++) {
      this.note(freqs[i], 0.18, 'sine', 0.55, i * 0.065);
    }
    if (מכפיל >= 5) {
      this.note(1046.5, 0.4, 'sine', 0.3, 0.33);
    }
  }

  // ─── כישלון – טריטון יורד ───────────────────────────────
  נגןכישלון() {
    this.note(311, 0.12, 'sawtooth', 0.35, 0);
    this.note(233, 0.12, 'sawtooth', 0.3, 0.09);
    this.note(185, 0.3, 'sawtooth', 0.25, 0.18);
  }

  // ─── כמעט – בריק ידידותי ─────────────────────────────────
  נגןכמעט() {
    this.note(440, 0.08, 'sine', 0.4, 0);
    this.note(370, 0.12, 'sine', 0.3, 0.06);
  }

  // ─── מוקדם מדי – שני צלילים קטנים ────────────────────────
  נגןמוקדם() {
    this.note(350, 0.06, 'square', 0.2, 0);
    this.note(280, 0.1, 'square', 0.15, 0.05);
  }

  // ─── רמה חדשה – פנפרה עולה ──────────────────────────────
  נגןרמהחדשה() {
    const fanfare = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((f, i) => {
      this.note(f, 0.5, 'sine', 0.55, i * 0.075);
    });
    // Sustained chord finish
    [261.63, 392.0, 523.25].forEach((f, i) => {
      this.note(f, 0.8, 'sine', 0.25, 0.6 + i * 0.02);
    });
  }

  // ─── תקתוק ────────────────────────────────────────────────
  נגןתקתוק() {
    this.note(900, 0.035, 'square', 0.12, 0);
  }

  // ─── מוזיקת רקע (מושתק לחלוטין למניעת רעש רקע מיותר) ─────────────────
  הפעלרקע() {
    // מושתק לחלוטין – משחק נקי ללא רחשי רקע
  }

  עצוררקע() {
    this.רקעפועל = false;
  }
}

const מנוע = new מנועצליל();

export function useSound() {
  const { הגדרות } = useGameStore();

  const play = useCallback((fn: () => void) => {
    if (!הגדרות.סאונד) return;
    מנוע.setVolume(הגדרות.עוצמתסאונד);
    fn();
  }, [הגדרות.סאונד, הגדרות.עוצמתסאונד]);

  return {
    נגןהצלחה:    useCallback(() => play(() => מנוע.נגןהצלחה()), [play]),
    נגןקומבו:    useCallback((m: number) => play(() => מנוע.נגןקומבו(m)), [play]),
    נגןכישלון:   useCallback(() => play(() => מנוע.נגןכישלון()), [play]),
    נגןכמעט:     useCallback(() => play(() => מנוע.נגןכמעט()), [play]),
    נגןמוקדם:    useCallback(() => play(() => מנוע.נגןמוקדם()), [play]),
    נגןרמהחדשה:  useCallback(() => play(() => מנוע.נגןרמהחדשה()), [play]),
    נגןתקתוק:    useCallback(() => play(() => מנוע.נגןתקתוק()), [play]),
    הפעלמוזיקה:  useCallback(() => {
      if (!הגדרות.מוזיקה) return;
      מנוע.setVolume(הגדרות.עוצמתסאונד);
      מנוע.הפעלרקע();
    }, [הגדרות.מוזיקה, הגדרות.עוצמתסאונד]),
    עצורמוזיקה:  useCallback(() => מנוע.עצוררקע(), []),
  };
}
