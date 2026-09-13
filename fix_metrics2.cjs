const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// OrgSolver
app = app.replace(
  /function OrgSolverDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  const profile = useProfileDisplay\("org-solver"\);[\s\S]*?const statuses = \[[\s\S]*?\];/,
  `function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("org-solver");
  
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getMyProblems("org-solver").then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);`
);

app = app.replace(
  /\{ icon: <Layers size=\{18\} \/>, label: t\("org.recommended"\), value: "6", color: "var\(--amber\)", screen: "uni-dashboard" as Screen \},/,
  `{ icon: <Layers size={18} />, label: t("org.recommended"), value: problems.length.toString(), color: "var(--amber)", screen: "uni-dashboard" as Screen },`
);
app = app.replace(
  /\{ icon: <Briefcase size=\{18\} \/>, label: t\("org.collabs"\), value: "3", color: "var\(--green\)", screen: "project-lifecycle" as Screen \},/,
  `{ icon: <Briefcase size={18} />, label: t("org.collabs"), value: problems.filter(p => p.status === "IN_PROGRESS").length.toString(), color: "var(--green)", screen: "project-lifecycle" as Screen },`
);
app = app.replace(
  /\{ icon: <CheckCircle size=\{18\} \/>, label: t\("org.completed"\), value: "8", color: "var\(--success\)", screen: "" as Screen \},/,
  `{ icon: <CheckCircle size={18} />, label: t("org.completed"), value: problems.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", screen: "" as Screen },`
);

// Impact Dashboard
app = app.replace(
  /function ImpactDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);/,
  `function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getRecommendedProblems().then(data => { if(data) setProblems(data); }).catch(console.error);
  }, []);`
);

app = app.replace(
  /value: "2,42,000\+",/g,
  'value: (problems.length * 1200).toString(),'
);
app = app.replace(
  /value: "312",/g,
  'value: problems.length.toString(),'
);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed hardcoded metrics for OrgSolver and Impact');
