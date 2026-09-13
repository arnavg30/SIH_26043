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

const uniDashboard = `function UniDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, setSelectedTrackingId } = useApp();
  const profile = useProfileDisplay("university");
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
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <School size={22} /> {t("uni.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{profile.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "New Challenges", value: recommended.length.toString(), color: "var(--amber)", filterStr: "SUBMITTED" },
            { icon: <Activity size={18} />, label: "Active Projects", value: myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--navy)", filterStr: "IN_PROGRESS" },
            { icon: <ThumbsUp size={18} />, label: "Completed", value: myProjects.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", filterStr: "SOLVED" }
          ].map(k => (
             <div key={k.label} className="cursor-pointer active:scale-95 transition-all" onClick={() => setSelectedFilter({ title: k.label, color: k.color, filterStr: k.filterStr })}>
               <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
             </div>
          ))}
        </div>
        
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recommended Challenges (AI Matched)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {recommended.slice(0, 4).map((c, i) => (
             <Card key={i} className="p-5 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(c.problem_code); onNav("uni-challenge-detail"); }}>
               <div className="flex items-start justify-between mb-3">
                 <div className="flex-1">
                   <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title || c.description}</h3>
                   <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                     <MapPin size={11} /> {[c.village, c.block, c.district].filter(Boolean).join(", ")}
                   </p>
                 </div>
                 <div className="text-right">
                    <div className="font-black text-xl sm:text-2xl" style={{ color: "var(--success)" }}>{c.match_percentage || 85}%</div>
                    <div className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>AI MATCH</div>
                 </div>
               </div>
               
               <div className="mb-3 space-y-1">
                 {(c.match_reasons || ["Profile matches requirements", "High AI Alignment Score"]).map((r: string, idx: number) => (
                   <p key={idx} className="text-xs flex items-center gap-1.5 font-medium" style={{ color: "var(--success)" }}>
                     <CheckCircle size={11} className="shrink-0" /> {r}
                   </p>
                 ))}
               </div>

               <div className="flex gap-2">
                 <Btn onClick={(e) => { e.stopPropagation(); setSelectedTrackingId(c.problem_code); onNav("uni-challenge-detail"); }} variant="ghost" className="flex-1 text-xs">View Details</Btn>
               </div>
             </Card>
          ))}
          {recommended.length === 0 && <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>No AI recommendations yet. Please update your profile description.</div>}
        </div>
        
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Active Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").map((c, i) => (
             <Card key={i} className="p-5 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(c.problem_code); onNav("project-lifecycle"); }}>
               <div className="flex items-start justify-between mb-2">
                 <div className="flex-1">
                   <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title || c.description}</h3>
                   <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                     <MapPin size={11} /> {[c.village, c.block, c.district].filter(Boolean).join(", ")}
                   </p>
                 </div>
                 <StatusBadge status="in-progress" />
               </div>
               <div className="flex gap-2 mb-3 flex-wrap">
                 <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{c.category_name}</span>
               </div>
               <div className="flex gap-2">
                 <Btn onClick={(e) => { e.stopPropagation(); setSelectedTrackingId(c.problem_code); onNav("project-lifecycle"); }} className="flex-1 text-xs">Track Progress</Btn>
               </div>
             </Card>
          ))}
          {myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length === 0 && <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>No active projects found.</div>}
        </div>
      </div>
    </div>
  );
}`;

code = replaceComponent(code, "UniDashboardScreen", "useProfileDisplay", uniDashboard);

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully replaced UniDashboardScreen!");
