const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/voice_to_text.py', 'utf8');

const filterLogic = `
            # Catch common whisper hallucinations for short clips
            text_lower = text.lower().strip()
            hallucinations = ["thank you", "thanks for watching", "thank you very much", "you", "thank", "linear c", "subs by", "amara.org"]
            
            for h in hallucinations:
                if text_lower == h or text_lower == h + "." or text_lower.startswith(h):
                    if len(text_lower) < len(h) + 5: # If it's just the hallucination and nothing else
                        return "Error: Could not transcribe clearly. Please speak a longer sentence."
`;

code = code.replace(/            # Catch common whisper hallucinations for short clips[\s\S]*?return "Error: Could not transcribe clearly\. Please speak a longer sentence\."/g, filterLogic.trim());

fs.writeFileSync('../ai-service/ai_functions/voice_to_text.py', code);
console.log('Fixed hallucinations');
