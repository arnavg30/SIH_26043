const fs = require('fs');
let c = fs.readFileSync('src/api.ts', 'utf8');
c = c.replace(/apiFetch\(\/api\/problems\/nearby\?lat=\$\{lat\}&lng=\$\{lng\}\)/g, 'apiFetch(`/api/problems/nearby?lat=${lat}&lng=${lng}`)');
fs.writeFileSync('src/api.ts', c);
