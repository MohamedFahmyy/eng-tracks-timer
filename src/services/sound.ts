// Web Audio API based sound synthesizer for zero-dependency reliable alerts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTimerFinishSound(profile: 'melodic' | 'bell' | 'digital' | 'chime' = 'melodic', volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(volume, 1)), now);
    masterGain.connect(ctx.destination);

    if (profile === 'melodic' || profile === 'chime') {
      // 4-note ascending celestial chime: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.18);

        noteGain.gain.setValueAtTime(0, now + i * 0.18);
        noteGain.gain.linearRampToValueAtTime(0.5, now + i * 0.18 + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 1.6);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 1.7);
      });
    } else if (profile === 'bell') {
      // Deep resonant corporate bell with rich harmonics
      const baseFreq = 440;
      const harmonics = [1, 2.01, 3.01, 4.2];
      const gains = [0.6, 0.3, 0.15, 0.08];

      harmonics.forEach((h, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 3.1);
      });
    } else if (profile === 'digital') {
      // Modern digital multi-beep sequence
      [0, 0.18, 0.36, 0.54].forEach((tOffset, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(i === 3 ? 1200 : 880, now + tOffset);

        gain.gain.setValueAtTime(0.4, now + tOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOffset + 0.12);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now + tOffset);
        osc.stop(now + tOffset + 0.13);
      });
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

export function playTickSound(isWarning: boolean = false) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isWarning ? 880 : 440, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore audio permission error until user interacts
  }
}
