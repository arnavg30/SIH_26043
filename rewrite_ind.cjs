const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

function replaceComponent(codeStr, componentName, nextComponentName, newComponentStr) {
  const start = codeStr.indexOf("function " + componentName + "({");
  if (start === -1) { console.log("Start not found for " + componentName); return codeStr; }
  
  let end;
  if (nextComponentName) {
      end = codeStr.indexOf("function " + nextComponentName, start);
      if (end === -1) { console.log("End not found for " + componentName); return codeStr; }
  } else {
      end = codeStr.indexOf('// ---', start);
      if (end === -1) end = codeStr.length;
  }
  
  return codeStr.substring(0, start) + newComponentStr + "\\n\\n" + codeStr.substring(end);
}

const industryDashboard = `function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, setSelectedTrackingId } = useApp();
  const profile = useProfileDisplay("industry");
  const [recommended, setRecommended] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);

  useEffect(() => {
    import('./api').then(({ getRecommendedProblems, getMyProblems }) => {
      getRecommendedProblems().then(data => { if(data) setRecommended(data.problems || []); }).catch(console.error);
      getMyProblems().then(data => { if(data) setMyProjects(data.problems || []); }).catch(console.error);
    });
  }, []);

  if (selectedFilter) {
    let fp = recommended;
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    else if (selectedFilter.filterStr === "SOLVED") fp = myProjects.filter(p => p.status === "SOLVED");
    else if (selectedFilter.filterStr === "SUBMITTED") fp = recommended.filter(p => p.status === "SUBMITTED" || p.status === "PENDING" || p.status === "UNDER_REVIEW");
    
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <Factory size={22} /> {t("ind.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{profile.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "Recommended Projects", value: recommended.length.toString(), color: "var(--amber)", filterStr: "SUBMITTED" },
            { icon: <Activity size={18} />, label: "Active Partnerships", value: myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--navy)", filterStr: "IN_PROGRESS" },
            { icon: <ThumbsUp size={18} />, label: "Completed", value: myProjects.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", filterStr: "SOLVED" }
          ].map(k => (
             <div key={k.label} className="cursor-pointer active:scale-95 transition-all" onClick={() => setSelectedFilter({ title: k.label, color: k.color, filterStr: k.filterStr })}>
               <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
             </div>
          ))}
        </div>

        <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Lightbulb size={16} /> Recommended Projects (AI Matches)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map((p, i) => (
            <Card key={i} className="p-5 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(p.problem_code); onNav("industry-project-detail"); }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{p.title || p.description}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.category_name} • {[p.village, p.district].filter(Boolean).join(", ")}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl" style={{ color: "var(--success)" }}>{p.match_percentage || 89}%</div>
                  <div className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>AI MATCH</div>
                </div>
              </div>
              <div className="mb-4 space-y-1">
                {(p.match_reasons || ["CSR Opportunity", "Scale potential"]).map((r: string, idx: number) => (
                  <p key={idx} className="text-xs flex items-center gap-1.5 font-medium" style={{ color: "var(--success)" }}>
                    <CheckCircle size={11} className="shrink-0" /> {r}
                  </p>
                 ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn onClick={(e) => { e.stopPropagation(); setSelectedTrackingId(p.problem_code); onNav("industry-project-detail"); }} variant="secondary" className="text-xs flex-1"
                  icon={<Eye size={13} />}>View Details</Btn>
              </div>
            </Card>
          ))}
          {recommended.length === 0 && <div className="p-4 text-sm col-span-2" style={{ color: "var(--text-muted)" }}>No AI recommendations found based on your profile description.</div>}
        </div>
      </div>
    </div>
  );
}`;

code = replaceComponent(code, "IndustryDashboardScreen", "IndustryProjectDetailScreen", industryDashboard);

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully replaced IndustryDashboardScreen!");
