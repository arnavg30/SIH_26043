const fs = require('fs');
let code = fs.readFileSync('../ai-service/ai_functions/categorization.py', 'utf8');

code = code.replace(/if dist <= 500:/g, 'if dist <= 2000:');
code = code.replace(/Your only task is to determine if they describe the SAME underlying issue \(semantic similarity\), regardless of exact wording\./g, 'Your only task is to determine if they describe the SAME underlying issue, regardless of exact wording. If there is a 70% or higher semantic overlap/similarity in the problem described, you MUST flag it as a duplicate (isDuplicate: true).');

// Wait, the duplicateOfId type is Integer or null, but our problem_code is a STRING (e.g. "JH-AGRI-1234").
code = code.replace(/- duplicateOfId \(Integer or null\): The ID of the existing problem if duplicate, otherwise null\./g, '- duplicateOfId (String or null): The ID of the existing problem if duplicate, otherwise null.');
code = code.replace(/"duplicateOfId": 123_or_null,/g, '"duplicateOfId": "ID_String_or_null",');

fs.writeFileSync('../ai-service/ai_functions/categorization.py', code);
console.log('Fixed categorization.py');
