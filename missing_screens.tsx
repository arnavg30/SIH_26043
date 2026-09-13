function UniDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const challenges = [
    { title: "Village Irrigation Canal Leakage", loc: "Kanke, Ranchi", pri: 87, match: 92, pop: 500, cat: "Water", status: "new" as const },
    { title: "School roof needs repair", loc: "Namkum, Ranchi", pri: 72, match: 86, pop: 320, cat: "Education", status: "matched" as const },
    { title: "Primary health centre closed", loc: "Ratu, Ranchi", pri: 91, match: 79, pop: 1200, cat: "Healthcare", status: "new" as const },
    { title: "Solar-powered street lighting", loc: "Ormanjhi, Ranchi", pri: 65, match: 88, pop: 450, cat: "Energy", status: "validated" as const },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <GraduationCap size={22} /> {t("uni.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>BIT Mesra, Ranchi — Innovation Partner</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Demo Data</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "New Challenges", value: "8", color: "var(--amber)" },
            { icon: <CheckCircle size={18} />, label: "Accepted", value: "14", color: "var(--green)" },
            { icon: <Activity size={18} />, label: "Active Projects", value: "11", color: "var(--navy)" },
            { icon: <ThumbsUp size={18} />, label: "Completed", value: "23", color: "var(--success)" },
            { icon: <AlertTriangle size={18} />, label: "At Risk", value: "2", color: "var(--error)" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title}</h3>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {c.loc}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{c.cat}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                  <Users size={10} className="inline mr-0.5" />{c.pop.toLocaleString()} affected
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Priority</div>
                  <PriorityBar score={c.pri} />
                </div>
                <div className="text-right">
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>AI Match</div>
                  <div className="font-black text-xl" style={{ color: "var(--success)" }}>{c.match}%</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn onClick={() => onNav("uni-challenge-detail")} variant="ghost" className="flex-1 text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => onNav("team-formation")} className="flex-1 text-xs"
                  icon={<CheckCircle size={13} />}>{t("btn.accept")}</Btn>
                <Btn variant="danger" className="text-xs px-2" icon={<XCircle size={13} />}></Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── UNI CHALLENGE DETAIL ─────────────────────────────────────────────────────
function UniChallengeDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Village Irrigation Canal Leakage</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 • Kanke, Ranchi • Aug 28, 2026</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>Problem Description</h3>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                The main irrigation canal serving Bakri Bazar and surrounding villages has developed multiple
                leak points. Approximately 40% of water is lost, severely impacting ~500 farmers across 6 villages.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <Layers size={15} /> Challenge DNA
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[["Domain", "Water / Agriculture"], ["Severity", "High"],  ["Skills", "Civil + IoT"], ["Impact", "High"], ["Deadline", "Sep 30, 2026"]].map(([k, v]) => (
                  <div key={k} className="p-2 rounded-xl" style={{ background: "var(--bg)" }}>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{k}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{v}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recommended Industry Partners</h3>
              {[
                { name: "AquaSense IoT Solutions", match: 89, type: "IoT / Technology" },
                { name: "Jharkhand Infrastructure Ltd.", match: 82, type: "Civil Construction" },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.type}</p>
                  </div>
                  <span className="font-black text-sm" style={{ color: "var(--green)" }}>{p.match}%</span>
                </div>
              ))}
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>AI Match Score</h3>
              <ProgressRing value={92} size={90} />
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--success-bg)" }}>
                <CheckCircle size={18} color="var(--success)" />
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--success)" }}>Verified & Approved</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ranchi Collectorate • Aug 30</p>
                </div>
              </div>
            </Card>
            <Btn onClick={() => onNav("team-formation")} className="w-full" icon={<CheckCircle size={16} />}>
              {t("uni.accept")}
            </Btn>
            <Btn variant="secondary" onClick={() => onNav("team-formation")} className="w-full" icon={<Users size={16} />}>
              Form Team
            </Btn>
            <Btn variant="ghost" className="w-full" icon={<MessageSquare size={16} />}>
              Contact Government
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEAM FORMATION ───────────────────────────────────────────────────────────
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
function ProposalScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("team-formation")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <FileText size={22} /> Project Proposal
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 — Village Irrigation Canal Leakage</p>
        <Card className="p-6 space-y-5">
          {[
            { label: "Problem Understanding", val: "The irrigation canal serving 500+ farmers has 40% water loss due to multiple breach points over 3 months." },
            { label: "Proposed Solution", val: "Smart IoT-based leak detection system combined with canal lining reinforcement. Sensors monitor flow rate at key points." },
            { label: "Technology Approach", val: "IoT flow sensors (Arduino + LoRa), cloud dashboard (MQTT/Node.js), GIS mapping, cement canal lining restoration." },
            { label: "Expected Impact", val: "500 farmers, 18 villages, 40% → <10% water loss, ₹8L estimated annual crop savings." },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{f.label}</label>
              <textarea rows={3} defaultValue={f.val}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Estimated Cost (₹)</label>
              <input defaultValue="4,50,000"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Timeline</label>
              <input defaultValue="3 months (Sep–Nov 2026)"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={() => onNav("project-lifecycle")} className="flex-1" icon={<SendHorizontal size={16} />}>
              {t("btn.submit")} Proposal
            </Btn>
            <Btn variant="ghost" className="px-4" icon={<BookOpen size={16} />}>{t("btn.save")}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PROJECT LIFECYCLE ────────────────────────────────────────────────────────
function ProjectLifecycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const milestones = [
    { label: "Research & Survey", date: "Sep 1–7", done: true },
    { label: "Prototype Design", date: "Sep 8–15", done: true },
    { label: "Testing & Validation", date: "Sep 16–30", active: true, behind: true },
    { label: "Pilot Implementation", date: "Oct 1–20", pending: true },
    { label: "Full Deployment", date: "Nov 1–15", pending: true },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="project-lifecycle" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Card className="p-5 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-black" style={{ color: "var(--navy)" }}>Smart Irrigation Monitoring System</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                JH-WTR-1024 • BIT Mesra × AquaSense IoT • Kanke, Ranchi
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status="on-track" />
              <button onClick={() => onNav("project-health")}
                className="text-xs font-semibold mt-2 block hover:underline"
                style={{ color: "var(--navy)" }}>
                {t("proj.health")} →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[["Progress", "68%"], ["Health Score", "82%"], ["Days Remaining", "47"], ["Team", "5"]].map(([l, v]) => (
              <div key={l} className="p-3 rounded-xl text-center" style={{ background: "var(--bg)" }}>
                <div className="text-xl font-black" style={{ color: "var(--navy)" }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "var(--text-muted)" }}>{t("proj.progress")}</span>
              <span className="font-bold" style={{ color: "var(--green)" }}>68%</span>
            </div>
            <div className="h-3 rounded-full" style={{ background: "var(--border)" }}>
              <div className="h-3 rounded-full" style={{ width: "68%", background: "var(--green)" }} />
            </div>
          </div>
        </Card>

        <div className="p-4 rounded-xl border mb-6 flex items-start gap-3"
          style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
          <AlertTriangle size={20} color="var(--warning)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--warning)" }}>Testing milestone is behind schedule.</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text)" }}>
              Testing phase is 4 days behind. May affect Pilot Implementation deadline.
            </p>
          </div>
          <Btn variant="ghost" onClick={() => {}} className="ml-auto text-xs flex-shrink-0">{t("proj.extension")}</Btn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Milestones</h3>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: m.done ? "var(--success)" : m.active ? (m.behind ? "var(--warning-bg)" : "var(--amber)") : "var(--border)",
                      color: m.done ? "white" : m.active ? (m.behind ? "var(--warning)" : "var(--navy)") : "var(--text-muted)"
                    }}>
                    {m.done ? <CheckCircle size={16} /> : m.active ? <Activity size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold"
                      style={{ color: m.done ? "var(--text)" : m.active ? (m.behind ? "var(--warning)" : "var(--navy)") : "var(--text-muted)" }}>
                      {m.label}
                      {m.behind && <span className="ml-2 text-xs" style={{ color: "var(--warning)" }}>Behind schedule</span>}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Project Team</h3>
              {[
                { name: "Dr. Priya Rajan", role: "Faculty Mentor" },
                { name: "Arjun Mahato", role: "Civil Lead" },
                { name: "Rajan Kumar", role: "IoT Developer" },
                { name: "Priti Soren", role: "Data Analyst" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: i === 0 ? "var(--navy)" : "var(--success-bg)" }}>
                    <User size={14} color={i === 0 ? "white" : "var(--green)"} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{m.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.role}</p>
                  </div>
                </div>
              ))}
            </Card>
            <Btn className="w-full" icon={<Activity size={16} />}>{t("proj.update")}</Btn>
            <Btn variant="secondary" className="w-full" icon={<Upload size={16} />}>{t("proj.upload")}</Btn>
            <Btn variant="ghost" className="w-full" onClick={() => onNav("project-health")} icon={<Heart size={16} />}>
              View Project Health
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT HEALTH ───────────────────────────────────────────────────────────
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
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <Factory size={22} /> {t("ind.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>TechGrow Solutions Pvt. Ltd.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "Recommended Projects", value: "12", color: "var(--amber)" },
            { icon: <Users size={18} />, label: "Active Partnerships", value: "4", color: "var(--green)" },
            { icon: <GraduationCap size={18} />, label: "Mentorship", value: "3", color: "var(--navy)" },
            { icon: <TrendingUp size={18} />, label: "CSR Funding (₹L)", value: "24.5", color: "#7C3AED" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>

        <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Lightbulb size={16} /> Recommended Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Smart Irrigation Monitoring", match: 89, cat: "IoT / Agriculture", uni: "BIT Mesra", reasons: ["IoT requirement", "Agriculture domain", "Prototype support needed"] },
            { title: "Rural Health Diagnostic Kit", match: 84, cat: "Healthcare / IoT", uni: "NIT Jamshedpur", reasons: ["Medical device IoT", "Rural deployment", "CSR opportunity"] },
            { title: "Solar Street Lighting", match: 78, cat: "Energy / Infrastructure", uni: "IIT ISM Dhanbad", reasons: ["Solar technology", "Manufacturing capability", "Scale potential"] },
            { title: "Digital Literacy Kiosk", match: 72, cat: "Education / Tech", uni: "BIT Mesra", reasons: ["Software development", "Rural reach", "Training support"] },
          ].map((p, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.cat} • {p.uni}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl" style={{ color: "var(--success)" }}>{p.match}%</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Match</div>
                </div>
              </div>
              <div className="mb-3 space-y-1">
                {p.reasons.map(r => (
                  <p key={r} className="text-xs flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                    <CheckCircle size={11} /> {r}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn onClick={() => onNav("industry-project-detail")} variant="secondary" className="text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => onNav("partnership-form")} className="text-xs" icon={<Users size={13} />}>Collaborate</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INDUSTRY PROJECT DETAIL ──────────────────────────────────────────────────
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
function NotificationsScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const allNotifs = {
    citizen: [
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Challenge Verified", sub: "JH-WTR-1024 verified by Ranchi Collectorate.", time: "2h ago", read: false, screen: "tracking" as Screen },
      { icon: <GraduationCap size={18} color="var(--navy)" />, title: "University Matched", sub: "BIT Mesra accepted your challenge.", time: "1d ago", read: false, screen: "tracking" as Screen },
      { icon: <Users size={18} color="var(--green)" />, title: "Team Formed", sub: "5-member student team assigned.", time: "2d ago", read: true, screen: "tracking" as Screen },
    ],
    govt: [
      { icon: <Clock size={18} color="var(--warning)" />, title: "89 Challenges Pending Validation", sub: "23 are high priority. Please review.", time: "Now", read: false, screen: "govt-validation" as Screen },
      { icon: <AlertTriangle size={18} color="var(--error)" />, title: "Project at Risk", sub: "Smart Irrigation Monitoring — testing behind.", time: "3h ago", read: false, screen: "project-lifecycle" as Screen },
      { icon: <GraduationCap size={18} color="var(--navy)" />, title: "University Accepted Challenge", sub: "BIT Mesra accepted JH-WTR-1024.", time: "1d ago", read: true, screen: "smart-match" as Screen },
    ],
    university: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Challenge Assigned", sub: "Village Irrigation Canal Leakage — High Priority", time: "1h ago", read: false, screen: "uni-challenge-detail" as Screen },
      { icon: <Factory size={18} color="var(--green)" />, title: "Industry Partner Joined", sub: "AquaSense IoT joined your project.", time: "4h ago", read: false, screen: "project-lifecycle" as Screen },
      { icon: <AlertTriangle size={18} color="var(--warning)" />, title: "Testing Milestone Behind", sub: "4 days behind schedule.", time: "1d ago", read: false, screen: "project-health" as Screen },
    ],
    industry: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Project Match", sub: "Smart Irrigation — 89% industry match.", time: "2h ago", read: false, screen: "industry-project-detail" as Screen },
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Partnership Confirmed", sub: "BIT Mesra confirmed your partnership.", time: "1d ago", read: true, screen: "project-lifecycle" as Screen },
    ],
    panchayat: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Problem Submitted", sub: "Bakri Bazar citizen reported a water problem.", time: "1h ago", read: false, screen: "panchayat-dashboard" as Screen },
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Problem Verified", sub: "JH-WTR-1024 verified by government.", time: "2d ago", read: true, screen: "tracking" as Screen },
    ],
  };
  const notifs = allNotifs[role as keyof typeof allNotifs] || allNotifs.govt;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="notifications" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <Bell size={22} /> {t("notif.title")}
        </h1>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          {notifs.filter(n => !n.read).length} {t("notif.unread")}
        </p>
        <div className="space-y-3">
          {notifs.map((n, i) => (
            <Card key={i} className="p-4" onClick={() => onNav(n.screen)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: n.read ? "var(--bg)" : "var(--success-bg)" }}>
                  {n.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)", opacity: n.read ? 0.65 : 1 }}>
                    {n.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{n.sub}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--navy)" }} />}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEEDBACK ────────────────────────────────────────────────────────────────
function FeedbackScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
        style={{ background: "var(--success-bg)" }}>
        <ThumbsUp size={40} color="var(--success)" />
      </div>
      <h1 className="text-xl font-black mb-2" style={{ color: "var(--success)" }}>{t("feedback.thanks")}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Your feedback has been submitted.</p>
      <Btn onClick={() => onNav("tracking")} icon={<ArrowLeft size={16} />}>Back to Tracking</Btn>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--bg)" }}>
      <button onClick={() => onNav("tracking")} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={15} /> {t("btn.back")}
      </button>
      <h1 className="text-xl font-black mb-1 flex items-center gap-2" style={{ color: "var(--navy)" }}>
        <Star size={22} /> {t("feedback.title")}
      </h1>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 — Handpump kharab hai</p>
      <Card className="p-5 max-w-sm mx-auto">
        <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>
          How satisfied are you with the progress?
        </h3>
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="transition-all hover:scale-110 active:scale-95">
              <Star size={32} fill={s <= rating ? "var(--amber)" : "transparent"}
                color={s <= rating ? "var(--amber)" : "var(--border)"} />
            </button>
          ))}
        </div>
        <textarea rows={4} placeholder="अपनी राय यहाँ लिखें… / Write your feedback here…"
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none mb-4"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
        <Btn onClick={() => setSubmitted(true)} className="w-full" disabled={rating === 0}
          icon={<SendHorizontal size={16} />}>
          {t("feedback.submit")}
        </Btn>
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
