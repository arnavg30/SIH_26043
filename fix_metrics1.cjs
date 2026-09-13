const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Citizen
app = app.replace(
  /function CitizenDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  const profile = useProfileDisplay\("citizen"\);[\s\S]*?const statuses = \[[\s\S]*?\];/,
  `function CitizenDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("citizen");
  
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getMyProblems("citizen").then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);

  const mitraGreeting = profile.name
    ? t("mitra.dash.greeting").replace("{name}", profile.name)
    : t("mitra.dash.greeting.generic");
    
  const statuses = [
    { icon: <SendHorizontal size={20} />, val: problems.length.toString(), key: "cit.submitted", color: "#1D4ED8" },
    { icon: <Clock size={20} />, val: problems.filter(p => p.status === "PENDING").length.toString(), key: "cit.underreview", color: "var(--warning)" },
    { icon: <Activity size={20} />, val: problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), key: "cit.inprogress", color: "var(--green)" },
    { icon: <CheckCircle size={20} />, val: problems.filter(p => p.status === "SOLVED").length.toString(), key: "cit.resolved", color: "var(--success)" },
  ];`
);

// Panchayat
app = app.replace(
  /function PanchayatDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  const profile = useProfileDisplay\("panchayat"\);[\s\S]*?const statuses = \[[\s\S]*?\];/,
  `function PanchayatDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("panchayat");
  
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getMyProblems("panchayat").then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);

  const statuses = [
    { label: "Total Problems", val: problems.length.toString(), color: "var(--navy)", icon: <Layers size={18} /> },
    { label: "Under Review", val: problems.filter(p => p.status === "PENDING").length.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: problems.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];`
);

// OrgVictim
app = app.replace(
  /function OrgVictimDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  const profile = useProfileDisplay\("localorg"\);[\s\S]*?const statuses = \[[\s\S]*?\];/,
  `function OrgVictimDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("localorg");
  
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => {
    getMyProblems("localorg").then(data => { if (data) setProblems(data.problems || []); }).catch(console.error);
  }, []);

  const statuses = [
    { label: "Total Reported", val: problems.length.toString(), color: "var(--navy)", icon: <FileText size={18} /> },
    { label: "Pending Review", val: problems.filter(p => p.status === "PENDING").length.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: problems.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];`
);

fs.writeFileSync('src/App.tsx', app);
console.log('Fixed hardcoded metrics for Citizen, Panchayat, OrgVictim');
