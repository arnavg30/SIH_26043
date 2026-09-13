
const fs = require('fs');
let bak = fs.readFileSync('src/App.tsx.bak', 'utf8');
const p1 = bak.indexOf('function UniDashboardScreen(');
const p2 = bak.indexOf('export default function App() {');
const missingCode = bak.substring(p1, p2);
fs.writeFileSync('missing_screens.tsx', missingCode);

