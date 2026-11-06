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

  private continuousSimmerNodes: {
    noiseSource: AudioBufferSourceNode;
    gain: GainNode;
    kettleTone: OscillatorNode;
    kettleGain: GainNode;
  } | null = null;
  private isContinuousSimmering: boolean = false;
  private simmerFadeTimeout: ReturnType<typeof setTimeout> | null = null;

  // Play simulated boiling water / pine wind kettle simmer sound (候汤之声 - 蟹眼松风水沸声)
  playPineWindBoilingWater(durationSeconds: number = 3.8): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const sampleRate = ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * Math.min(8, durationSeconds));
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink & brown noise mixed with water bubbling frequency modulations
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        // Introduce small periodic bubble pulses
        const bubbleFlutter = 1 + 0.18 * Math.sin(i * 0.003) * Math.sin(i * 0.0007);
        output[i] = (b0 + b1 + b2 + b3 + b4 + white * 0.4) * 0.05 * bubbleFlutter;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass filter to isolate characteristic sound of boiling spring in a clay kettle
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(680, now);
      bandpass.frequency.exponentialRampToValueAtTime(880, now + durationSeconds * 0.6);
      bandpass.Q.setValueAtTime(1.8, now);

      // Lowpass to give warm, deep ceramic pot resonance
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1200, now);

      // Gentle gain envelope with fade-in and graceful fade-out
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.5);
      gain.gain.setValueAtTime(0.14, now + Math.max(0.6, durationSeconds - 0.9));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      // Subtle warm undertone oscillator simulating clay pot "松风" singing kettle hum
      const kettleTone = ctx.createOscillator();
      const kettleGain = ctx.createGain();
      kettleTone.type = 'sine';
      kettleTone.frequency.setValueAtTime(432, now); // 432Hz natural frequency
      kettleTone.frequency.exponentialRampToValueAtTime(440, now + durationSeconds);

      kettleGain.gain.setValueAtTime(0.0001, now);
      kettleGain.gain.exponentialRampToValueAtTime(0.025, now + 0.6);
      kettleGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      kettleTone.connect(kettleGain);
      kettleGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + durationSeconds);
      kettleTone.start(now);
      kettleTone.stop(now + durationSeconds);
    } catch {
      // AudioContext fallback handled silently
    }
  }

  /**
   * 启动基于 Web Audio API 的持续轻量‘候汤之声’（模拟水开的微浪与松风蟹眼沸水音效）
   * 可持续循环伴随烹泉进度，直至在预定时间点触发自动平滑淡出
   */
  startContinuousSimmer(options?: { volume?: number }): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (this.isContinuousSimmering && this.continuousSimmerNodes) {
      return true;
    }

    try {
      if (this.simmerFadeTimeout) {
        clearTimeout(this.simmerFadeTimeout);
        this.simmerFadeTimeout = null;
      }

      const sampleRate = ctx.sampleRate;
      // 4-second loopable organic water texture buffer
      const bufferSize = sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const flutter = 1 + 0.15 * Math.sin(i * 0.0028) * Math.cos(i * 0.00063);
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.35) * 0.038 * flutter;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(740, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.6, ctx.currentTime);

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1150, ctx.currentTime);

      const targetGain = options?.volume ?? 0.12;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(targetGain, ctx.currentTime + 1.2);

      // Subtle warm pine-wind singing kettle undertone
      const kettleTone = ctx.createOscillator();
      const kettleGain = ctx.createGain();
      kettleTone.type = 'sine';
      kettleTone.frequency.setValueAtTime(436, ctx.currentTime);

      kettleGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      kettleGain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 1.5);

      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      kettleTone.connect(kettleGain);
      kettleGain.connect(ctx.destination);

      noiseSource.start(0);
      kettleTone.start(0);

      this.continuousSimmerNodes = {
        noiseSource,
        gain,
        kettleTone,
        kettleGain,
      };
      this.isContinuousSimmering = true;
      return true;
    } catch {
      this.isContinuousSimmering = false;
      return false;
    }
  }

  /**
   * 平滑淡出并停止候汤之声（支持指定淡出时长，自动释放资源）
   */
  stopContinuousSimmer(fadeSeconds: number = 2.0, onFadeOutComplete?: () => void): void {
    if (!this.isContinuousSimmering || !this.continuousSimmerNodes) {
      this.isContinuousSimmering = false;
      return;
    }

    const ctx = this.getContext();
    if (!ctx) {
      this.isContinuousSimmering = false;
      return;
    }

    try {
      const { gain, kettleGain, noiseSource, kettleTone } = this.continuousSimmerNodes;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);

      kettleGain.gain.setValueAtTime(kettleGain.gain.value, now);
      kettleGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);

      this.simmerFadeTimeout = setTimeout(() => {
        try {
          noiseSource.stop();
          kettleTone.stop();
          noiseSource.disconnect();
          kettleTone.disconnect();
        } catch {
          // already stopped
        }
        this.continuousSimmerNodes = null;
        this.isContinuousSimmering = false;
        this.simmerFadeTimeout = null;
        onFadeOutComplete?.();
      }, fadeSeconds * 1000 + 100);
    } catch {
      this.continuousSimmerNodes = null;
      this.isContinuousSimmering = false;
    }
  }

  /**
   * 查询当前持续候汤之声是否处于播放中
   */
  isContinuousSimmerActive(): boolean {
    return this.isContinuousSimmering;
  }

  getSimmeringState(): boolean {
    return this.isSimmering;
  }
}

export const zenAudio = new ZenAudioManager();

