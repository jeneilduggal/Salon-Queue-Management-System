/**
 * Browser Audio Chime synthesizer for queue calls
 * Uses Web Audio API — works offline and requires no external MP3 files.
 */
class ChimeSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playCallChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Two-tone bell chime (C5 -> G5)
      const tones = [
        { freq: 523.25, start: 0, duration: 0.4 }, // C5
        { freq: 783.99, start: 0.25, duration: 0.8 } // G5
      ];

      tones.forEach(tone => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now + tone.start);

        // Gentle envelope attack and decay
        gain.gain.setValueAtTime(0.001, now + tone.start);
        gain.gain.exponentialRampToValueAtTime(0.3, now + tone.start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tone.start + tone.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + tone.start);
        osc.stop(now + tone.start + tone.duration);
      });
    } catch (e) {
      console.warn("Audio chime playback blocked or not supported:", e);
    }
  }

  vibratePhone() {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  }
}

export const soundChime = new ChimeSynthesizer();
