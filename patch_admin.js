const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'type Screen =\\n    | "landing"',
  'type Screen =\\n    | "landing"\\n    | "admin-dashboard"'
);

const adminScreen = 
// ─── ADMIN / GOVERNMENT DASHBOARD ───────────────────────────────────────────
function AdminDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  useEffect(() => {
    import("./firebase/config").then(({ auth }) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // just fetch all problems - we reuse my problems logic for now or we need a new route
          fetch('/api/problems/all', {
            headers: { Authorization: \\\Bearer \\\\\\ } // pseudo auth since it needs full token in real life
          }).catch(e=>console.log(e));
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="admin" screen="admin-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-black mb-4">Government / Admin Dashboard</h1>
        
        <Card className="p-5 mb-6">
          <h2 className="font-bold mb-3">Submitted Problems</h2>
          <div className="space-y-3">
             <div className="p-3 border rounded">
                <p><strong>Example Problem (SUBMITTED)</strong></p>
                <Btn size="sm">Manually Assign</Btn>
             </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold mb-3">Impact Reports</h2>
           <p className="text-sm text-gray-500">No reports generated yet.</p>
        </Card>
      </div>
    </div>
  );
}
;

code = code.replace('function App() {', adminScreen + '\\nfunction App() {');

// We also need to make App component render it
code = code.replace(
  'if (screen === "uni-project-detail") return <UniChallengeDetailScreen onNav={setScreen} />;',
  'if (screen === "uni-project-detail") return <UniChallengeDetailScreen onNav={setScreen} />;\\n  if (screen === "admin-dashboard") return <AdminDashboardScreen onNav={setScreen} />;'
);

fs.writeFileSync('src/App.tsx', code);
