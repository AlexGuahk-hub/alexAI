export class AudioManager {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._bgmNode = null;
    this._bgmGain = null;
    this._sfxGain = null;
  }

  _init() {
    if (this._ctx) return;
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = 0.5;
    this._masterGain.connect(this._ctx.destination);

    this._bgmGain = this._ctx.createGain();
    this._bgmGain.gain.value = 0.4;
    this._bgmGain.connect(this._masterGain);

    this._sfxGain = this._ctx.createGain();
    this._sfxGain.gain.value = 0.6;
    this._sfxGain.connect(this._masterGain);
  }

  // Resume AudioContext on first user interaction
  resume() {
    this._init();
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
  }

  stopBgm() {
    if (this._bgmNode) {
      try { this._bgmNode.stop(); } catch (_) {}
      this._bgmNode = null;
    }
  }

  // Typing blip: short sine, random pitch
  playSfxTyping() {
    this._init();
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 200 + Math.random() * 300;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this._sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }

  // Menu cursor beep
  playSfxSelect() {
    this._init();
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this._sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  // Confirm action
  playSfxConfirm() {
    this._init();
    const ctx = this._ctx;
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.08;
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(this._sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  // Hit / damage
  playSfxHit() {
    this._init();
    const ctx = this._ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    gain.gain.value = 0.3;
    src.connect(gain);
    gain.connect(this._sfxGain);
    src.start(ctx.currentTime);
  }

  // Save point ascending arpeggio
  playSfxSave() {
    this._init();
    const ctx = this._ctx;
    const notes = [261, 330, 392, 523, 659];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.1;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this._sfxGain);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }
}
