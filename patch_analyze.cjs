const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');

code = code.replace(
  /existing = nearbyRes\.rows\.map\(r => \(\{ text: r\.description, location: "Nearby", coordinates: `\$\{r\.latitude\},\$\{r\.longitude\}` \}\)\);/g,
  'existing = nearbyRes.rows.map(r => ({ id: r.problem_code, text: r.description, location: "Nearby", coordinates: `${r.latitude},${r.longitude}` }));'
);

fs.writeFileSync('backend/server.js', code);
console.log('Fixed mapping existing_problems');
