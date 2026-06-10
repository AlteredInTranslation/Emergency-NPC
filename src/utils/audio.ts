/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural sound effects using the Web Audio API
class AudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (common browser security policy)
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // d25/d20 Dice rolling rumble sound using filtered white noise or rapid pitch swings
  playDiceRoll() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.5;

      // Simulate series of quick clicks or tumbling bleeps
      for (let i = 0; i < 8; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Tumbling pitch downwards
        osc.type = "sine";
        osc.frequency.setValueAtTime(150 + Math.random() * 200, now + i * 0.06);
        osc.frequency.exponentialRampToValueAtTime(80, now + i * 0.06 + 0.05);

        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.05);
      }
    } catch (e) {
      // Audio context might fail on some platforms
    }
  }

  // Quick positive chime on single-trait roll
  playSingleChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Successful NPC muster golden fanfare
  playMusterSuccess() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Chords sequence: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Soft festive triangle/sine wave
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        
        gain.gain.setValueAtTime(0.0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.5);
      });
    } catch (e) {}
  }

  // Whisper click for toggling quest hints
  playWhisper() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }
}

export const synth = new AudioSynth();
