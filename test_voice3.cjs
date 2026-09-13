const fs = require('fs');

const wavHeader = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20, 
  0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 
  0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00
]);
fs.writeFileSync('silence.wav', wavHeader);

(async () => {
  for (let i = 1; i <= 4; i++) {
    const fd = new FormData();
    const blob = new Blob([wavHeader], { type: 'audio/wav' });
    fd.append('file', blob, 'silence.wav');
    fd.append('language', 'hindi');
    
    try {
      const res = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      console.log(`Test ${i}: Transcribed text -> "${data.transcription}"`);
    } catch (err) {
      console.log(`Test ${i} Error:`, err.message);
    }
  }
})();
