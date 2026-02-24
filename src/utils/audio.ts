const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playNote = (frequency: number, type: OscillatorType = 'sine') => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
};

export const NOTES = [
  { id: 'G3', name: 'G', freq: 196.00, color: '#ef4444', y: 50, hand: 'left', stem: 'down' },
  { id: 'A3', name: 'A', freq: 220.00, color: '#f97316', y: 40, hand: 'left', stem: 'down' },
  { id: 'B3', name: 'B', freq: 246.94, color: '#eab308', y: 30, hand: 'left', stem: 'down' },
  { id: 'C4', name: 'C', freq: 261.63, color: '#22c55e', y: 140, hand: 'right', stem: 'up' },
  { id: 'D4', name: 'D', freq: 293.66, color: '#3b82f6', y: 130, hand: 'right', stem: 'up' },
  { id: 'E4', name: 'E', freq: 329.63, color: '#6366f1', y: 120, hand: 'right', stem: 'up' },
  { id: 'F4', name: 'F', freq: 349.23, color: '#a855f7', y: 110, hand: 'right', stem: 'up' },
];


