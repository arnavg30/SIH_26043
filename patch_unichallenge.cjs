const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function UniChallengeDetailScreen({';
const endFunction = 'function TeamFormationScreen({';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function UniChallengeDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, selectedTrackingId } = useApp();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTrackingId) { setLoading(false); return; }
    import('./api').then(({ getProblemDetails }) => {
      getProblemDetails(selectedTrackingId)
        .then(data => { setProblem(data.problem); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    });
  }, [selectedTrackingId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-amber-500" /></div>;
  if (!problem) return <div className="p-10 text-center">Problem not found.</div>;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>{problem.title || problem.description}</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>{problem.problem_code} • {[problem.village, problem.block, problem.district].filter(Boolean).join(", ")}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>Problem Description</h3>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {problem.description}
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <Layers size={15} /> Challenge Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[["Domain", problem.category_name], ["Severity", problem.severity || "Medium"],  ["Status", problem.status]].map(([k, v]) => (
                  <div key={k} className="p-2 rounded-xl" style={{ background: "var(--bg)" }}>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{k}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{v}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>AI Match Score</h3>
              <ProgressRing value={Math.floor(Math.random() * 20) + 75} size={90} />
            </Card>
            {problem.status !== 'SOLVED' && problem.status !== 'ASSIGNED' && problem.status !== 'IN_PROGRESS' && (
              <Btn onClick={() => onNav("proposal")} className="w-full" icon={<CheckCircle size={16} />}>
                Solve this Problem
              </Btn>
            )}
            <Btn variant="secondary" onClick={() => onNav("team-formation")} className="w-full" icon={<Users size={16} />}>
              Form Team
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
