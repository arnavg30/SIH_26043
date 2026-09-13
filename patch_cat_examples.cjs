const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/categorization.py', 'utf8');

code = code.replace(/"duplicateOfId": 404,/g, '"duplicateOfId": "JH-ABC-1234",');
code = code.replace(/- duplicateOfId \(Integer or null\): Always null\./g, '- duplicateOfId (String or null): Always null.');

fs.writeFileSync('../ai-service/ai_functions/categorization.py', code);
console.log('Fixed example types');
