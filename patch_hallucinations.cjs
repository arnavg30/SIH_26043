const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/voice_to_text.py', 'utf8');

code = code.replace(/hallucinations = \["Thank you\.", "Thank you", "Thank you for watching\.", "Thanks for watching\.", "Thank you very much\.", "You", "Thank"\]/g, 'hallucinations = ["Thank you.", "Thank you", "Thank you for watching.", "Thanks for watching.", "Thank you very much.", "You", "Thank", "Linear C.", "Linear C", "linear c"]');

fs.writeFileSync('../ai-service/ai_functions/voice_to_text.py', code);
console.log('Added Linear C to hallucinations');
