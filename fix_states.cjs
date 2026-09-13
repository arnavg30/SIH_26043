const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \[problems, setProblems\] = useState<any\[\]>\(\[\]\);/g, 'const [problems, setProblems] = useState<any[]>([]);\n  const [myProjects, setMyProjects] = useState<any[]>([]);');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed states');
