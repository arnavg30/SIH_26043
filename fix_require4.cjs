const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace('require("./api")', 'await import("./api")');
code = code.replace('navigator.geolocation.getCurrentPosition((pos) => {', 'navigator.geolocation.getCurrentPosition(async (pos) => {');
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed ProblemsNearMeScreen");
