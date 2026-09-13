const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function OrgSolverDashboardScreen(')) {
    lines.splice(i+3, 0, '  const [problems, setProblems] = useState<any[]>([]);', '  useEffect(() => { getRecommendedProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);');
    break;
  }
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function ImpactDashboardScreen(')) {
    lines.splice(i+2, 0, '  const [problems, setProblems] = useState<any[]>([]);', '  useEffect(() => { getRecommendedProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);');
    break;
  }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed with splice');
