const fs = require('fs');
let c = fs.readFileSync('src/api.ts', 'utf8');
let lines = c.split('\n');
lines[239] = '  const res = await apiFetch(`/api/problems/nearby?lat=${lat}&lng=${lng}`);';
fs.writeFileSync('src/api.ts', lines.join('\n'));
