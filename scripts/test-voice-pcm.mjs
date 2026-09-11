import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { encodeRecordedAudio } from '../src/utils/recordedAudio.ts';

let Processor;
const messages = [];
vm.runInNewContext(await readFile(new URL('../src/audio/voice-recorder-worklet.js', import.meta.url), 'utf8'), {
  AudioWorkletProcessor: class { constructor() { this.port = { postMessage: data => messages.push(data) }; } },
  registerProcessor: (_, implementation) => { Processor = implementation; },
  Float32Array,
});
const processor = new Processor();
// Cross the 4096-sample flush boundary, leaving a partial block at Stop.
for (let index = 0; index < 35; index++) {
  processor.process([[new Float32Array(128).fill(1), new Float32Array(128).fill(-0.5)]]);
}
processor.port.onmessage({ data: 'stop' });
assert.equal(messages.at(-1).type, 'stopped');
const chunks = messages.filter(message => message.type === 'samples').map(message => message.samples);
assert.equal(chunks.reduce((total, chunk) => total + chunk.length, 0), 4480);
assert.ok(chunks.every(chunk => chunk.every(sample => sample === 0.25)), 'Stereo channels mix correctly');
const { blob, duration } = encodeRecordedAudio(chunks, 48000);
const wav = new DataView(await blob.arrayBuffer());
assert.equal(blob.type, 'audio/wav');
assert.equal(blob.size, 44 + 4480 * 2);
assert.equal(wav.getUint32(4, true), blob.size - 8);
assert.equal(wav.getUint32(40, true), blob.size - 44);
assert.equal(wav.getUint32(24, true), 48000);
assert.equal(wav.getInt16(44, true), 8191);
assert.equal(duration, 4480 / 48000);
const count = messages.length;
processor.process([[new Float32Array(128).fill(1)]]);
processor.port.onmessage({ data: 'stop' });
assert.equal(messages.length, count, 'No samples after Stop, and no duplicate finalization');
assert.throws(() => encodeRecordedAudio([], 48000), /No audio/);
console.log('PCM capture, final partial block, WAV header/duration, stereo mixing, empty capture: PASS');
