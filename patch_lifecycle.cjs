const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function ProjectLifecycleScreen({';
const endFunction = 'function ProjectHealthScreen({';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function ProjectLifecycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
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
  if (!problem) return <div className="p-10 text-center">Project not found.</div>;

  const milestones = [
    { label: "Research & Survey", done: true },
    { label: "Prototype Design", done: problem.status === "IN_PROGRESS" || problem.status === "SOLVED" },
    { label: "Testing & Validation", active: problem.status === "ASSIGNED", done: problem.status === "SOLVED" },
    { label: "Pilot Implementation", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
    { label: "Full Deployment", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
  ];
  
  const p = problem;
  
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="project-lifecycle" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-dashboard")} className="flex items-center gap-1 text-xs mb-3" style={{ color: "var(--navy)" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <Card className="p-5 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h1 className="text-lg font-black" style={{ color: "var(--navy)" }}>{p.title || p.description}</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {p.problem_code} • {p.category_name} • {[p.village, p.block, p.district].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status={p.status === "SOLVED" ? "resolved" : "in-progress"} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "var(--text-muted)" }}>{t("proj.progress")}</span>
              <span className="font-bold" style={{ color: "var(--green)" }}>{p.status === "SOLVED" ? "100" : (p.status === "IN_PROGRESS" ? "60" : "20")}%</span>
            </div>
            <div className="h-3 rounded-full" style={{ background: "var(--border)" }}>
              <div className="h-3 rounded-full" style={{ width: p.status === "SOLVED" ? "100%" : (p.status === "IN_PROGRESS" ? "60%" : "20%"), background: "var(--green)" }} />
            </div>
          </div>
          {p.status !== 'SOLVED' && (
            <Btn onClick={async () => {
              try {
                const { markSolved } = await import('./api');
                await markSolved(p.problem_code);
                onNav("uni-dashboard");
              } catch (err) { console.error(err); }
            }} className="w-full mt-4 text-xs">Mark as Solved</Btn>
          )}
        </Card>

        <h3 className="font-bold text-lg mb-4" style={{ color: "var(--navy)" }}>{t("proj.timeline")}</h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {milestones.map((m, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
                style={{ background: m.done ? "var(--green)" : m.active ? "var(--amber)" : m.behind ? "var(--error)" : "var(--border)" }}>
                {m.done && <CheckCircle size={16} color="white" />}
                {m.active && <Activity size={16} color="white" />}
                {m.behind && <AlertTriangle size={16} color="white" />}
                {m.pending && <Clock size={16} color="var(--text-muted)" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow border border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{m.label}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{m.done ? "Completed" : m.active ? "Active" : "Pending"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
