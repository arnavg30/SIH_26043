const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/voice_to_text.py', 'utf8');

code = code.replace(
  'WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL_NAME", "base")',
  'WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL_NAME", "small")'
);

fs.writeFileSync('../ai-service/ai_functions/voice_to_text.py', code);
console.log("Updated Whisper model to small");
