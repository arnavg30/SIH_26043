const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[problems, setProblems\] = useState<any\[\]>\(\[\]\);/g,
  'const [problems, setProblems] = useState<any[]>([]);\n  const [myProjects, setMyProjects] = useState<any[]>([]);'
);

code = code.replace(
  /getRecommendedProblems\(\)\.then\(data => \{\n\s*setProblems\(data\.problems \|\| \[\]\);\n\s*\}\)\.catch\(console\.error\);/g,
  'getRecommendedProblems().then(data => {\n            setProblems(data.problems || []);\n          }).catch(console.error);\n          getMyProblems().then(data => {\n            setMyProjects(data.problems || []);\n          }).catch(console.error);'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed myProjects definition and API call');
