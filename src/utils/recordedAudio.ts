/** Encode raw mono samples directly as PCM16 WAV, without a codec decoder. */
export function encodeRecordedAudio(chunks: Float32Array[], sampleRate: number): { blob: Blob; duration: number } {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  if (!length || !Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error("No audio was captured. Check your microphone and record again.");
  }
  const wav = new ArrayBuffer(44 + length * 2);
  const view = new DataView(wav);
  const writeText = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index++) view.setUint8(offset + index, value.charCodeAt(index));
  };
  writeText(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, length * 2, true);
  let offset = 44;
  for (const chunk of chunks) {
    for (const value of chunk) {
      const sample = Number.isFinite(value) ? Math.max(-1, Math.min(1, value)) : 0;
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return { blob: new Blob([wav], { type: "audio/wav" }), duration: length / sampleRate };
}
