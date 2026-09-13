const fs = require('fs');
let c = fs.readFileSync('src/api.ts', 'utf8');
c = c.replace('apiFetch(/api/problems/);', 'apiFetch("/api/problems/");');
fs.writeFileSync('src/api.ts', c);
