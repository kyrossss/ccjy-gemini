/**
 * Zen Audio Synthesizer using Web Audio API
 * Generates delicate ambient tea kettle simmer and soft Tibetan/Zen singing bowl chime
 * Completely self-contained, no external audio files required.
 */

class ZenAudioManager {
  private ctx: AudioContext | null = null;
  private isSimmering: boolean = false;
  private simmerNodes: { noise: AudioNode; gain: GainNode } | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play gentle bell chime (warm bell harmonics)
  playZenChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 528; // Solfeggio 528Hz Miracle / Transformation tone
    const harmonics = [1, 2.76, 5.4, 8.9];

    harmonics.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * ratio, now);

      const decay = 2.5 / (index + 1);
      const amp = 0.15 / (index * 1.5 + 1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(amp, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  // Toggle water kettle gentle simmer loop
  toggleSimmer(forceState?: boolean): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    const targetState = forceState !== undefined ? forceState : !this.isSimmering;

    if (!targetState && this.simmerNodes) {
      try {
        const gain = this.simmerNodes.gain;
        gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
        setTimeout(() => {
          this.simmerNodes = null;
        }, 500);
      } catch {
        // ignore
      }
      this.isSimmering = false;
      return false;
    }

    if (targetState && !this.simmerNodes) {
      try {
        // Generate soft pink noise filtered for water simmer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.03;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.8);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start(0);
        this.simmerNodes = { noise: whiteNoise, gain };
        this.isSimmering = true;
        return true;
      } catch {
        this.isSimmering = false;
        return false;
      }
    }

    return this.isSimmering;
  }

  getSimmeringState(): boolean {
    return this.isSimmering;
  }
}

export const zenAudio = new ZenAudioManager();
