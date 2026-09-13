const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\{profile\.detail \? \\ - \\\\ : ""\}/g, '{profile.detail ? " - " + profile.detail : ""}');
code = code.replace(/\{profile\.detail \? \\  \\\\ : ""\}/g, '{profile.detail ? " - " + profile.detail : ""}');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed profile.detail syntax error');
