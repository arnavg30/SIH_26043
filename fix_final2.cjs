const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// For OrgSolver
let target1 = `function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("org-solver");
  return (`;

let rep1 = `function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("org-solver");
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getRecommendedProblems().then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);
  return (`;

app = app.replace(target1, rep1);

// For Impact
let target2 = `function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (`;

let rep2 = `function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getRecommendedProblems().then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);
  return (`;

app = app.replace(target2, rep2);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed exactly');
