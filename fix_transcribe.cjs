const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');

code = code.replace(
  'form.append("file", fs.createReadStream(req.file.path));',
  'form.append("file", req.file.buffer, { filename: req.file.originalname || "audio.wav", contentType: req.file.mimetype || "audio/wav" });'
);

fs.writeFileSync('backend/server.js', code);
console.log('Fixed transcription bug');
