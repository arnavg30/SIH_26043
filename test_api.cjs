const fs = require('fs');
const apiTs = fs.readFileSync('src/api.ts', 'utf8');
if (apiTs.includes('authStateReady')) {
  console.log("authStateReady used");
} else {
  console.log("not used");
}
