import { writeFileSync } from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;

function writeWav(filePath, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  writeFileSync(filePath, buffer);
}

function makeBuffer(seconds) {
  return new Float32Array(Math.floor(SAMPLE_RATE * seconds));
}

function addTone(buf, startSec, durSec, freq, amp, shape = "sine", attack = 0.005) {
  const startI = Math.floor(startSec * SAMPLE_RATE);
  const durI = Math.floor(durSec * SAMPLE_RATE);
  const attackI = Math.floor(attack * SAMPLE_RATE);
  for (let i = 0; i < durI; i++) {
    const idx = startI + i;
    if (idx < 0 || idx >= buf.length) continue;
    const t = i / SAMPLE_RATE;
    const env =
      i < attackI
        ? i / attackI
        : Math.exp(-3 * (i - attackI) / (durI - attackI || 1));
    let s;
    if (shape === "sine") s = Math.sin(2 * Math.PI * freq * t);
    else if (shape === "triangle") s = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t));
    else if (shape === "square") s = Math.sign(Math.sin(2 * Math.PI * freq * t)) * 0.6;
    else s = Math.sin(2 * Math.PI * freq * t);
    buf[idx] += s * env * amp;
  }
}

function addKick(buf, startSec, amp = 0.9) {
  const startI = Math.floor(startSec * SAMPLE_RATE);
  const durI = Math.floor(0.18 * SAMPLE_RATE);
  for (let i = 0; i < durI; i++) {
    const idx = startI + i;
    if (idx < 0 || idx >= buf.length) continue;
    const t = i / SAMPLE_RATE;
    const freq = 120 * Math.exp(-28 * t) + 40;
    const env = Math.exp(-14 * t);
    buf[idx] += Math.sin(2 * Math.PI * freq * t) * env * amp;
  }
}

function addNoiseHit(buf, startSec, durSec, amp) {
  const startI = Math.floor(startSec * SAMPLE_RATE);
  const durI = Math.floor(durSec * SAMPLE_RATE);
  for (let i = 0; i < durI; i++) {
    const idx = startI + i;
    if (idx < 0 || idx >= buf.length) continue;
    const env = Math.exp(-18 * (i / SAMPLE_RATE));
    buf[idx] += (Math.random() * 2 - 1) * env * amp;
  }
}

function normalize(buf, target = 0.85) {
  let max = 0;
  for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i]));
  if (max === 0) return;
  const g = target / max;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}

// ---- POP: bright, upbeat, four-on-the-floor, 2-bar loop @ 120bpm ----
function makePop() {
  const beat = 0.5; // 120bpm
  const barLen = beat * 4;
  const loopLen = barLen * 2;
  const buf = makeBuffer(loopLen);

  const arp = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  for (let bar = 0; bar < 2; bar++) {
    const barStart = bar * barLen;
    for (let b = 0; b < 4; b++) addKick(buf, barStart + b * beat, 0.8);
    for (let e = 0; e < 8; e++) {
      const t = barStart + e * (beat / 2);
      addTone(buf, t, beat / 2 - 0.02, arp[e % arp.length], 0.16, "square", 0.003);
    }
    addNoiseHit(buf, barStart + beat * 1, 0.05, 0.12);
    addNoiseHit(buf, barStart + beat * 3, 0.05, 0.12);
  }
  normalize(buf, 0.8);
  return buf;
}

// ---- JAZZ: mellow walking bass + soft chord pad, 2-bar loop @ 84bpm swing feel ----
function makeJazz() {
  const beat = 60 / 84;
  const barLen = beat * 4;
  const loopLen = barLen * 2;
  const buf = makeBuffer(loopLen);

  const bassLine = [
    [65.41, 82.41, 98.0, 110.0], // C2 E2 G2 A2
    [87.31, 110.0, 130.81, 146.83], // F2 A2 C3 D3
  ];
  const chord = [261.63, 311.13, 392.0, 466.16]; // Cm-ish soft chord tones

  for (let bar = 0; bar < 2; bar++) {
    const barStart = bar * barLen;
    const notes = bassLine[bar % bassLine.length];
    for (let b = 0; b < 4; b++) {
      addTone(buf, barStart + b * beat, beat * 0.85, notes[b], 0.3, "triangle", 0.01);
    }
    for (const f of chord) {
      addTone(buf, barStart, barLen * 0.95, f, 0.045, "sine", 0.25);
    }
    for (let e = 0; e < 8; e++) {
      const swingOffset = e % 2 === 1 ? beat * 0.16 : 0;
      const t = barStart + e * (beat / 2) + swingOffset;
      addNoiseHit(buf, t, 0.03, 0.035);
    }
  }
  normalize(buf, 0.75);
  return buf;
}

const outDir = path.join(process.cwd(), "public", "music");
writeWav(path.join(outDir, "pop.wav"), makePop());
writeWav(path.join(outDir, "jazz.wav"), makeJazz());
console.log("Wrote pop.wav and jazz.wav to", outDir);
