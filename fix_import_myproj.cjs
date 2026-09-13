const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('getMyProblems')) {
    code = code.replace(
      /getRecommendedProblems,/,
      'getRecommendedProblems,\n  getMyProblems,'
    );
}
fs.writeFileSync('src/App.tsx', code);
console.log('Added getMyProblems import');
