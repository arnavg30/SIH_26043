const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/type Screen = "solver-dashboard" \|\r?\n\s*\| "landing"/, 'type Screen = "solver-dashboard" | "landing"');
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Screen');
