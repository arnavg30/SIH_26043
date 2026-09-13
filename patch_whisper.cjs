const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/voice_to_text.py', 'utf8');

code = code.replace(/whisper\.load_model\("large-v3"\)/g, 'whisper.load_model("large")');

fs.writeFileSync('../ai-service/ai_functions/voice_to_text.py', code);
console.log('Switched to large');
