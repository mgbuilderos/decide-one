/**
 * Minimalist Web Audio API sound synthesizer
 * Zero external audio files required. Creates gentle, organic mechanical clicks.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = (type = 'click', isMuted = false) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'click') {
      // Very gentle high-frequency mechanical pen tap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'check') {
      // Pleasant subtle double-tone affirmation
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'page') {
      // Soft whisper noise simulating paper rustle
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.06);
    } else if (type === 'patron-chime') {
      // Resonant 3-tone harmonic arpeggio (C5 -> E5 -> G5)
      const frequencies = [523.25, 659.25, 783.99];
      frequencies.forEach((freq, idx) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const noteStart = now + (idx * 0.07);
        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, noteStart);
        noteGain.gain.setValueAtTime(0.04, noteStart);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(noteStart);
        noteOsc.stop(noteStart + 0.25);
      });
    } else if (type === 'singing-bowl' || type === 'closure') {
      // Tibetan Singing Bowl & Brass Meditation Gong (Executive Shutdown Complete)
      // Fundamental (216 Hz) + 2nd Harmonic (432 Hz) + 3rd Harmonic (648 Hz) + Soft Beat Frequency (218 Hz)
      const harmonics = [
        { freq: 216, gain: 0.08, decay: 2.8 },
        { freq: 218.5, gain: 0.06, decay: 2.5 }, // Slight beating frequency
        { freq: 432, gain: 0.04, decay: 2.0 },
        { freq: 648, gain: 0.02, decay: 1.5 },
        { freq: 864, gain: 0.01, decay: 1.0 }
      ];

      harmonics.forEach(h => {
        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        hOsc.type = 'sine';
        hOsc.frequency.setValueAtTime(h.freq, now);
        
        hGain.gain.setValueAtTime(h.gain, now);
        hGain.gain.exponentialRampToValueAtTime(0.00001, now + h.decay);

        hOsc.connect(hGain);
        hGain.connect(ctx.destination);
        hOsc.start(now);
        hOsc.stop(now + h.decay);
      });
    } else if (type === 'crown-ratchet') {
      // Horological rotary titanium detent tick (2400Hz + 1200Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.003);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.003);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.003);
    } else if (type === 'clasp-lock' || type === 'brass-clasp-lock') {
      // Precision brass clasp closure click + leather body thump
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1650, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.015);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.015);

      // Low damped leather body thump (68Hz)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(68, now);
      thudOsc.frequency.exponentialRampToValueAtTime(32, now + 0.065);
      thudGain.gain.setValueAtTime(0.045, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.065);
    } else if (type === 'pen-scratch' || type === 'fountain-pen-nib') {
      // Fountain pen nib friction on archival vellum
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2600;
      filter.Q.value = 1.8;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.018, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.04);
    }
  } catch {
    // Graceful silent fallback
  }
};
