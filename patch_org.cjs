const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function OrgSolverDashboardScreen({';
const endFunction = 'function UniLoginScreen({';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, setSelectedTrackingId } = useApp();
  const profile = useProfileDisplay("org-solver");
  const [recommended, setRecommended] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ benefited: 0 });
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);

  useEffect(() => {
    getRecommendedProblems().then(data => { if(data) setRecommended(data.problems || []); }).catch(console.error);
    getMyProblems().then(data => { if(data) setMyProjects(data.problems || []); }).catch(console.error);
    import('./api').then(({ getStats }) => {
      getStats().then(data => { if (data && data.success) setStats(data); }).catch(console.error);
    });
  }, []);

  if (selectedFilter) {
    let fp = recommended;
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    else if (selectedFilter.filterStr === "SOLVED") fp = myProjects.filter(p => p.status === "SOLVED");
    else if (selectedFilter.filterStr === "SUBMITTED") fp = recommended.filter(p => p.status === "SUBMITTED" || p.status === "PENDING" || p.status === "UNDER_REVIEW");
    else fp = myProjects.concat(recommended);
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="org-solver" screen="org-solver-dashboard" onNav={onNav} />
      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <h1 className="text-xl font-black text-white">{t("org.dashboard")}</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{profile.name || "Organisation"} {profile.detail ? \`- \${profile.detail}\` : \`- \${t("org.subtitle")}\`}</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Layers size={18} />, label: t("org.recommended"), value: recommended.length.toString(), color: "var(--amber)", filterStr: "SUBMITTED" },
            { icon: <Briefcase size={18} />, label: t("org.collabs"), value: myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--green)", filterStr: "IN_PROGRESS" },
            { icon: <CheckCircle size={18} />, label: t("org.completed"), value: myProjects.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", filterStr: "SOLVED" },
            { icon: <Users size={18} />, label: t("org.reach"), value: stats.benefited >= 1000 ? (stats.benefited / 1000).toFixed(1) + "K" : stats.benefited.toString(), color: "var(--navy)", filterStr: "ALL" },
          ].map(k => (
            <div key={k.label} onClick={() => setSelectedFilter({ title: k.label, color: k.color, filterStr: k.filterStr })} className="cursor-pointer active:scale-95 transition-all">
              <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
            </div>
          ))}
        </div>
        
        {/* Core Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNav("uni-dashboard")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--navy)", color: "white" }}>
            <Search size={16} /> {t("org.find_problems")}
          </button>
          <button onClick={() => onNav("partnership-form")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--green)", color: "white" }}>
            <SendHorizontal size={16} /> {t("org.support")}
          </button>
        </div>

        {/* Top Recommended Challenges */}
        <h3 className="font-bold text-sm mt-6 mb-2" style={{ color: "var(--text)" }}>{t("org.recommended")}</h3>
        <div className="space-y-3">
          {recommended.slice(0, 3).map((c, i) => (
             <Card key={i} className="p-4 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(c.problem_code); onNav("uni-challenge-detail"); }}>
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title || c.description}</h4>
                   <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> {[c.village, c.block, c.district].filter(Boolean).join(", ")}</p>
                 </div>
                 <StatusBadge status={c.status === "SUBMITTED" ? "submitted" : "under-review"} />
               </div>
             </Card>
          ))}
          {recommended.length === 0 && <div className="text-sm" style={{ color: "var(--text-muted)" }}>No recommendations right now.</div>}
        </div>

        {/* Our Active Projects */}
        <h3 className="font-bold text-sm mt-6 mb-2" style={{ color: "var(--text)" }}>Our Projects</h3>
        <div className="space-y-3">
          {myProjects.slice(0, 3).map((c, i) => (
             <Card key={i} className="p-4 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(c.problem_code); onNav("project-lifecycle"); }}>
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title || c.description}</h4>
                   <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> {[c.village, c.block, c.district].filter(Boolean).join(", ")}</p>
                 </div>
                 <StatusBadge status={c.status === "SOLVED" ? "resolved" : "in-progress"} />
               </div>
             </Card>
          ))}
          {myProjects.length === 0 && <div className="text-sm" style={{ color: "var(--text-muted)" }}>No active projects.</div>}
        </div>
      </div>
    </div>
  );
}
`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
