const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /function ImpactDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  return \(/,
  `function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  const [problems, setProblems] = useState<any[]>([]);\n  useEffect(() => {\n    getRecommendedProblems().then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);\n  }, []);\n  return (`
);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed ImpactDashboard');
