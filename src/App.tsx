function NotificationsScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./api').then(({ getNotifications }) => {
      getNotifications()
        .then(data => { setNotifs(data.notifications || []); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    });
  }, []);

  const handleRead = async (id: number) => {
    try {
      const { markNotificationRead } = await import('./api');
      await markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="notifications" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
        <h1 className="text-xl font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Bell size={22} color="var(--amber)" /> {t("btn.notifications")}
        </h1>
        {loading ? (
          <div className="p-10 flex justify-center"><Loader className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="space-y-3 pb-20">
            {notifs.map((n, i) => (
              <Card key={i} className={`p-4 cursor-pointer card-hover ${!n.is_read ? 'border-l-4 border-l-amber-500' : ''}`} onClick={() => { if(!n.is_read) handleRead(n.id); }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ background: "rgba(245,158,11,0.1)" }}>
                    <Bell size={18} color="var(--amber)" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                      <span className="text-xs text-slate-500">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  </div>
                </div>
              </Card>
            ))}
            {notifs.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Bell size={40} className="mx-auto mb-3 opacity-20" />
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function UniChallengeDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
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
function ProposalScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, selectedTrackingId } = useApp();
  const [inputText, setInputText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleGenerate = async () => {
    if (!inputText || !selectedTrackingId) return;
    setGenerating(true);
    try {
      const { submitSolutionAI, acceptProblem } = await import('./api');
      
      // Accept the problem first (creates initiative)
      await acceptProblem(selectedTrackingId);
      
      // Submit solution for AI processing
      const res = await submitSolutionAI(selectedTrackingId, inputText);
      if (res && res.solution) setResult(res.solution);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-challenge-detail")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <FileText size={22} /> Generate AI Proposal
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>{selectedTrackingId}</p>
        
        {!result ? (
          <Card className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "var(--text)" }}>Brief Solution Description</label>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Describe your solution approach, methodology, or paste document text here.</p>
              <textarea rows={6} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="E.g. We will use IoT sensors to detect leaks..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            
            <Btn onClick={handleGenerate} disabled={generating || !inputText} className="w-full" icon={generating ? <Loader className="animate-spin" size={16} /> : <Zap size={16} />}>
              {generating ? "AI is structuring your proposal..." : "Generate Structured Proposal"}
            </Btn>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-5">
               <h3 className="font-bold text-sm mb-2 text-green-600 flex items-center gap-2"><CheckCircle size={16}/> AI Structured Solution</h3>
               <div className="space-y-4 mt-4">
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">PROPOSED SOLUTION</h4>
                   <p className="text-sm">{result.proposed_solution}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">TIMELINE</h4>
                   <p className="text-sm">{result.timeline}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">RESOURCES NEEDED</h4>
                   <p className="text-sm">{result.resources_needed}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">FEASIBILITY SCORE</h4>
                   <div className="mt-2 text-2xl font-black text-amber-500">{result.feasibility_score}/100</div>
                 </div>
               </div>
               
               <Btn onClick={() => onNav("project-lifecycle")} className="w-full mt-6">Start Project</Btn>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
function ProjectLifecycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
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
function UniDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
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
}

function useProfileDisplay(role: string): ProfileDisplay {
  const [display, setDisplay] = useState<ProfileDisplay>({ name: "", detail: "" });
  useEffect(() => {
    let active = true;
    getProfileMe().then(({ profile }) => {
      if (!active || !profile) return;
      if (role === "citizen") setDisplay({ name: profile.name || "", detail: [profile.city_village, profile.district].filter(Boolean).join(", ") });
      else if (role === "panchayat") setDisplay({ name: profile.panchayat_name || "", detail: [profile.block, profile.district].filter(Boolean).join(", ") });
      else if (role === "localorg" || role === "org-victim") setDisplay({ name: profile.organization_name || "", detail: [profile.block, profile.district].filter(Boolean).join(", ") });
      else if (role === "university") setDisplay({ name: profile.university_name || "", detail: profile.institutional_address || "" });
      else if (role === "industry") setDisplay({ name: profile.industry_name || "", detail: profile.industry_type || "" });
      else if (role === "org-solver" || role === "org") setDisplay({ name: profile.organization_name || "", detail: profile.domain_expertise || profile.domain || "" });
    }).catch(() => {});
    return () => { active = false; };
  }, [role]);
  return display;
}

function getHomeDashboard(role: string): Screen {
  if (role === "panchayat") return "panchayat-dashboard";
  if (role === "localorg" || role === "org-victim") return "org-victim-dashboard";
  if (role === "university") return "uni-dashboard";
  if (role === "industry") return "industry-dashboard";
  if (role === "org-solver" || role === "org") return "org-solver-dashboard";
  return "citizen-dashboard";
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "solver-dashboard" | "landing"
  | "victim-select" | "solver-select"
  | "citizen-login" | "citizen-dashboard"
  | "panchayat-login" | "panchayat-dashboard"
  | "org-victim-login" | "org-victim-dashboard"
  | "uni-login" | "uni-dashboard" | "uni-challenge-detail"
  | "team-formation" | "proposal"
  | "industry-login" | "industry-dashboard" | "industry-project-detail"
  | "partnership-form" | "partnership-success"
  | "org-solver-login" | "org-solver-dashboard"
  | "report-step1" | "report-step2" | "report-step3"
  | "ai-processing" | "ai-result" | "submit-success"
  | "tracking" | "problems-near-me" | "report-for-someone"
  | "project-lifecycle" | "project-health"
  | "solution-repo" | "solution-detail"
  | "impact-dashboard" | "notifications" | "feedback" | "profile";

// ─── Language Modal ───────────────────────────────────────────────────────────
const LANGS: { code: Lang; native: string; name: string }[] = [
  { code: "hi", native: "हिंदी", name: "Hindi" },
  { code: "en", native: "English", name: "English" },
  { code: "sa", native: "Santali", name: "Santali" },
];

function LanguageModal({ onDone }: { onDone: (lang: Lang) => void }) {
  const [sel, setSel] = useState<Lang>("en");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}>
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--navy)" }}>
            <Globe size={22} color="var(--amber)" />
          </div>
          <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Choose Your Language</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>अपनी भाषा चुनें</p>
        </div>
        <div className="space-y-2 mb-5">
          {LANGS.map(l => (
            <button key={l.code}
              onClick={() => setSel(l.code)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: sel === l.code ? "var(--green)" : "var(--border)",
                background: sel === l.code ? "var(--success-bg)" : "var(--card)",
              }}>
              <div>
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{l.native}</span>
                {l.code !== "en" && <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{l.name}</span>}
              </div>
              {sel === l.code && <CheckCircle size={18} color="var(--green)" />}
            </button>
          ))}
        </div>
        <button onClick={() => onDone(sel)}
          className="w-full py-3 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          {sel === "hi" ? "जारी रखें →" : sel === "sa" ? "Jari →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

function MitraWelcomeModal({ onContinue }: { onContinue: () => void }) {
  const { t, lang } = useApp();
  const badgeLabel = lang === "hi" ? "मित्रा — आपकी डिजिटल सहायक" : lang === "sa" ? "Mitra — Apan Digital Sahayak" : "Mitra — Your Digital Guide";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg md:max-w-2xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <MitraAssistant
          size="full"
          variant="welcome"
          message={t("mitra.welcome.title")}
          subMessage={t("mitra.welcome.sub")}
          hint={t("mitra.welcome.hint")}
          badgeText={badgeLabel}
          action={
            <button
              onClick={onContinue}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
              style={{ background: "var(--amber)", color: "var(--navy)" }}
            >
              <span>{t("mitra.welcome.btn") || t("lang.continue")}</span>
              <ArrowRight size={18} />
            </button>
          }
        />
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Card({ children, className = "", onClick, style }: {
  children: React.ReactNode; className?: string;
  onClick?: () => void; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border ${onClick ? "cursor-pointer card-hover" : ""} ${className}`}
      style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)", ...style }}
      onClick={onClick}>
      {children}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, className = "", disabled = false, icon, type = "button" }: {
    children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "nav";
    onClick?: () => void; className?: string; disabled?: boolean; icon?: React.ReactNode; type?: "button" | "submit" | "reset";
  }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--amber)", color: "var(--navy)", border: "none" },
    secondary: { background: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1.5px solid var(--border)" },
    danger: { background: "var(--error-bg)", color: "var(--error)", border: "1.5px solid var(--error)" },
    success: { background: "var(--green)", color: "white", border: "none" },
    nav: { background: "transparent", color: "var(--nav-text)", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"} ${className}`}
      style={styles[variant]}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    submitted: { bg: "#EFF6FF", text: "#1D4ED8", label: "Submitted" },
    "under-review": { bg: "#FEF9C3", text: "#854D0E", label: "Under Review" },
    "in-progress": { bg: "var(--warning-bg)", text: "var(--warning)", label: "In Progress" },
    resolved: { bg: "var(--success-bg)", text: "var(--success)", label: "Resolved" },
    "high-priority": { bg: "var(--error-bg)", text: "var(--error)", label: "High Priority" },
    "on-track": { bg: "var(--success-bg)", text: "var(--success)", label: "On Track" },
    "at-risk": { bg: "var(--warning-bg)", text: "var(--warning)", label: "At Risk" },
    delayed: { bg: "var(--error-bg)", text: "var(--error)", label: "Delayed" },
    matched: { bg: "#EDE9FE", text: "#5B21B6", label: "Matched" },
    validated: { bg: "var(--success-bg)", text: "var(--success)", label: "Validated" },
    new: { bg: "#DBEAFE", text: "#1E40AF", label: "New" },
    deployed: { bg: "var(--success-bg)", text: "var(--success)", label: "Deployed" },
  };
  const s = map[status] || { bg: "var(--bg)", text: "var(--text-muted)", label: status };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function PriorityBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--error)" : score >= 60 ? "var(--warning)" : "var(--success)";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: "var(--border)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}/100</span>
    </div>
  );
}

function ProgressRing({ value, size = 80, stroke = 7, color = "var(--green)" }: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
        style={{ fontSize: size * 0.2, fontWeight: 700, fill: color }}>{value}%</text>
    </svg>
  );
}

function KPICard({ icon, label, value, sub, color = "var(--navy)" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {sub && <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "var(--success-bg)", color: "var(--success)" }}>{sub}</span>}
      </div>
      <div className="text-2xl font-black mt-1" style={{ color }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
    </Card>
  );
}

// ─── Top NavBar ───────────────────────────────────────────────────────────────
function NavBar({ role, screen, onNav }: { role: string; screen: Screen; onNav: (s: Screen) => void }) {
  const { t, lang, setLang, dark, setDark } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems: { label: string; screen: Screen; icon: React.ReactNode; isCTA?: boolean }[] =
    role === "citizen" ? [
      { label: t("cit.report"), screen: "report-step1", icon: <FileText size={15} /> },
      { label: t("cit.track"), screen: "tracking", icon: <MapPin size={15} /> },
      { label: t("cit.nearby"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "panchayat" ? [
      { label: t("panch.problems"), screen: "panchayat-dashboard", icon: <Layers size={15} /> },
      { label: t("panch.report"), screen: "report-step1", icon: <FileText size={15} />, isCTA: true },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "localorg" || role === "org-victim" ? [
      { label: t("localorg.my_problems"), screen: "org-victim-dashboard", icon: <FileText size={15} /> },
      { label: t("localorg.area_problems"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "university" ? [
      { label: "Challenges", screen: "uni-dashboard", icon: <Layers size={15} /> },
      { label: "Projects", screen: "project-lifecycle", icon: <Activity size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "industry" ? [
      { label: "Projects", screen: "industry-dashboard", icon: <Briefcase size={15} /> },
      { label: "Partnerships", screen: "partnership-form", icon: <Building2 size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "org-solver" || role === "org" ? [
      { label: t("org.dashboard"), screen: "org-solver-dashboard", icon: <Briefcase size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : [];

  const homeScreen: Screen = getHomeDashboard(role);

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => onNav(homeScreen)} className="dark flex items-center flex-shrink-0 text-left cursor-pointer transition-transform active:scale-95">
          <div className="hidden sm:block">
            <NavJharLogo variant="full" />
          </div>
          <div className="sm:hidden">
            <NavJharLogo variant="icon" className="w-9 h-9" />
          </div>
        </button>

        {/* Desktop nav items */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => onNav(item.screen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(242,184,75,0.4)"
              } : {
                color: screen === item.screen ? "var(--amber)" : "var(--nav-text)",
                background: screen === item.screen ? "rgba(242,184,75,0.12)" : "transparent"
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language selector */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
              <Globe size={14} />
              <span className="hidden sm:block">{LANG_NAMES[lang]}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                {LANGS.map(l => (
                  <button key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-medium transition-all hover:opacity-80 flex items-center justify-between"
                    style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                    {l.native}
                    {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button onClick={() => setDark(!dark)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <button onClick={() => onNav("notifications")}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>

          {/* Sign out */}
          <button onClick={() => { signOut(auth).catch(() => {}); onNav("landing"); }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
            <LogOut size={13} /> {t("nav.logout")}
          </button>

          {/* Mobile menu */}
          <button className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "var(--navy-dark)" }}>
          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => { onNav(item.screen); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium cursor-pointer"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold"
              } : { color: screen === item.screen ? "var(--amber)" : "var(--nav-text)" }}>
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => { signOut(auth).catch(() => {}); setMenuOpen(false); onNav("landing"); }}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium border-t cursor-pointer"
            style={{ color: "var(--nav-text)", borderColor: "rgba(255,255,255,0.08)" }}>
            <LogOut size={15} /> {t("nav.logout")}
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Bottom Navigation (For all role dashboards) ─────────────────────────────
function MobileNav({ onNav, activeScreen }: { onNav: (s: Screen) => void; activeScreen?: Screen }) {
  const { t, role } = useApp();
  const homeScreen = getHomeDashboard(role);
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 z-40"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {([
        { icon: <Home size={20} />, label: "Home", screen: homeScreen },
        { icon: <FileText size={20} />, label: t("cit.report").split(" ")[0], screen: "report-step1" as Screen },
        { icon: <MapPin size={20} />, label: t("cit.track").split(" ")[0], screen: "tracking" as Screen },
        { icon: <Map size={20} />, label: "Near Me", screen: "problems-near-me" as Screen },
        { icon: <User size={20} />, label: t("nav.profile"), screen: "profile" as Screen },
      ] as const).map(n => (
        <button key={n.screen} onClick={() => onNav(n.screen)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer active:scale-95"
          style={{ color: activeScreen === n.screen ? "var(--amber)" : "var(--text-muted)" }}>
          {n.icon}
          <span className="text-xs font-medium">{n.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── SIMPLE NAV HEADER (Consistent Top-Left Logo) ─────────────────────────────
function SimpleNavHeader({ onBack, onNav }: { onBack?: () => void; onNav?: (s: Screen) => void }) {
  const { t, dark, setDark, lang, setLang } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 h-14 flex items-center justify-between"
      style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
      {/* Logo in Top-Left Corner (Just like Dashboard) */}
      <button 
        onClick={() => onNav ? onNav("landing") : (onBack ? onBack() : null)} 
        className="dark flex items-center flex-shrink-0 text-left cursor-pointer transition-transform active:scale-95"
      >
        <div className="hidden sm:block">
          <NavJharLogo variant="full" />
        </div>
        <div className="sm:hidden">
          <NavJharLogo variant="icon" className="w-9 h-9" />
        </div>
      </button>

      {/* Right controls: Back button & Theme toggle */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            <ArrowLeft size={14} /> {t("btn.back")}
          </button>
        )}
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            <Globe size={13} /> {LANG_NAMES[lang]} <ChevronDown size={11} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
              style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer"
                  style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                  {l.native} {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setDark(!dark)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang, setLang, dark, setDark } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [stats, setStats] = useState({ reported: 0, deployed: 0, benefited: 0 });
  useEffect(() => {
    import('./api').then(({ getStats }) => {
      getStats().then(data => {
        if (data && data.success) {
          setStats({ reported: data.reported, deployed: data.deployed, benefited: data.benefited });
        }
      }).catch(console.error);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top header */}
      <header className="px-4 sm:px-6 h-14 flex items-center justify-between"
        style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
        <div className="dark flex items-center">
          <div className="hidden sm:block">
            <NavJharLogo variant="full" />
          </div>
          <div className="sm:hidden">
            <NavJharLogo variant="icon" className="w-9 h-9" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
              <Globe size={13} /> {LANG_NAMES[lang]} <ChevronDown size={11} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between"
                    style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                    {l.native} {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setDark(!dark)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

        </div>
      </header>

      {/* Hero */}
      <div className="py-10 px-4 text-center" style={{
        background: `linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 60%, var(--green) 100%)`
      }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold"
          style={{ background: "rgba(242,184,75,0.15)", color: "var(--amber)", border: "1px solid rgba(242,184,75,0.3)" }}>
          <Shield size={12} /> Government of Jharkhand — Official Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2 tracking-tight leading-none flex items-center justify-center">
          <span className="text-[#F59E0B]">Nav</span>
          <span className="text-[#4ade80]">Jhar</span>
        </h1>
        <p className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "var(--amber)" }}>
          हर समस्या का नया समाधान
        </p>
        <p className="text-sm max-w-md mx-auto mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
          From Local Problems to Scalable Solutions
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { val: stats.reported.toLocaleString(), key: "landing.stats.reported" },
            { val: stats.deployed.toLocaleString(), key: "landing.stats.deployed" },
            { val: stats.benefited >= 100000 ? (stats.benefited / 100000).toFixed(1) + "L+" : stats.benefited.toLocaleString(), key: "landing.stats.benefited" },
          ].map(s => (
            <div key={s.key} className="text-center">
              <div className="text-2xl font-black" style={{ color: "var(--amber)" }}>{s.val}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{t(s.key)}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          * Real-time metrics from NavJhar database
        </p>
      </div>

      {/* Main two-path selection */}
      <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <h2 className="text-center text-base font-semibold mb-6" style={{ color: "var(--text)" }}>
          {t("landing.how")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Register a Problem */}
          <button onClick={() => onNav("victim-select")}
            className="p-6 rounded-2xl border-2 text-left transition-all card-hover active:scale-95"
            style={{ background: "var(--card)", borderColor: "var(--green)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--success-bg)", border: "1.5px solid var(--green)" }}>
              <FileText size={28} color="var(--green)" />
            </div>
            <h3 className="text-lg font-black mb-1" style={{ color: "var(--green)" }}>
              {t("landing.victim")}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("landing.victim.sub")}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: "var(--green)" }}>
              {t("btn.next")} <ChevronRight size={14} />
            </div>
          </button>

          {/* Problem Solver */}
          <button onClick={() => onNav("solver-select")}
            className="p-6 rounded-2xl border-2 text-left transition-all card-hover active:scale-95"
            style={{ background: "var(--card)", borderColor: "var(--navy)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "#EFF6FF", border: "1.5px solid var(--navy)" }}>
              <Lightbulb size={28} color="var(--navy)" />
            </div>
            <h3 className="text-lg font-black mb-1" style={{ color: "var(--navy)" }}>
              {t("landing.solver")}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("landing.solver.sub")}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: "var(--navy)" }}>
              {t("btn.next")} <ChevronRight size={14} />
            </div>
          </button>
        </div>



      </div>
      <footer className="mt-auto py-4 px-4 text-center" style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,0.6)" }}>
        <p className="text-xs">A Government of Jharkhand Initiative.</p>
        <p className="text-xs mt-1">Supported by JSAC.</p>
      </footer>
    </div>
  );
}

// ─── VICTIM ROLE SELECTION ────────────────────────────────────────────────────
function VictimSelectScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const roles = [
    {
      icon: <User size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.citizen"), sub: t("victim.citizen.sub"), screen: "citizen-login" as Screen,
    },
    {
      icon: <Building2 size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.panchayat"), sub: t("victim.panchayat.sub"), screen: "panchayat-login" as Screen,
    },
    {
      icon: <Users size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.localorg"), sub: t("victim.localorg.sub"), screen: "org-victim-login" as Screen,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader onBack={() => onNav("landing")} onNav={onNav} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "var(--text)" }}>{t("victim.who")}</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t("landing.victim")}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-8">
            {/* Mitra full body with speech bubble box on side */}
            <div className="w-full max-w-md lg:w-96 shrink-0 flex justify-center">
              <MitraAssistant
                size="full"
                variant="guide"
                mitraHeight="h-72 sm:h-80"
                message={t("mitra.identity.select")}
                subMessage={lang === "hi" ? "कृपया अपनी सही श्रेणी चुनें" : "Please select your category to continue"}
              />
            </div>

            {/* Role Selection Cards */}
            <div className="w-full max-w-md space-y-3">
              {roles.map(r => (
                <button key={r.screen} onClick={() => onNav(r.screen)}
                  className="w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all card-hover active:scale-95 cursor-pointer shadow-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: r.bg, border: `1.5px solid ${r.accentColor}` }}>{r.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-base" style={{ color: "var(--text)" }}>{r.label}</div>
                    <div className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{r.sub}</div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SOLVER ROLE SELECTION ────────────────────────────────────────────────────
function SolverSelectScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const roles = [
    {
      icon: <GraduationCap size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.university"), sub: t("solver.university.sub"), screen: "uni-login" as Screen,
    },
    {
      icon: <Factory size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.industry"), sub: t("solver.industry.sub"), screen: "industry-login" as Screen,
    },
    {
      icon: <Briefcase size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.org"), sub: t("solver.org.sub"), screen: "org-solver-login" as Screen,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner (Just like Dashboard) */}
      <SimpleNavHeader onBack={() => onNav("landing")} onNav={onNav} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-black mb-1 text-center" style={{ color: "var(--text)" }}>{t("solver.who")}</h1>
          <p className="text-sm mb-7 text-center" style={{ color: "var(--text-muted)" }}>
            {t("landing.solver")} — {t("landing.solver.sub")}
          </p>
          <div className="space-y-3">
            {roles.map(r => (
              <button key={r.screen} onClick={() => onNav(r.screen)}
                className="w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all card-hover active:scale-95 cursor-pointer"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: r.bg }}>{r.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: "var(--text)" }}>{r.label}</div>
                  <div className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{r.sub}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REUSABLE FIREBASE EMAIL & PASSWORD AUTH FORM ─────────────────────────────

function ForgotPasswordModal({ isOpen, onClose, initialEmail }: { isOpen: boolean; onClose: () => void; initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  if (!isOpen) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    setStatus("idle");
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { auth } = await import("./firebase/config");
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
      setMsg("Reset link sent to " + email + "! Check your inbox.");
    } catch(err: any) {
      setStatus("error");
      setMsg(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-sm p-6 flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
          <X size={20} color="var(--text)" />
        </button>
        
        <h2 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Forgot Password?</h2>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--success-bg)" }}>
              <CheckCircle size={24} color="var(--success)" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{msg}</p>
            <Btn className="mt-6 w-full" onClick={onClose}>Back to Login</Btn>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            
            {status === "error" && (
              <div className="p-2.5 rounded-xl flex items-start gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>{msg}</p>
              </div>
            )}
            
            <Btn type="submit" disabled={loading} className="w-full" icon={loading ? <Loader size={16} className="animate-spin" /> : undefined}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Btn>
          </form>
        )}
      </Card>
    </div>
  );
}

function EmailPasswordAuthForm({
  email, setEmail,
  password, setPassword,
  authMode, setAuthMode,
  showPassword, setShowPassword,
  loading, errorMsg,
  onSubmit,
  emailPlaceholder = "name@example.com",
  emailLabel = "Email Address",
  emailHint = "Enter your email and password to authenticate",
}: {
  email: string; setEmail: (s: string) => void;
  password: string; setPassword: (s: string) => void;
  authMode: "signin" | "signup"; setAuthMode: (m: "signin" | "signup") => void;
  showPassword: boolean; setShowPassword: (b: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean; errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  emailPlaceholder?: string;
  emailLabel?: string;
  emailHint?: string;
}) {
  const [showForgotModal, setShowForgotModal] = useState(false);
  return (
    <>
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Sign In vs Sign Up Toggle Pills */}
      <div className="flex p-1 rounded-xl border gap-1" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => setAuthMode("signin")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMode === "signin" ? "shadow-xs" : "opacity-60 hover:opacity-100"}`}
          style={{
            background: authMode === "signin" ? "var(--card)" : "transparent",
            color: authMode === "signin" ? "var(--text)" : "var(--text-muted)",
          }}>
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("signup")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMode === "signup" ? "shadow-xs" : "opacity-60 hover:opacity-100"}`}
          style={{
            background: authMode === "signup" ? "var(--card)" : "transparent",
            color: authMode === "signup" ? "var(--text)" : "var(--text-muted)",
          }}>
          Create Account
        </button>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
          <Mail size={13} className="inline mr-1" color="var(--amber)" /> {emailLabel} <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{emailHint}</p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
          <Lock size={13} className="inline mr-1" color="var(--amber)" /> Password <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none pr-10 transition-all"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
            style={{ color: "var(--text)" }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

        {authMode === "signin" && (
          <div className="flex justify-end mt-1">
            <button 
              type="button" 
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold hover:underline cursor-pointer" 
              style={{ color: "var(--amber)" }}
            >
              Forgot Password?
            </button>
          </div>
        )}
      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl flex items-start gap-2 text-xs"
          style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      {/* Submit Button */}
      <Btn
        type="submit"
        disabled={loading}
        className="w-full py-3 cursor-pointer"
        icon={loading ? <Loader size={16} className="animate-spin" /> : <ArrowRight size={16} />}>
        {loading ? "Authenticating..." : (authMode === "signin" ? "Sign In & Continue" : "Create Account & Continue")}
      </Btn>

      {/* Switch Helper */}
      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        {authMode === "signin" ? (
          <span>New user? <button type="button" onClick={() => setAuthMode("signup")} className="font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Create account</button></span>
        ) : (
          <span>Already registered? <button type="button" onClick={() => setAuthMode("signin")} className="font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Sign in here</button></span>
        )}
      </div>
    </form>
    <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} initialEmail={email} />
    </>
  );
}

function EmailVerificationGate({ email, onVerified, onBack }: { email: string; onVerified: () => Promise<void>; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const checkVerification = async () => {
    const user = auth.currentUser;
    if (!user) return setErrorMsg("Your session expired. Please sign in again.");
    setLoading(true); setErrorMsg("");
    try {
      await reload(user);
      if (!auth.currentUser?.emailVerified) return setErrorMsg("Email is not verified yet. Open the link from your inbox, then try again.");
      await onVerified();
    } catch (err: any) { setErrorMsg(err.message || "Could not check verification status."); }
    finally { setLoading(false); }
  };
  const resend = async () => {
    const user = auth.currentUser;
    if (!user) return setErrorMsg("Your session expired. Please sign in again.");
    setLoading(true); setErrorMsg(""); setMessage("");
    try { await sendEmailVerification(user); setMessage(`Verification link sent to ${email}.`); }
    catch (err: any) { setErrorMsg(err.message || "Could not resend verification email."); }
    finally { setLoading(false); }
  };
  return <div className="space-y-4 text-center">
    <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--success-bg)" }}><Mail size={22} color="var(--success)" /></div>
    <div><h2 className="font-bold text-base" style={{ color: "var(--text)" }}>Verify your email</h2><p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>We sent a verification link to <strong>{email}</strong>. Open it, then return here.</p></div>
    {message && <p className="p-2.5 rounded-xl text-xs" style={{ background: "var(--success-bg)", color: "var(--success)" }}>{message}</p>}
    {errorMsg && <p className="p-2.5 rounded-xl text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{errorMsg}</p>}
    <Btn onClick={checkVerification} disabled={loading} className="w-full py-3" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>{loading ? "Checking..." : "I verified my email — Continue"}</Btn>
    <button type="button" onClick={resend} disabled={loading} className="w-full text-xs font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Resend verification email</button>
    <button type="button" onClick={onBack} disabled={loading} className="w-full text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>Use a different email</button>
  </div>;
}

// ─── GENERIC EMAIL LOGIN & PROFILE SETUP ──────────────────────────────────────
function OTPLoginScreen({ title, icon, onSuccess, onBack, profileType = "citizen" }: {
  title: string; icon: React.ReactNode;
  onSuccess: () => void; onBack: () => void;
  profileType?: string;
}) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeField, setActiveField] = useState<string>("name");

  // Citizen Profile Form State
  const [citName, setCitName] = useState("");
  const [citPhone, setCitPhone] = useState("");
  const [citGender, setCitGender] = useState("Male");
  const [citDob, setCitDob] = useState("");
  const [citHouse, setCitHouse] = useState("");
  const [citCity, setCitCity] = useState("");
  const [citPincode, setCitPincode] = useState("");
  const [citLandmark, setCitLandmark] = useState("");
  const [citDistrict, setCitDistrict] = useState("Ranchi");

  // Panchayat Profile Form State
  const [panchName, setPanchName] = useState("");
  const [sarpanchName, setSarpanchName] = useState("");
  const [panchPhone, setPanchPhone] = useState("");
  const [panchAddress, setPanchAddress] = useState("");
  const [panchDistrict, setPanchDistrict] = useState("Ranchi");
  const [panchBlock, setPanchBlock] = useState("Namkum");
  const [panchVillages, setPanchVillages] = useState("");

  // Local Org Profile Form State
  const [orgName, setOrgName] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocDesignation, setSpocDesignation] = useState("President / General Secretary");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgDistrict, setOrgDistrict] = useState("Ranchi");
  const [orgBlock, setOrgBlock] = useState("Ranchi Sadar");
  const [orgArea, setOrgArea] = useState("");

  const getCitizenMitraMessage = () => {
    if (step === "email") return t("mitra.profile.email");
    if (activeField === "phone") return t("mitra.profile.phone");
    if (activeField === "name") return t("mitra.profile.name");
    if (activeField === "gender") return t("mitra.profile.gender");
    if (activeField === "dob") return t("mitra.profile.dob");
    if (activeField === "address") return t("mitra.profile.address");
    return t("mitra.profile.default");
  };

  const finishVerifiedAuthentication = async () => {
    const profileTypeUpper = profileType === "panchayat" ? "PANCHAYAT" : profileType === "localorg" ? "LOCAL_ORG" : "CITIZEN";
    await syncAuth(profileTypeUpper, lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onSuccess(); } catch { /* New profile. */ }
    setStep("profile");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
          const { checkEmailExists } = await import("./api");
          await checkEmailExists(email.trim());
          await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) {
        if (authMode === "signup") await sendEmailVerification(user);
        setStep("verify");
        return;
      }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If you don't have an account yet, click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please click 'Sign In' instead.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (profileType === "panchayat") {
        if (!panchName.trim() || !sarpanchName.trim() || !panchAddress.trim() || !isValidMobile(panchPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await savePanchayatProfile({
          panchayatName: panchName,
          sarpanchName,
          district: panchDistrict,
          block: panchBlock,
          villagesCovered: panchVillages,
          officeAddress: panchAddress,
          officialPhone: panchPhone,
        });
      } else if (profileType === "localorg") {
        if (!orgName.trim() || !spocName.trim() || !orgAddress.trim() || !isValidMobile(orgPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await saveLocalOrgProfile({
          organizationName: orgName,
          spocName,
          designation: spocDesignation,
          district: orgDistrict,
          block: orgBlock,
          panchayatArea: orgArea,
          officeAddress: orgAddress,
          organizationContact: orgPhone,
        });
      } else {
        // Citizen
        if (!citName.trim() || !citGender.trim() || !citDob.trim() || !citCity.trim() || !citPincode.trim() || !citDistrict.trim() || !isValidMobile(citPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await saveCitizenProfile({
          name: citName,
          phoneNumber: citPhone,
          gender: citGender,
          dateOfBirth: citDob,
          houseNumber: citHouse,
          cityVillage: citCity,
          pincode: citPincode,
          landmark: citLandmark,
          district: citDistrict,
          residentialAddress: `${citHouse ? citHouse + ", " : ""}${citLandmark ? citLandmark + ", " : ""}${citCity || ""}, ${citDistrict || ""}, ${citPincode || ""}`.trim(),
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error("Profile save error:", err);
      setErrorMsg(err.message || "Could not save profile. Please check your network and fields.");
    } finally {
      setLoading(false);
    }
  };

  const ProfileForm = () => {
    if (profileType === "panchayat") {
      return (
        <form onSubmit={handleProfileSubmit}>
          <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
            <CheckCircle size={16} color="var(--success)" />
            <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
              Authenticated: {email}
            </span>
          </div>

          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
            <UserCheck size={16} className="inline mr-1" /> Panchayat Profile Setup
          </h2>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Panchayat Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={panchName}
              onChange={e => setPanchName(e.target.value)}
              placeholder="e.g. Ramgarh Gram Panchayat"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Mukhiya / Sarpanch Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={sarpanchName}
              onChange={e => setSarpanchName(e.target.value)}
              placeholder="e.g. Rameshwar Soren"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              <Phone size={12} className="inline mr-1" /> Official Phone Number <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <div className="flex gap-2">
              <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={panchPhone}
                maxLength={10}
                inputMode="numeric"
                onChange={e => setPanchPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Office Address <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={panchAddress}
              onChange={e => setPanchAddress(e.target.value)}
              placeholder="Panchayat Bhawan, Block Road"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label>
              <input
                value={panchDistrict}
                onChange={e => setPanchDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label>
              <input
                value={panchBlock}
                onChange={e => setPanchBlock(e.target.value)}
                placeholder="e.g. Namkum"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Village(s) Covered</label>
            <input
              value={panchVillages}
              onChange={e => setPanchVillages(e.target.value)}
              placeholder="e.g. Rampur, Sitadih"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
            {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Setup")}
          </Btn>
        </form>
      );
    }
    if (profileType === "localorg") {
      return (
        <form onSubmit={handleProfileSubmit}>
          <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
            <CheckCircle size={16} color="var(--success)" />
            <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
              Authenticated: {email}
            </span>
          </div>

          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
            <UserCheck size={16} className="inline mr-1" /> Organisation Profile Setup
          </h2>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Organisation Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="e.g. Harmu Residents Welfare Association"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              SPOC Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={spocName}
              onChange={e => setSpocName(e.target.value)}
              placeholder="e.g. Sunil Kumar Singh"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              SPOC Designation
            </label>
            <input
              value={spocDesignation}
              onChange={e => setSpocDesignation(e.target.value)}
              placeholder="e.g. General Secretary / President"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              <Phone size={12} className="inline mr-1" /> Contact Phone Number <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <div className="flex gap-2">
              <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={orgPhone}
                maxLength={10}
                inputMode="numeric"
                onChange={e => setOrgPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Office Address <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={orgAddress}
              onChange={e => setOrgAddress(e.target.value)}
              placeholder="e.g. Community Center, Sector 4, Harmu Housing Colony"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label>
              <input
                value={orgDistrict}
                onChange={e => setOrgDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label>
              <input
                value={orgBlock}
                onChange={e => setOrgBlock(e.target.value)}
                placeholder="e.g. Ranchi Sadar"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Panchayat / Area</label>
            <input
              value={orgArea}
              onChange={e => setOrgArea(e.target.value)}
              placeholder="e.g. Harmu Ward 26"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
            {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Setup")}
          </Btn>
        </form>
      );
    }
    
    // Default (Citizen)
    return (
      <form onSubmit={handleProfileSubmit}>
        <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
          <CheckCircle size={16} color="var(--success)" />
          <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
            Authenticated: {email}
          </span>
        </div>

        <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
          <UserCheck size={16} className="inline mr-1" /> Profile Setup
        </h2>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            {t("profile.name")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <input
            required
            value={citName}
            onChange={e => setCitName(e.target.value)}
            onFocus={() => setActiveField("name")}
            placeholder="e.g. Ramesh Kumar"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            <Phone size={12} className="inline mr-1" /> {t("auth.mobile")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <div className="flex gap-2">
            <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={citPhone}
              maxLength={10}
              inputMode="numeric"
              onChange={e => setCitPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              onFocus={() => setActiveField("phone")}
              className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              {t("profile.gender")} <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <select
              value={citGender}
              onChange={e => setCitGender(e.target.value)}
              onFocus={() => setActiveField("gender")}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              {t("profile.dob")} <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              type="date"
              value={citDob}
              onChange={e => setCitDob(e.target.value)}
              onFocus={() => setActiveField("dob")}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="mb-3">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--text)" }}>
            <MapPin size={12} /> {t("profile.address")} <span style={{ color: "var(--error)" }}>*</span>
          </p>
          <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--border)" }}>
            <div className="relative">
              <input
                value={citHouse}
                onChange={e => setCitHouse(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.housenumber") || "House / Flat No."}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={citCity}
                onChange={e => setCitCity(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.city") || "City / Village"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <input
                required
                value={citDistrict}
                onChange={e => setCitDistrict(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder="District (e.g. Ranchi)"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={citPincode}
                onChange={e => setCitPincode(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.pincode") || "Pincode"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <input
                value={citLandmark}
                onChange={e => setCitLandmark(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.landmark") || "Landmark"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </div>
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
        <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
          {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Profile")}
        </Btn>
      </form>
    );
  };

  const formCard = (
    <Card className="p-6">
      {step === "email" && (
        <EmailPasswordAuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authMode={authMode}
          setAuthMode={setAuthMode}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          errorMsg={errorMsg}
          onSubmit={handleAuthSubmit}
          emailPlaceholder={
            profileType === "panchayat" ? "panchayat.bokaro@jharkhand.gov.in" :
            profileType === "localorg" ? "contact@rwa-association.org" :
            "citizen.jharkhand@gmail.com"
          }
          emailLabel={t("auth.email")}
          emailHint="Enter your email and a password to authenticate"
        />
      )}
      {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}
      {step === "profile" && ProfileForm()}
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader onBack={() => {
        if (step === "profile" || step === "verify") setStep("email");
        else onBack();
      }} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {profileType === "citizen" ? (
          <div className="w-full max-w-md lg:max-w-4xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            {/* Mitra Full Body Guidance with Speech Bubble Box on Side */}
            <div className="w-full max-w-md lg:w-96 shrink-0 flex justify-center">
              <MitraAssistant
                size="full"
                variant="guide"
                mitraHeight="h-72 sm:h-80"
                message={getCitizenMitraMessage()}
                subMessage={step === "email" ? "Enter your email & password to sign in or create an account" : undefined}
              />
            </div>

            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                  style={{ background: "var(--navy)" }}>{icon}</div>
                <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>{title}</h1>
              </div>
              {formCard}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                style={{ background: "var(--navy)" }}>{icon}</div>
              <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>{title}</h1>
            </div>
            {formCard}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CITIZEN LOGIN ─────────────────────────────────────────────────────────────
function CitizenLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen
      title={t("victim.citizen")}
      icon={<User size={28} color="var(--amber)" />}
      onSuccess={() => onNav("citizen-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}

// ─── PANCHAYAT LOGIN ──────────────────────────────────────────────────────────
function PanchayatLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen profileType="panchayat"
      title={t("victim.panchayat")}
      icon={<Building2 size={28} color="var(--amber)" />}
      onSuccess={() => onNav("panchayat-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}

// ─── LOCAL ORG (VICTIM) LOGIN ─────────────────────────────────────────────────
function OrgVictimLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen profileType="localorg"
      title={t("victim.localorg")}
      icon={<Users size={28} color="var(--amber)" />}
      onSuccess={() => onNav("org-victim-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}


// ─── CITIZEN DASHBOARD ────────────────────────────────────────────────────────
function CitizenDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);
  useEffect(() => { getMyProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);
  const profile = useProfileDisplay("citizen");
  const mitraGreeting = profile.name
    ? t("mitra.dash.greeting").replace("{name}", profile.name)
    : t("mitra.dash.greeting.generic");
  const statuses = [
    { icon: <SendHorizontal size={20} />, val: problems.filter((p: any) => p.status === "SUBMITTED").length.toString(), key: "cit.submitted", color: "#1D4ED8" },
    { icon: <Clock size={20} />, val: problems.filter((p: any) => p.status === "PENDING").length.toString(), key: "cit.underreview", color: "var(--warning)" },
    { icon: <Activity size={20} />, val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), key: "cit.inprogress", color: "var(--green)" },
    { icon: <CheckCircle size={20} />, val: problems.filter((p: any) => p.status === "SOLVED").length.toString(), key: "cit.resolved", color: "var(--success)" },
  ];
  if (selectedFilter) {
    let fp = problems;
    if (selectedFilter.filterStr === "SUBMITTED") fp = problems.filter(p => p.status === "SUBMITTED");
    if (selectedFilter.filterStr === "PENDING") fp = problems.filter(p => p.status === "PENDING");
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    if (selectedFilter.filterStr === "SOLVED") fp = problems.filter(p => p.status === "SOLVED");
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="citizen" screen="citizen-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{t("cit.namaste")}</p>
            <h1 className="text-xl font-black text-white">{profile.name ? `${profile.name} Ji` : "Welcome"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Compact Mitra Greeting */}
        <div className="mb-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
          <MitraAssistant
            size="compact"
            variant="compact"
            message={mitraGreeting}
            subMessage={t("mitra.dash.hint")}
            badgeText="Mitra • आपकी डिजिटल सहायक"
            
          />
        </div>

        {/* Primary CTA */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("cit.report")}</div>
            <div className="font-medium text-sm opacity-75">समस्या रिपोर्ट करें</div>
          </div>
          <FileText size={36} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.key} className="p-3 flex items-center gap-3 cursor-pointer hover:scale-95 transition-all" onClick={() => setSelectedFilter({ title: t(s.key), color: s.color, filterStr: s.key === "cit.submitted" ? "SUBMITTED" : s.key === "org.recommended" || s.key === "uni.recommended" ? "ALL" : s.key === "cit.underreview" || s.key === "org.collabs" || s.key === "uni.active" ? "PENDING" : s.key === "cit.inprogress" || s.key === "org.collabs" || s.key === "uni.active" ? "IN_PROGRESS" : "SOLVED" })}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t(s.key)}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <MapPin size={22} />, key: "cit.track", screen: "tracking" as Screen, color: "var(--navy)" },
            { icon: <Map size={22} />, key: "cit.nearby", screen: "problems-near-me" as Screen, color: "var(--green)" },
            { icon: <Users size={22} />, key: "cit.foranother", screen: "report-for-someone" as Screen, color: "#7C3AED" },
            { icon: <HelpCircle size={22} />, key: "nav.help", screen: "notifications" as Screen, color: "#B45309" },
          ].map(a => (
            <button key={a.key} onClick={() => onNav(a.screen)}
              className="p-4 rounded-xl border-2 text-left transition-all card-hover active:scale-95"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `color-mix(in srgb, ${a.color} 10%, transparent)`, color: a.color }}>
                {a.icon}
              </div>
              <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t(a.key)}</div>
            </button>
          ))}
        </div>

        {/* Recent */}
        <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>{t("cit.myrecent")}</h2>
        {problems.length === 0 ? (
          <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>No recent reports.</p>
        ) : problems.slice(0, 5).map((p: any) => (
          <Card key={p.id} className="p-4 mb-3" onClick={() => onNav("tracking")}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.description || p.title || "Citizen Report"}</p>
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <MapPin size={11} /> {p.village || p.district || "Location"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={p.status === "SOLVED" ? "resolved" : p.status === "IN_PROGRESS" || p.status === "ASSIGNED" ? "in-progress" : p.status === "PENDING" ? "under-review" : "new"} />
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </Card>
        ))}
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

// ─── PANCHAYAT DASHBOARD ──────────────────────────────────────────────────────
function PanchayatDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);
  useEffect(() => { getMyProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);
  const profile = useProfileDisplay("panchayat");
  const statuses = [
    { label: "Total Problems", val: problems.length.toString(), color: "var(--navy)", icon: <Layers size={18} /> },
    { label: "Under Review", val: problems.filter((p: any) => p.status === "PENDING").length.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: problems.filter((p: any) => p.status === "SOLVED").length.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];

  if (selectedFilter) {
    let fp = problems;
    if (selectedFilter.filterStr === "SUBMITTED") fp = problems.filter(p => p.status === "SUBMITTED");
    if (selectedFilter.filterStr === "PENDING") fp = problems.filter(p => p.status === "PENDING");
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    if (selectedFilter.filterStr === "SOLVED") fp = problems.filter(p => p.status === "SOLVED");
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="panchayat" screen="panchayat-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Mukhiya / Sarpanch</p>
            <h1 className="text-xl font-black text-white">{profile.name || "Panchayat Dashboard"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("panch.report")}</div>
            <div className="font-medium text-sm opacity-75">पंचायत की ओर से नई समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid (Citizen Style 2x2) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.label} className="p-3 flex items-center gap-3 cursor-pointer card-hover" onClick={() => setSelectedFilter({ title: s.label, color: s.color, filterStr: s.label.includes("Total") ? "ALL" : s.label.includes("Review") ? "PENDING" : s.label.includes("Progress") ? "IN_PROGRESS" : "SOLVED" })}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>



        {/* Recent Problems in Panchayat */}
        <div>
          <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Problems in My Panchayat</h2>
          {problems.length === 0 ? (
            <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>No recent reports.</p>
          ) : problems.slice(0, 5).map((p: any) => (
            <Card key={p.id} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.description || p.title || "Citizen Report"}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {p.village || p.district || "Location"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={p.status === "SOLVED" ? "resolved" : p.status === "IN_PROGRESS" || p.status === "ASSIGNED" ? "in-progress" : p.status === "PENDING" ? "under-review" : "new"} />
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

function OrgVictimDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);
  useEffect(() => { getMyProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);
  const profile = useProfileDisplay("localorg");
  const statuses = [
    { label: "Total Reported", val: problems.length.toString(), color: "var(--navy)", icon: <FileText size={18} /> },
    { label: "Pending Review", val: problems.filter((p: any) => p.status === "PENDING").length.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: problems.filter((p: any) => p.status === "SOLVED").length.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];

  if (selectedFilter) {
    let fp = problems;
    if (selectedFilter.filterStr === "SUBMITTED") fp = problems.filter(p => p.status === "SUBMITTED");
    if (selectedFilter.filterStr === "PENDING") fp = problems.filter(p => p.status === "PENDING");
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    if (selectedFilter.filterStr === "SOLVED") fp = problems.filter(p => p.status === "SOLVED");
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="localorg" screen="org-victim-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Local Organisation (RWA)</p>
            <h1 className="text-xl font-black text-white">{profile.name || "Organisation Dashboard"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("localorg.submit")}</div>
            <div className="font-medium text-sm opacity-75">सामुदायिक समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid (Citizen Style 2x2) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.label} className="p-3 flex items-center gap-3 cursor-pointer card-hover" onClick={() => setSelectedFilter({ title: s.label, color: s.color, filterStr: s.label.includes("Total") ? "ALL" : s.label.includes("Review") ? "PENDING" : s.label.includes("Progress") ? "IN_PROGRESS" : "SOLVED" })}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>



        {/* Recent Community Problems */}
        <div>
          <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Community Problems</h2>
          {[
            { title: "Garbage accumulation near community park", sub: "Kanke Ward 4", status: "in-progress", id: "JH-SAN-712" },
            { title: "Drainage overflow during monsoon", sub: "Kanke Main Rd", status: "under-review", id: "JH-DRN-389" },
            { title: "Street light pole damaged", sub: "Sector 2 Block B", status: "resolved", id: "JH-EL-204" },
          ].map(p => (
            <Card key={p.id} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {p.sub}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

function OrgSolverLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form State
  const [orgName, setOrgName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocPhone, setSpocPhone] = useState("");
  const [domain, setDomain] = useState("Community Development & Healthcare");
  const [address, setAddress] = useState("");

  const finishVerifiedAuthentication = async () => {
    await syncAuth("ORGANIZATION", lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onNav("org-solver-dashboard"); } catch { /* New profile. */ }
    setStep("profile");
  };
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
          const { checkEmailExists } = await import("./api");
          await checkEmailExists(email.trim());
          await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) { if (authMode === "signup") await sendEmailVerification(user); setStep("verify"); return; }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("OrgSolver Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If this is your first time, click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please sign in instead.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid organisation email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !spocName.trim() || !address.trim() || !isValidMobile(spocPhone)) {
      setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await saveOrgProfile({
        organizationName: orgName,
        registrationNumber: regNum,
        spocName,
        spocContact: spocPhone,
        domain,
        registeredAddress: address,
      });
      onNav("org-solver-dashboard");
    } catch (err: any) {
      console.error("Org Profile Save Error:", err);
      setErrorMsg(err.message || "Failed to save organisation profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader 
        onBack={() => {
          if (step === "profile" || step === "verify") setStep("email");
          else onNav("solver-select");
        }} 
        onNav={onNav} 
      />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
              style={{ background: "var(--navy)" }}>
              <Briefcase size={24} color="var(--amber)" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
              {step === "email" ? t("org.verify_email_title") : t("org.profile_setup")}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {step === "email" ? "Professional Entity Email Authentication" : "Professional Entity Onboarding"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--navy)" }} />
            <div className="flex-1 h-1.5 rounded-full" style={{ background: step === "profile" ? "var(--navy)" : "var(--border)" }} />
          </div>

          <Card className="p-6">
            {step === "email" && (
              <EmailPasswordAuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                authMode={authMode}
                setAuthMode={setAuthMode}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={handleAuthSubmit}
                emailPlaceholder="e.g. contact@ranchitrust.org"
                emailLabel="Organisation Official Email"
                emailHint="Enter your registered NGO / non-profit / organisation email address."
              />
            )}
            {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}

            {step === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <div className="p-2.5 rounded-xl flex items-center gap-2" style={{ background: "var(--success-bg)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                    Authenticated: {email}
                  </span>
                </div>

                <h2 className="font-bold mb-2 text-base" style={{ color: "var(--text)" }}>
                  <Building2 size={16} className="inline mr-1" /> Organisation Profile
                </h2>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Organisation Name <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="e.g. Ranchi Development Trust"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registration Number (e.g., Darpan ID)</label>
                  <input
                    value={regNum}
                    onChange={e => setRegNum(e.target.value)}
                    placeholder="e.g. JH/2021/012948"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={spocName}
                    onChange={e => setSpocName(e.target.value)}
                    placeholder="Single Point of Contact name"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
                    <Phone size={12} className="inline mr-1" /> SPOC Contact Number <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2 rounded-xl text-sm font-medium border"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={spocPhone}
                      maxLength={10}
                      inputMode="numeric"
                      onChange={e => setSpocPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Organization Profile Description (AI Analyzed) <span style={{ color: "var(--error)" }}>*</span></label>
                  <textarea
                    required
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    rows={3}
                    placeholder="Describe your organization capabilities. AI will automatically match you with relevant problems."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registered Office Address <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Full registered office address"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                {errorMsg && (
                  <div className="p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}
                <Btn type="submit" disabled={loading} className="w-full mt-2 cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>
                  {loading ? "Saving Profile..." : "Complete Registration"}
                </Btn>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── ORG SOLVER DASHBOARD ─────────────────────────────────────────────────────
function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, setSelectedTrackingId } = useApp();
  const profile = useProfileDisplay("org-solver");
  const [recommended, setRecommended] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ benefited: 0 });
  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);

  useEffect(() => {
    import('./api').then(({ getRecommendedProblems, getMyProblems, getStats }) => {
      getRecommendedProblems().then(data => { if(data) setRecommended(data.problems || []); }).catch(console.error);
      getMyProblems().then(data => { if(data) setMyProjects(data.problems || []); }).catch(console.error);
      getStats().then(data => { if (data && data.success) setStats(data); }).catch(console.error);
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
      <NavBar role="org-solver" screen="org-solver-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <Building2 size={22} /> {t("ngo.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{profile.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "Recommended", value: recommended.length.toString(), color: "var(--amber)", filterStr: "SUBMITTED" },
            { icon: <Activity size={18} />, label: "Active", value: myProjects.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString(), color: "var(--navy)", filterStr: "IN_PROGRESS" },
            { icon: <ThumbsUp size={18} />, label: "Resolved", value: myProjects.filter(p => p.status === "SOLVED").length.toString(), color: "var(--success)", filterStr: "SOLVED" },
            { icon: <Users size={18} />, label: "Benefited", value: stats.benefited.toString(), color: "#7C3AED", filterStr: "" },
          ].map(k => (
             <div key={k.label} className={k.filterStr ? "cursor-pointer active:scale-95 transition-all" : ""} onClick={() => k.filterStr && setSelectedFilter({ title: k.label, color: k.color, filterStr: k.filterStr })}>
               <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
             </div>
          ))}
        </div>
        
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>AI Recommended Complaints</h3>
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
                    <div className="font-black text-xl sm:text-2xl" style={{ color: "var(--success)" }}>{c.match_percentage || 82}%</div>
                    <div className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>AI MATCH</div>
                 </div>
               </div>
               
               <div className="mb-3 space-y-1">
                 {(c.match_reasons || ["Matches capabilities", "Semantic Alignment: High"]).map((r: string, idx: number) => (
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
          {recommended.length === 0 && <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>No recommendations available. Please edit your Profile Description.</div>}
        </div>
      </div>
    </div>
  );
}

function TeamFormationScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const team = [
    { role: "Faculty Mentor", name: "Dr. Priya Rajan", dept: "Civil Eng.", icon: <User size={20} color="white" /> },
    { role: "Student — Civil", name: "Arjun Mahato", dept: "B.Tech Civil, Yr 4", icon: <User size={20} color="white" /> },
    { role: "Student — Environmental", name: "Sunita Oraon", dept: "M.Sc. Env Sci", icon: <User size={20} color="white" /> },
    { role: "Student — IoT", name: "Rajan Kumar", dept: "B.Tech ECE, Yr 3", icon: <User size={20} color="white" /> },
    { role: "Student — Data", name: "Priti Soren", dept: "M.Tech CS, Yr 1", icon: <User size={20} color="white" /> },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-challenge-detail")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <Users size={22} /> Team Formation
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>AI-assisted multidisciplinary team for JH-WTR-1024</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="p-5 mb-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["Civil Engineering", "Environmental Science", "IoT / Sensors", "Data Analytics"].map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: "#EFF6FF", color: "var(--navy)", border: "1px solid #BFDBFE" }}>{s}</span>
                ))}
              </div>
            </Card>
            
          </div>
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Partner</h3>
              <div className="p-3 rounded-xl" style={{ background: "var(--success-bg)", border: "1px solid var(--green)" }}>
                <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: "var(--green)" }}>
                  <Factory size={13} /> AquaSense IoT Solutions — 89% match
                </p>
                <p className="text-xs" style={{ color: "var(--text)" }}>IoT hardware + field testing support</p>
                <Btn variant="secondary" className="mt-2 text-xs w-full">Invite Partner</Btn>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Team Summary</h3>
              {[["Faculty Mentors", "1"], ["Students", "4"], ["Industry Partner", "1 (pending)"], ["Skills Covered", "4/4"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="font-bold" style={{ color: k === "Skills Covered" ? "var(--success)" : "var(--text)" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={() => onNav("proposal")} className="w-full py-4 text-base" icon={<ArrowRight size={18} />}>
              Create Team & Write Proposal
            </Btn>
            <Btn variant="ghost" className="w-full" icon={<RefreshCw size={16} />}>Change Members</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROPOSAL ────────────────────────────────────────────────────────────────
function ProjectHealthScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const factors = [
    { label: "Milestone Progress", score: 75, icon: <Clock size={16} /> },
    { label: "Deliverables Submitted", score: 90, icon: <FileText size={16} /> },
    { label: "Mentor Engagement", score: 88, icon: <User size={16} /> },
    { label: "Testing Progress", score: 55, icon: <Activity size={16} /> },
    { label: "Timeline Adherence", score: 70, icon: <TrendingUp size={16} /> },
    { label: "Risk Level", score: 80, icon: <AlertTriangle size={16} /> },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="project-lifecycle" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("project-lifecycle")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: "var(--navy)" }}>
          <Heart size={22} /> {t("proj.health")} Score
        </h1>
        <Card className="p-6 mb-5 text-center">
          <ProgressRing value={82} size={120} stroke={10} />
          <h2 className="text-2xl font-black mt-4" style={{ color: "var(--success)" }}>ON TRACK</h2>
          <StatusBadge status="on-track" />
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Testing progress is slower than expected and may affect deployment if not addressed soon.
          </p>
          <p className="text-xs mt-2 italic" style={{ color: "var(--text-muted)" }}>
            This is an early-warning indicator, not a guaranteed prediction.
          </p>
        </Card>
        <Card className="p-5 mb-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Health Factor Breakdown</h3>
          <div className="space-y-3">
            {factors.map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span style={{ color: "var(--text-muted)", width: 18 }}>{f.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: "var(--text)" }}>{f.label}</span>
                    <span className="font-bold" style={{
                      color: f.score >= 80 ? "var(--success)" : f.score >= 60 ? "var(--warning)" : "var(--error)"
                    }}>{f.score}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-2 rounded-full" style={{
                      width: `${f.score}%`,
                      background: f.score >= 80 ? "var(--success)" : f.score >= 60 ? "var(--warning)" : "var(--error)"
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5" style={{ borderColor: "var(--warning)" }}>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: "var(--warning)" }}>
            <AlertTriangle size={15} /> Risk Alert
          </h3>
          <p className="text-sm mb-2" style={{ color: "var(--text)" }}>
            Testing progress (55%) is below target (75%). Consider:
          </p>
          <ul className="space-y-1">
            {["Allocating additional resources to testing", "Requesting a 1-week extension", "Running parallel tests where possible"].map(s => (
              <li key={s} className="text-xs flex items-start gap-2" style={{ color: "var(--text-muted)" }}>
                <ChevronRight size={12} className="mt-0.5 flex-shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ─── INDUSTRY DASHBOARD ───────────────────────────────────────────────────────
function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
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
}

function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Smart Irrigation Monitoring System</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 • BIT Mesra × Ranchi District</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem", c: "40% water leakage in irrigation canal serving 500 farmers across 6 villages." },
              { t: "Solution", c: "IoT-based real-time leak detection with flow sensors + canal lining restoration." },
              { t: "Technology", c: "IoT sensors (Arduino/ESP32 + LoRa), cloud dashboard, GIS mapping, civil restoration." },
              { t: "Expected Impact", c: "500 farmers, 40% → <10% water loss, ₹8L/year savings, replicable across 200+ canals." },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Match</h3>
              <ProgressRing value={89} size={80} color="var(--green)" />
              <div className="mt-3 space-y-2 text-xs text-left">
                {[["Domain Fit", "IoT + Agriculture"], ["Support Type", "Hardware + Tech"], ["Health", "82% ON TRACK"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Btn onClick={() => onNav("partnership-form")} className="w-full" icon={<Users size={16} />}>
              {t("ind.mentorship")}
            </Btn>
            <Btn variant="secondary" className="w-full" icon={<TrendingUp size={16} />}>{t("ind.funding")}</Btn>
            <Btn variant="ghost" className="w-full" icon={<Briefcase size={16} />}>Co-Develop</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PARTNERSHIP FORM ────────────────────────────────────────────────────────
function PartnershipFormScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [supports, setSupports] = useState<string[]>(["Mentorship", "Hardware"]);
  const toggleSupport = (s: string) =>
    setSupports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="partnership-form" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-project-detail")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: "var(--navy)" }}>
          <Users size={22} /> Partnership Offer
        </h1>
        <Card className="p-6 space-y-5">
          {[
            { label: "Organisation Name", val: "TechGrow Solutions Pvt. Ltd." },
            { label: "Contact Person", val: "Sanjay Mehta, CTO" },
            { label: "Email", val: "sanjay@techgrow.in" },
            { label: "Expertise Area", val: "IoT Hardware, Embedded Systems, Agriculture Tech" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{f.label}</label>
              <input defaultValue={f.val}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "var(--text)" }}>Support Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["Mentorship", "Funding", "Hardware", "Infrastructure", "Field Testing", "Co-development", "Technology Transfer", "Training"].map(s => (
                <button key={s} onClick={() => toggleSupport(s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border-2 text-left transition-all"
                  style={{
                    borderColor: supports.includes(s) ? "var(--green)" : "var(--border)",
                    background: supports.includes(s) ? "var(--success-bg)" : "var(--card)",
                    color: "var(--text)"
                  }}>
                  {supports.includes(s) ? <CheckCircle size={14} color="var(--green)" /> : <div className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: "var(--border)" }} />}
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Budget (₹)</label>
              <input defaultValue="1,50,000"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Mentor Availability</label>
              <input defaultValue="10 hrs/week"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <Btn onClick={() => onNav("partnership-success")} className="w-full py-4 text-base"
            icon={<SendHorizontal size={18} />}>
            {t("ind.partner")}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── PARTNERSHIP SUCCESS ──────────────────────────────────────────────────────
function PartnershipSuccessScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--success-bg)" }}>
        <Users size={40} color="var(--success)" />
      </div>
      <h1 className="text-xl font-black mb-2" style={{ color: "var(--success)" }}>Partnership Offer Submitted!</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        TechGrow Solutions' offer has been sent to BIT Mesra. They will confirm within 3 working days.
      </p>
      <div className="flex gap-3">
        <Btn onClick={() => onNav("industry-dashboard")}>Back to Dashboard</Btn>
        <Btn variant="secondary" onClick={() => onNav("project-lifecycle")}>View Project</Btn>
      </div>
    </div>
  );
}

// ─── SOLUTION REPOSITORY ──────────────────────────────────────────────────────
function SolutionRepoScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const solutions = [
    { title: "IoT-Based Irrigation Monitoring", cat: "Water / Agriculture", loc: "Kanke, Ranchi", uni: "BIT Mesra", beneficiaries: "2,500 farmers", status: "deployed" as const },
    { title: "Mobile Health Diagnostic App", cat: "Healthcare", loc: "Dhanbad", uni: "AIIMS Deoghar", beneficiaries: "8,000 residents", status: "deployed" as const },
    { title: "Solar Water Pump Controller", cat: "Water / Energy", loc: "Bokaro", uni: "NIT Jamshedpur", beneficiaries: "1,200 farmers", status: "deployed" as const },
    { title: "Community Waste Segregation", cat: "Sanitation", loc: "Ranchi Urban", uni: "BIT Mesra", beneficiaries: "15,000 residents", status: "in-progress" as const },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="govt" screen="solution-repo" onNav={onNav} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <BookOpen size={22} /> {t("repo.title")}
        </h1>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Knowledge bank of deployed and reusable solutions for Jharkhand
        </p>
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("repo.search")}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
          <Btn variant="ghost" className="text-xs" icon={<Filter size={14} />}>Filter</Btn>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["All", "Water", "Agriculture", "Healthcare", "Education", "Energy", "Sanitation"].map(f => (
            <button key={f}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
              style={{
                background: f === "All" ? "var(--navy)" : "var(--card)",
                color: f === "All" ? "white" : "var(--text-muted)",
                borderColor: "var(--border)"
              }}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solutions.map((s, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{s.title}</h3>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {s.loc} • <GraduationCap size={11} /> {s.uni}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{s.cat}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                  style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                  <Users size={10} className="inline mr-0.5" />{s.beneficiaries}
                </span>
              </div>
              <div className="flex gap-2">
                <Btn variant="secondary" onClick={() => onNav("solution-detail")} className="flex-1 text-xs"
                  icon={<Eye size={13} />}>{t("repo.view")}</Btn>
                <Btn onClick={() => onNav("solution-detail")} className="flex-1 text-xs"
                  icon={<RefreshCw size={13} />}>{t("repo.reuse")}</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SOLUTION DETAIL ──────────────────────────────────────────────────────────
function SolutionDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="govt" screen="solution-repo" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("solution-repo")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> {t("repo.title")}</button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-black" style={{ color: "var(--navy)" }}>IoT-Based Irrigation Monitoring</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>BIT Mesra × AquaSense IoT × Ranchi District</p>
          </div>
          <StatusBadge status="deployed" />
        </div>

        <div className="p-4 rounded-xl border mb-6 flex items-center gap-3"
          style={{ background: "#EDE9FE", borderColor: "#C4B5FD" }}>
          <RefreshCw size={20} color="#5B21B6" />
          <div>
            <p className="text-sm font-bold" style={{ color: "#5B21B6" }}>
              This solution may be reusable for 4 similar challenges.
            </p>
            <p className="text-xs" style={{ color: "#6D28D9" }}>
              Similar water problems found in Bokaro (2), Giridih (1), Hazaribagh (1).
            </p>
          </div>
          <Btn className="ml-auto text-xs flex-shrink-0" onClick={() => onNav("govt-validation")}
            icon={<ArrowRight size={13} />}>
            Reuse / Adapt
          </Btn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem Solved", c: "40% water leakage in main irrigation canal serving 500+ farmers. Persistent for 3 months." },
              { t: "Solution Implemented", c: "IoT flow sensors at 12 strategic points. Cloud dashboard with real-time monitoring. Canal lining restored at 6 breach points." },
              { t: "Technology Used", c: "Arduino Uno + LoRa sensors, MQTT cloud protocol, Node.js dashboard, GPS mapping, Portland cement canal lining." },
              { t: "Deployment Guide", c: "Install sensors at canal entry/exit points. Configure LoRa network. Train local Panchayat maintenance team (4-hour training). Dashboard via mobile app." },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Impact Summary</h3>
              {[
                { l: "Farmers Benefited", v: "2,500" },
                { l: "Villages Covered", v: "18" },
                { l: "Water Loss Before", v: "40%" },
                { l: "Water Loss After", v: "8%" },
                { l: "Est. Annual Savings", v: "₹8L/year" },
                { l: "Implementation Cost", v: "₹4.5L" },
              ].map(item => (
                <div key={item.l} className="flex justify-between text-sm py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.l}</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{item.v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMPACT DASHBOARD ─────────────────────────────────────────────────────────
function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="govt" screen="impact-dashboard" onNav={onNav} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
            <TrendingUp size={22} /> Impact Dashboard
          </h1>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Demo Data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Users size={18} />, label: t("impact.people"), value: "2,42,000+", color: "var(--green)" },
            { icon: <Map size={18} />, label: t("impact.villages"), value: "312", color: "var(--navy)" },
            { icon: <Lightbulb size={18} />, label: t("impact.solutions"), value: "312", color: "#7C3AED" },
            { icon: <TrendingUp size={18} />, label: t("impact.savings") + " (₹Cr)", value: "18.4", color: "#B45309" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Before vs. After — Water</h3>
            <div className="space-y-4">
              {[
                { label: "Canal Water Loss", before: 40, after: 8, unit: "%" },
                { label: "Handpump Failures (Unresolved)", before: 85, after: 12, unit: "%" },
                { label: "Irrigation Coverage", before: 45, after: 78, unit: "% of farmland" },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text)" }}>{m.label}</p>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--text-muted)" }}>Before</span>
                        <span className="font-bold" style={{ color: "var(--error)" }}>{m.before}{m.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full" style={{ background: "var(--error-bg)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${m.before}%`, background: "var(--error)" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--text-muted)" }}>After</span>
                        <span className="font-bold" style={{ color: "var(--success)" }}>{m.after}{m.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full" style={{ background: "var(--success-bg)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${m.after}%`, background: "var(--success)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Star size={15} /> Citizen Feedback
            </h3>
            <div className="space-y-3">
              {[
                { name: "Ram Kumar, Bakri Bazar", rating: 5, text: "The handpump is fixed. Now we get water in the morning. Very happy!" },
                { name: "Sunita Devi, Lalgutwa", rating: 4, text: "Canal water is much better now. My crop is growing well this season." },
                { name: "Mukesh Oraon, Kanke", rating: 5, text: "The app is easy to use. Problem was fixed within 2 months!" },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{r.name}</span>
                    <div className="flex">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} size={11} fill="var(--amber)" color="var(--amber)" />)}
                    </div>
                  </div>
                  <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Leaf size={15} color="var(--green)" /> Environmental Impact
            </h3>
            <div className="space-y-3">
              {[
                { icon: <Droplets size={18} />, val: "48 Cr litres/year", label: "Water Conserved" },
                { icon: <Leaf size={18} />, val: "1,240 tonnes/year", label: "CO₂ Avoided" },
                { icon: <Zap size={18} />, val: "18,000 kWh/month", label: "Solar Generated" },
                { icon: <Leaf size={18} />, val: "12,400+", label: "Trees Planted" },
              ].map(e => (
                <div key={e.label} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--success-bg)" }}>
                  <span style={{ color: "var(--green)" }}>{e.icon}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--green)" }}>{e.val}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{e.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("jsic_lang") as Lang) || "en");
  const [dark, setDark] = useState(() => localStorage.getItem("jsic_dark") === "1");
  const [screen, setScreen] = useState<Screen>("landing");
  const [role, setRole] = useState("citizen");
  const [authChecked, setAuthChecked] = useState(false);
  const [report, setReport] = useState({ description: "", category: "", categoryId: "", evidence: "", files: [] as File[], previews: [] as string[], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "", aiAnalysis: null as any, impactReport: null as any, status: undefined as string | undefined });
  // On initial website load, show language selection popup, followed immediately by Mitra full-body welcome
  const [showLangModal, setShowLangModal] = useState(() => !localStorage.getItem("jsic_lang"));
  const [showMitraWelcome, setShowMitraWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500);
    let unsubscribe = () => {};
    import("./firebase/config").then(({ auth }) => {
      unsubscribe = auth.onAuthStateChanged(user => {
        if (!user) {
          setRole("citizen");
          setScreen("landing");
          sessionStorage.removeItem("active_screen");
          sessionStorage.removeItem("active_role");
          localStorage.removeItem("active_screen"); // Clear legacy
          setAuthChecked(true);
        } else {
          import("./api").then(({ getProfileMe }) => {
            getProfileMe().then(data => {
              const st = data?.user?.sub_type;
              let r = "citizen";
              if (st === "PANCHAYAT") r = "panchayat";
              else if (st === "LOCAL_ORG") r = "localorg";
              else if (st === "ORGANIZATION") r = "org-solver";
              else if (st === "INDUSTRY") r = "industry";
              else if (st === "UNIVERSITY") r = "university";
              
              setRole(r);
              sessionStorage.setItem("active_role", r);
              
              const sessionScreen = sessionStorage.getItem("active_screen") as Screen;
              if (sessionScreen && sessionScreen !== "landing") {
                setScreen(sessionScreen);
              } else {
                const home = getHomeDashboard(r);
                setScreen(home);
                sessionStorage.setItem("active_screen", home);
              }
              setAuthChecked(true);
            }).catch(err => {
              console.error(err);
              const sr = sessionStorage.getItem("active_role") || "citizen";
              setRole(sr);
              const ss = sessionStorage.getItem("active_screen") as Screen;
              if (ss && ss !== "landing") {
                setScreen(ss);
              } else {
                setScreen(getHomeDashboard(sr));
              }
              setAuthChecked(true);
            });
          });
        }
      });
    });
    return () => { clearTimeout(timer); unsubscribe(); };
  }, []);

  const t = makeT(lang);

  const setLangAndSave = (l: Lang) => { setLang(l); localStorage.setItem("jsic_lang", l); };
  const setDarkAndSave = (d: boolean) => { setDark(d); localStorage.setItem("jsic_dark", d ? "1" : "0"); };

  const navigate = (s: Screen) => {
    setLoading(true);
    const roleMap: Partial<Record<Screen, string>> = {
      "citizen-login": "citizen", "citizen-dashboard": "citizen",
      "panchayat-login": "panchayat", "panchayat-dashboard": "panchayat",
      "org-victim-login": "localorg", "org-victim-dashboard": "localorg",
      "uni-login": "university", "uni-dashboard": "university",
      "industry-login": "industry", "industry-dashboard": "industry",
      "org-solver-login": "org-solver", "org-solver-dashboard": "org-solver",
    };
    if (roleMap[s]) {
      setRole(roleMap[s]!);
      sessionStorage.setItem("active_role", roleMap[s]!);
    }
    setTimeout(() => {
      setScreen(s);
      sessionStorage.setItem("active_screen", s);
      localStorage.removeItem("active_screen");
      window.scrollTo(0, 0);
      setLoading(false);
    }, 450);
  };

  const props = { onNav: navigate };

  return (
    <Ctx.Provider value={{ lang, setLang: setLangAndSave, dark, setDark: setDarkAndSave, t, role, setRole, report, setReport }}>
      <div className={dark ? "dark" : ""} style={{ minHeight: "100%", background: "var(--bg)", color: "var(--text)" }}>
        {/* Global NavJhar Rotating Loading Overlay */}
        <NavJharLoadingOverlay show={loading || initialLoading || !authChecked} />

        {authChecked && (
          <>
        {/* Language modal — blocks entry on first visit */}
        {showLangModal && (
          <LanguageModal onDone={(l) => {
            setLangAndSave(l);
            setShowLangModal(false);
            setShowMitraWelcome(true);
          }} />
        )}

        {/* Mitra Welcome Intro — shown immediately after language selection */}
        {showMitraWelcome && (
          <MitraWelcomeModal onContinue={() => setShowMitraWelcome(false)} />
        )}

        {screen === "landing" && <LandingScreen {...props} />}
        {screen === "victim-select" && <VictimSelectScreen {...props} />}
        {screen === "solver-select" && <SolverSelectScreen {...props} />}
        {screen === "citizen-login" && <CitizenLoginScreen {...props} />}
        {screen === "panchayat-login" && <PanchayatLoginScreen {...props} />}
        {screen === "org-victim-login" && <OrgVictimLoginScreen {...props} />}
        {screen === "panchayat-dashboard" && <PanchayatDashboardScreen {...props} />}
        {screen === "org-victim-dashboard" && <OrgVictimDashboardScreen {...props} />}
        {screen === "org-solver-login" && <OrgSolverLoginScreen {...props} />}
        {screen === "org-solver-dashboard" && <OrgSolverDashboardScreen {...props} />}
        {screen === "uni-login" && <OrgSolverLoginScreen {...props} />}
        {screen === "industry-login" && <OrgSolverLoginScreen {...props} />}
        {screen === "citizen-dashboard" && <CitizenDashboardScreen {...props} />}
        {screen === "report-step1" && <ReportStep1Screen {...props} />}
        {screen === "report-step2" && <ReportStep2Screen {...props} />}
        {screen === "report-step3" && <ReportStep3Screen {...props} />}
        {screen === "ai-processing" && <AIProcessingScreen {...props} />}
        {screen === "ai-result" && <AIResultScreen {...props} />}
        {screen === "submit-success" && <SubmitSuccessScreen {...props} />}
        {screen === "tracking" && <TrackingScreen {...props} />}
        {screen === "problems-near-me" && <ProblemsNearMeScreen {...props} />}
        {screen === "report-for-someone" && <ReportForSomeoneScreen {...props} />}
        {screen === "uni-dashboard" && <UniDashboardScreen {...props} />}
        {screen === "uni-challenge-detail" && <UniChallengeDetailScreen {...props} />}
        {screen === "team-formation" && <TeamFormationScreen {...props} />}
        {screen === "proposal" && <ProposalScreen {...props} />}
        {screen === "project-lifecycle" && <ProjectLifecycleScreen {...props} />}
        {screen === "project-health" && <ProjectHealthScreen {...props} />}
        {screen === "industry-dashboard" && <IndustryDashboardScreen {...props} />}
        {screen === "industry-project-detail" && <IndustryProjectDetailScreen {...props} />}
        {screen === "partnership-form" && <PartnershipFormScreen {...props} />}
        {screen === "partnership-success" && <PartnershipSuccessScreen {...props} />}
        {screen === "solution-repo" && <SolutionRepoScreen {...props} />}
        {screen === "solution-detail" && <SolutionDetailScreen {...props} />}
        {screen === "impact-dashboard" && <ImpactDashboardScreen {...props} />}
        {screen === "notifications" && <NotificationsScreen {...props} role={role} />}
        {screen === "profile" && <ProfileScreen {...props} role={role} />}
        {screen === "feedback" && <FeedbackScreen {...props} />}
          </>
        )}
      </div>
    </Ctx.Provider>
  );
}
