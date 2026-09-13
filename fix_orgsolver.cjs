const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /function OrgSolverDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  const profile = useProfileDisplay\("org-solver"\);\n  return \(/,
  `function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  const profile = useProfileDisplay("org-solver");\n  const [problems, setProblems] = useState<any[]>([]);\n  useEffect(() => {\n    getRecommendedProblems().then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);\n  }, []);\n  return (`
);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed OrgSolver issues');
