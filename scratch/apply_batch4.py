import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace TeamFormationScreen
new_team_screen = '''function TeamFormationScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const team = [
    { role: \"Faculty Mentor\", name: \"Dr. Priya Rajan\", dept: \"Civil Eng.\", icon: <User size={18} color=\"white\" /> },
    { role: \"Student — Civil\", name: \"Arjun Mahato\", dept: \"B.Tech Civil, Yr 4\", icon: <User size={18} color=\"white\" /> },
    { role: \"Student — Environmental\", name: \"Sunita Oraon\", dept: \"M.Sc. Env Sci\", icon: <User size={18} color=\"white\" /> },
    { role: \"Student — IoT\", name: \"Rajan Kumar\", dept: \"B.Tech ECE, Yr 3\", icon: <User size={18} color=\"white\" /> },
    { role: \"Student — Data\", name: \"Priti Soren\", dept: \"M.Tech CS, Yr 1\", icon: <User size={18} color=\"white\" /> },
  ];
  return (
    <div className=\"min-h-screen pb-10\" style={{ background: \"var(--bg)\" }}>
      <NavBar role=\"university\" screen=\"uni-dashboard\" onNav={onNav} />
      <div className=\"max-w-4xl mx-auto px-4 sm:px-6 py-6\">
        <button onClick={() => onNav(\"uni-challenge-detail\")} className=\"text-xs flex items-center gap-1 mb-4 transition-all\"
          style={{ color: \"var(--text-muted)\" }}><ArrowLeft size={13} /> Back</button>
        <h1 className=\"text-xl font-black flex items-center gap-2 mb-1\" style={{ color: \"var(--navy)\" }}>
          <Users size={22} /> Team Formation
        </h1>
        <p className=\"text-xs mb-6\" style={{ color: \"var(--text-muted)\" }}>Multidisciplinary project team for JH-WTR-1024</p>

        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
          <div className=\"space-y-4\">
            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Required Skills</h3>
              <div className=\"flex flex-wrap gap-2\">
                {[\"Civil Engineering\", \"Environmental Science\", \"IoT / Sensors\", \"Data Analytics\"].map(s => (
                  <span key={s} className=\"px-3 py-1.5 rounded-lg text-xs font-semibold\"
                    style={{ background: \"#EFF6FF\", color: \"var(--navy)\", border: \"1px solid #BFDBFE\" }}>{s}</span>
                ))}
              </div>
            </Card>

            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Project Team Members</h3>
              <div className=\"space-y-2.5\">
                {team.map(m => (
                  <div key={m.name} className=\"flex items-center gap-3 p-2.5 rounded-xl border\"
                    style={{ borderColor: \"var(--border)\", background: \"var(--card)\" }}>
                    <div className=\"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0\"
                      style={{ background: m.role.includes(\"Mentor\") ? \"var(--navy)\" : \"var(--green)\" }}>
                      {m.icon}
                    </div>
                    <div className=\"flex-1\">
                      <p className=\"text-sm font-bold leading-tight\" style={{ color: \"var(--text)\" }}>{m.name}</p>
                      <p className=\"text-xs\" style={{ color: \"var(--text-muted)\" }}>{m.role} • {m.dept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className=\"space-y-4\">
            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Industry Partner</h3>
              <div className=\"p-3.5 rounded-xl\" style={{ background: \"var(--success-bg)\", border: \"1px solid var(--green)\" }}>
                <p className=\"text-xs font-bold mb-1 flex items-center gap-1\" style={{ color: \"var(--green)\ theming\" || \"var(--green)\" }}>
                  <Factory size={13} /> AquaSense IoT Solutions
                </p>
                <p className=\"text-xs mb-3\" style={{ color: \"var(--text)\" }}>IoT hardware + field testing support</p>
                <Btn variant=\"secondary\" className=\"text-xs w-full\">Invite Partner</Btn>
              </div>
            </Card>
            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Team Summary</h3>
              {[[\"Faculty Mentors\", \"1\"], [\"Students\", \"4\"], [\"Industry Partner\", \"1 (pending)\"], [\"Skills Covered\", \"4/4\"]].map(([k, v]) => (
                <div key={k} className=\"flex justify-between text-sm py-1.5 border-b last:border-0\"
                  style={{ borderColor: \"var(--border)\" }}>
                  <span style={{ color: \"var(--text-muted)\" }}>{k}</span>
                  <span className=\"font-bold\" style={{ color: k === \"Skills Covered\" ? \"var(--success)\" : \"var(--text)\" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={() => onNav(\"proposal\")} className=\"w-full py-4 text-base\" icon={<ArrowRight size={18} />}>
              Create Team & Write Proposal
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}'''

pattern_team = r'function TeamFormationScreen[\s\S]*?(?=function ProposalScreen)'
assert re.search(pattern_team, code), "pattern_team not found"
code = re.sub(pattern_team, new_team_screen + '\n\n', code)

# 2. Replace ProjectLifecycleScreen and ProjectHealthScreen
new_project_screens = '''function ProjectLifecycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const milestones = [
    { label: \"Research & Survey\", date: \"Sep 1–7\", done: true },
    { label: \"Prototype Design\", date: \"Sep 8–15\", done: true },
    { label: \"Testing & Validation\", date: \"Sep 16–30\", active: true, behind: true },
    { label: \"Pilot Implementation\", date: \"Oct 1–20\", pending: true },
    { label: \"Full Deployment\", date: \"Nov 1–15\", pending: true },
  ];
  return (
    <div className=\"min-h-screen pb-10\" style={{ background: \"var(--bg)\" }}>
      <NavBar role=\"university\" screen=\"project-lifecycle\" onNav={onNav} />
      <div className=\"max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6\">
        <Card className=\"p-5\">
          <div className=\"flex items-start justify-between\">
            <div className=\"flex-1\">
              <h1 className=\"text-lg font-black\" style={{ color: \"var(--navy)\" }}>Smart Irrigation Monitoring System</h1>
              <p className=\"text-xs mt-0.5\" style={{ color: \"var(--text-muted)\" }}>
                JH-WTR-1024 • BIT Mesra × AquaSense IoT • Kanke, Ranchi
              </p>
            </div>
            <div className=\"text-right\">
              <StatusBadge status=\"on-track\" />
              <button onClick={() => onNav(\"project-health\")}
                className=\"text-xs font-semibold mt-2 block hover:underline transition-all\"
                style={{ color: \"var(--navy)\" }}>
                {t(\"proj.view_progress\")} →
              </button>
            </div>
          </div>
          <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4\">
            {[[\"Progress\", \"68%\"], [\"Health Score\", \"82%\"], [\"Days Remaining\", \"47\"], [\"Team\", \"5\"]].map(([l, v]) => (
              <div key={l} className=\"p-3 rounded-xl text-center\" style={{ background: \"var(--bg)\" }}>
                <div className=\"text-xl font-black\" style={{ color: \"var(--navy)\" }}>{v}</div>
                <div className=\"text-xs mt-0.5\" style={{ color: \"var(--text-muted)\" }}>{l}</div>
              </div>
            ))}
          </div>
          <div className=\"mt-4\">
            <div className=\"flex justify-between text-xs mb-1\">
              <span style={{ color: \"var(--text-muted)\" }}>{t(\"proj.progress\")}</span>
              <span className=\"font-bold\" style={{ color: \"var(--green)\" }}>68%</span>
            </div>
            <div className=\"h-3 rounded-full\" style={{ background: \"var(--border)\" }}>
              <div className=\"h-3 rounded-full\" style={{ width: \"68%\", background: \"var(--green)\" }} />
            </div>
          </div>
        </Card>

        {/* Milestone status note without extension button */}
        <div className=\"p-4 rounded-xl border flex items-start gap-3\"
          style={{ background: \"var(--warning-bg)\", borderColor: \"var(--warning)\" }}>
          <AlertTriangle size={20} color=\"var(--warning)\" className=\"flex-shrink-0 mt-0.5\" />
          <div>
            <p className=\"text-sm font-bold\" style={{ color: \"var(--warning)\" }}>Testing milestone is behind schedule.</p>
            <p className=\"text-xs mt-0.5\" style={{ color: \"var(--text)\" }}>
              Testing phase is 4 days behind. May affect Pilot Implementation deadline.
            </p>
          </div>
        </div>

        <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
          <Card className=\"p-5 lg:col-span-2\">
            <h3 className=\"font-bold text-sm mb-4\" style={{ color: \"var(--text)\" }}>Milestones</h3>
            <div className=\"space-y-3\">
              {milestones.map((m, i) => (
                <div key={i} className=\"flex items-center gap-3\">
                  <div className=\"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0\"
                    style={{
                      background: m.done ? \"var(--success)\" : m.active ? (m.behind ? \"var(--warning-bg)\" : \"var(--amber)\") : \"var(--border)\",
                      color: m.done ? \"white\" : m.active ? (m.behind ? \"var(--warning)\" : \"var(--navy)\") : \"var(--text-muted)\"
                    }}>
                    {m.done ? <CheckCircle size={16} /> : m.active ? <Activity size={14} /> : <Clock size={14} />}
                  </div>
                  <div className=\"flex-1\">
                    <p className=\"text-sm font-semibold\"
                      style={{ color: m.done ? \"var(--text)\" : m.active ? (m.behind ? \"var(--warning)\" : \"var(--navy)\") : \"var(--text-muted)\" }}>
                      {m.label}
                      {m.behind && <span className=\"ml-2 text-xs\" style={{ color: \"var(--warning)\" }}>Behind schedule</span>}
                    </p>
                    <p className=\"text-xs\" style={{ color: \"var(--text-muted)\" }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className=\"space-y-4\">
            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Project Actions</h3>
              <div className=\"space-y-3\">
                <Btn className=\"w-full\" icon={<Activity size={16} />}>{t(\"proj.update\")}</Btn>
                <Btn variant=\"secondary\" className=\"w-full\" onClick={() => onNav(\"project-health\")} icon={<TrendingUp size={16} />}>
                  {t(\"proj.view_progress\")}
                </Btn>
              </div>
            </Card>
            <Card className=\"p-5\">
              <h3 className=\"font-bold text-sm mb-2\" style={{ color: \"var(--text)\" }}>Implementation Roadmap</h3>
              <p className=\"text-xs\" style={{ color: \"var(--text-muted)\" }}>
                3 of 5 phases active. Expected completion: Nov 15, 2026.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT HEALTH / PROGRESS ────────────────────────────────────────────────
function ProjectHealthScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const factors = [
    { label: \"Milestone Progress\", score: 75, icon: <Clock size={16} /> },
    { label: \"Deliverables / Completion Status\", score: 90, icon: <FileText size={16} /> },
    { label: \"Mentor Engagement\", score: 88, icon: <User size={16} /> },
    { label: \"Testing Progress\", score: 55, icon: <Activity size={16} /> },
    { label: \"Timeline / Schedule Progress\", score: 70, icon: <TrendingUp size={16} /> },
    { label: \"Quality & Standards Compliance\", score: 80, icon: <CheckCircle size={16} /> },
  ];
  return (
    <div className=\"min-h-screen pb-10\" style={{ background: \"var(--bg)\" }}>
      <NavBar role=\"university\" screen=\"project-lifecycle\" onNav={onNav} />
      <div className=\"max-w-3xl mx-auto px-4 sm:px-6 py-6\">
        <button onClick={() => onNav(\"project-lifecycle\")} className=\"text-xs flex items-center gap-1 mb-4 transition-all\"
          style={{ color: \"var(--text-muted)\" }}><ArrowLeft size={13} /> Back</button>
        <h1 className=\"text-xl font-black flex items-center gap-2 mb-6\" style={{ color: \"var(--navy)\" }}>
          <TrendingUp size={22} /> {t(\"proj.progress_analysis\")}
        </h1>
        <Card className=\"p-6 mb-5 text-center\">
          <ProgressRing value={82} size={120} stroke={10} />
          <h2 className=\"text-2xl font-black mt-4\" style={{ color: \"var(--success)\" }}>82% ON TRACK</h2>
          <StatusBadge status=\"on-track\" />
          <p className=\"text-sm mt-3 max-w-md mx-auto\" style={{ color: \"var(--text-muted)\" }}>
            Project milestones and technical deliverables are progressing according to the active implementation roadmap.
          </p>
        </Card>
        <Card className=\"p-5 mb-5\">
          <h3 className=\"font-bold text-sm mb-4\" style={{ color: \"var(--text)\" }}>Progress Factors Breakdown</h3>
          <div className=\"space-y-3\">
            {factors.map(f => (
              <div key={f.label} className=\"flex items-center gap-3\">
                <span style={{ color: \"var(--text-muted)\", width: 18 }}>{f.icon}</span>
                <div className=\"flex-1\">
                  <div className=\"flex justify-between text-xs mb-1\">
                    <span className=\"font-medium\" style={{ color: \"var(--text)\" }}>{f.label}</span>
                    <span className=\"font-bold\" style={{
                      color: f.score >= 80 ? \"var(--success)\" : f.score >= 60 ? \"var(--warning)\" : \"var(--error)\"
                    }}>{f.score}%</span>
                  </div>
                  <div className=\"h-2 rounded-full\" style={{ background: \"var(--border)\" }}>
                    <div className=\"h-2 rounded-full\" style={{
                      width: ${f.score}%,
                      background: f.score >= 80 ? \"var(--success)\" : f.score >= 60 ? \"var(--warning)\" : \"var(--error)\"
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}'''

pattern_proj = r'function ProjectLifecycleScreen[\s\S]*?(?=function IndustryDashboardScreen)'
assert re.search(pattern_proj, code), "pattern_proj not found"
code = re.sub(pattern_proj, new_project_screens + '\n\n', code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Batch 4 applied successfully.")
