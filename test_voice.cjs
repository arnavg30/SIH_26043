const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Create 1 second of silence in a valid WAV format
const wavHeader = Buffer.from([
  0x52, 0x49, 0x46, 0x46, // "RIFF"
  0x24, 0x00, 0x00, 0x00, // Chunk size
  0x57, 0x41, 0x56, 0x45, // "WAVE"
  0x66, 0x6d, 0x74, 0x20, // "fmt "
  0x10, 0x00, 0x00, 0x00, // Subchunk1Size (16)
  0x01, 0x00, 0x01, 0x00, // AudioFormat (1), NumChannels (1)
  0x44, 0xac, 0x00, 0x00, // SampleRate (44100)
  0x88, 0x58, 0x01, 0x00, // ByteRate
  0x02, 0x00, 0x10, 0x00, // BlockAlign (2), BitsPerSample (16)
  0x64, 0x61, 0x74, 0x61, // "data"
  0x00, 0x00, 0x00, 0x00  // Subchunk2Size (0 - just header)
]);

fs.writeFileSync('silence.wav', wavHeader);

(async () => {
  for (let i = 1; i <= 4; i++) {
    const form = new FormData();
    form.append('file', fs.createReadStream('silence.wav'));
    form.append('language', 'hindi');
    
    try {
      const res = await axios.post('http://localhost:8000/transcribe', form, {
        headers: form.getHeaders()
      });
      console.log(`Test ${i}: Transcribed text -> "${res.data.text}"`);
    } catch (err) {
      console.log(`Test ${i} Error:`, err.message);
    }
  }
})();
