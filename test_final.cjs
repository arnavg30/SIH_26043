const fs = require('fs');
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (appTsx.includes('function FilteredProblemsList')) {
  console.log("FilteredProblemsList exists in App.tsx");
}
if (appTsx.includes('transcribeAudio')) {
  console.log("transcribeAudio exists in App.tsx");
}
const apiTs = fs.readFileSync('src/api.ts', 'utf8');
if (apiTs.includes('/api/transcribe')) {
  console.log("/api/transcribe exists in api.ts");
}
const serverJs = fs.readFileSync('backend/server.js', 'utf8');
if (serverJs.includes('/api/transcribe')) {
  console.log("/api/transcribe exists in server.js");
}
