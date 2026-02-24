const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

const playPianoLikeNote = async (
  frequency: number,
  duration = 1.8,
  velocity = 0.7
) => {
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  // 主音量包络：更平滑，减少“突然分段”
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);

  const peak = Math.max(0.15, Math.min(0.9, velocity));
  masterGain.gain.exponentialRampToValueAtTime(peak, now + 0.012);              // attack 稍慢一点
  masterGain.gain.exponentialRampToValueAtTime(peak * 0.55, now + 0.20);        // decay 更慢
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);          // release

  // 滤波：稍微柔化高频
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(4200, now);
  lowpass.Q.setValueAtTime(0.5, now);

  masterGain.connect(lowpass);
  lowpass.connect(audioCtx.destination);

  // 泛音：减少 detune，延长高次泛音衰减，降低“前后两段”对比
  const partials = [
    { ratio: 1, gain: 1.0, detune: 0 },
    { ratio: 2, gain: 0.28, detune: 0.8 },
    { ratio: 3, gain: 0.12, detune: -1.0 },
    { ratio: 4, gain: 0.06, detune: 0.6 },
  ];

  for (const p of partials) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    // triangle 比 sine 更有质感；如果你觉得还是“分层”，可试试 sine
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency * p.ratio, now);
    osc.detune.setValueAtTime(p.detune, now);

    // 单独泛音包络：和主包络更接近，不要衰减太快
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak * p.gain, now + 0.01);

    // 高频仍然更快衰减，但不要快到“像切段”
    const partialEnd =
      p.ratio === 1
        ? now + duration
        : now + Math.max(0.35, duration * (0.9 - (p.ratio - 1) * 0.12));

    g.gain.exponentialRampToValueAtTime(0.001, partialEnd);

    osc.connect(g);
    g.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 击槌噪声：减弱很多（如果仍有分段感，可直接删除这一整段）
  const addHammerNoise = false; // ← 先关掉试试，通常会更顺

  if (addHammerNoise) {
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.012); // 12ms，缩短
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.Q.setValueAtTime(0.8, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.008, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.015);
  }
};

export const playNote = playPianoLikeNote;

// export const playNote = (frequency: number, type: OscillatorType = 'sine') => {
//   if (audioCtx.state === 'suspended') {
//     audioCtx.resume();
//   }
  
//   const oscillator = audioCtx.createOscillator();
//   const gainNode = audioCtx.createGain();

//   oscillator.type = type;
//   oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

//   gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

//   oscillator.connect(gainNode);
//   gainNode.connect(audioCtx.destination);

//   oscillator.start();
//   oscillator.stop(audioCtx.currentTime + 1);
// };

export const NOTES = [
  { id: 'G3', name: 'G', freq: 196.00, color: '#ef4444', y: 50, hand: 'left', stem: 'down' },
  { id: 'A3', name: 'A', freq: 220.00, color: '#f97316', y: 40, hand: 'left', stem: 'down' },
  { id: 'B3', name: 'B', freq: 246.94, color: '#eab308', y: 30, hand: 'left', stem: 'down' },
  { id: 'C4', name: 'C', freq: 261.63, color: '#22c55e', y: 140, hand: 'right', stem: 'up' },
  { id: 'D4', name: 'D', freq: 293.66, color: '#3b82f6', y: 130, hand: 'right', stem: 'up' },
  { id: 'E4', name: 'E', freq: 329.63, color: '#6366f1', y: 120, hand: 'right', stem: 'up' },
  { id: 'F4', name: 'F', freq: 349.23, color: '#a855f7', y: 110, hand: 'right', stem: 'up' },
] as const;