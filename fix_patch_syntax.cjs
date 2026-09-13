const fs = require('fs');
let code = fs.readFileSync('patch_app.js', 'utf8');
code = code.replace(/style=\{\{ width: \\\\%\\\\ \}\}/g, 'style={{ width: `${result.feasibility_score}%` }}');
fs.writeFileSync('patch_app.js', code);
console.log('Fixed syntax error in patch_app.js');
