const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /getRecommendedProblems\(\)\.then\(data => \{\s*setProblems\(data\.problems \|\| \[\]\);\s*\}\)\.catch\(console\.error\);/g;
code = code.replace(regex, "getRecommendedProblems().then(data => { setProblems(data.problems || []); }).catch(console.error); getMyProblems().then(data => { setMyProjects(data.problems || []); }).catch(console.error);");

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed fetches');
