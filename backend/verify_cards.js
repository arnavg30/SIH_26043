const fs = require('fs');
const appTsx = fs.readFileSync('../src/App.tsx', 'utf8');

console.log("FilteredProblemsList component exists:", appTsx.includes('function FilteredProblemsList'));
console.log("Dashboard click handler injected:", appTsx.includes('onClick={() => setSelectedFilter({'));
