const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '(pos) => {\n          const { getProblemsNearMe }',
  'async (pos) => {\n          const { getProblemsNearMe }'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed ProblemsNearMeScreen async.");
