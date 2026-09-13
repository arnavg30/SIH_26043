const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = 
function PanchayatDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, resetReport } = useApp();
  const profile = useProfileDisplay("panchayat");
  const [problems, setProblems] = useState<any[]>([]);
  
  useEffect(() => {
    import("./firebase/config").then(({ auth }) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fetch('/api/problems/my', {
            headers: { Authorization: \\\Bearer \\\\\\ }
          }).then(res => res.json()).then(data => {
            setProblems(data.problems || []);
          }).catch(console.error);
        }
      });
    });
  }, []);

  const total = problems.length;
  const underReview = problems.filter(p => p.status === 'UNDER_REVIEW').length;
  const inProgress = problems.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ASSIGNED').length;
  const resolved = problems.filter(p => p.status === 'SOLVED').length;

  const statuses = [
    { label: "Total Problems", val: total.toString(), color: "var(--navy)", icon: <Layers size={18} /> },
    { label: "Under Review", val: underReview.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: inProgress.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: resolved.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];
;

code = code.replace(/function PanchayatDashboardScreen.*?const statuses = \[.*?\];/s, replacement);

fs.writeFileSync('src/App.tsx', code);
