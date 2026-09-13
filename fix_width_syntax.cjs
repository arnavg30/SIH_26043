const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/style=\{\{ width: \\% \}\}/g, 'style={{ width: `${result.feasibility_score}%` }}');
code = code.replace(/style=\{\{ width: \\\\% \}\}/g, 'style={{ width: `${result.feasibility_score}%` }}');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed width syntax error');
