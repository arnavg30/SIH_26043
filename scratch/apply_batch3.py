import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

new_panch_org = '''function PanchayatDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const statuses = [
    { label: \"Total Problems\", val: \"34\", color: \"var(--navy)\", icon: <Layers size={18} /> },
    { label: \"Under Review\", val: \"8\", color: \"var(--warning)\", icon: <Clock size={18} /> },
    { label: \"In Progress\", val: \"12\", color: \"var(--green)\", icon: <Activity size={18} /> },
    { label: \"Resolved\", val: \"14\", color: \"var(--success)\", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className=\"min-h-screen pb-24\" style={{ background: \"var(--bg)\" }}>
      <NavBar role=\"panchayat\" screen=\"panchayat-dashboard\" onNav={onNav} />

      <div className=\"px-4 pt-5 pb-4\" style={{ background: \"var(--nav-bg)\" }}>
        <div className=\"flex items-center justify-between mb-4\">
          <div>
            <p className=\"text-xs\" style={{ color: \"rgba(255,255,255,0.55)\" }}>Mukhiya / Sarpanch</p>
            <h1 className=\"text-xl font-black text-white\">Piska Nagri Panchayat</h1>
            <p className=\"text-xs mt-0.5\" style={{ color: \"rgba(255,255,255,0.45)\" }}>
              Kanke Block, Ranchi
            </p>
          </div>
          <button onClick={() => onNav(\"notifications\")}
            className=\"relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95\"
            style={{ background: \"rgba(255,255,255,0.1)\" }}>
            <Bell size={18} color=\"white\" />
            <span className=\"absolute top-1 right-1 w-2 h-2 rounded-full\" style={{ background: \"var(--amber)\" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav(\"report-step1\")}
          className=\"w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md\"
          style={{ background: \"var(--amber)\", color: \"var(--navy)\" }}>
          <div>
            <div className=\"font-black text-lg leading-tight\">{t(\"panch.report\")}</div>
            <div className=\"font-medium text-sm opacity-75\">पंचायत की ओर से नई समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className=\"px-4 py-5 max-w-3xl mx-auto space-y-5\">
        {/* Simple Status Grid */}
        <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-3\">
          {statuses.map(s => (
            <Card key={s.label} className=\"p-3 flex items-center gap-3\">
              <div className=\"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0\"
                style={{ background: color-mix(in srgb,  12%, transparent), color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className=\"text-xl font-black leading-none\" style={{ color: s.color }}>{s.val}</div>
                <div className=\"text-xs mt-0.5\" style={{ color: \"var(--text-muted)\" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Primary Actions Grid - Matching Citizen Style */}
        <div>
          <h2 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Primary Actions</h2>
          <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">
            {[
              {
                icon: <UserCheck size={22} />,
                label: t(\"panch.behalf\"),
                sub: \"Submit on behalf of a citizen\",
                screen: \"report-for-someone\" as Screen,
                color: \"var(--green)\",
                bg: \"var(--success-bg)\",
                border: \"var(--green)\"
              },
              {
                icon: <FileText size={22} />,
                label: t(\"panch.my_problems\"),
                sub: \"Problems submitted by Panchayat\",
                screen: \"tracking\" as Screen,
                color: \"var(--navy)\",
                bg: \"#EFF6FF\"
              },
              {
                icon: <MapPin size={22} />,
                label: t(\"panch.track\"),
                sub: \"Track status of reported issues\",
                screen: \"tracking\" as Screen,
                color: \"var(--amber)\",
                bg: \"rgba(242,184,75,0.12)\"
              },
              {
                icon: <Layers size={22} />,
                label: t(\"panch.panchayat_problems\"),
                sub: \"View all village issues in Panchayat\",
                screen: \"problems-near-me\" as Screen,
                color: \"#7C3AED\",
                bg: \"#EDE9FE\"
              },
              {
                icon: <CheckCircle size={22} />,
                label: t(\"panch.verify\"),
                sub: \"Ground verification of problems\",
                screen: \"govt-validation\" as Screen,
                color: \"var(--success)\",
                bg: \"var(--success-bg)\"
              },
              {
                icon: <Bell size={22} />,
                label: t(\"notif.title\"),
                sub: \"Panchayat notices and alerts\",
                screen: \"notifications\" as Screen,
                color: \"#B45309\",
                bg: \"var(--warning-bg)\"
              },
            ].map(a => (
              <button key={a.label} onClick={() => onNav(a.screen)}
                className=\"p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all card-hover active:scale-95\"
                style={{ background: \"var(--card)\", borderColor: a.border || \"var(--border)\" }}>
                <div className=\"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0\"
                  style={{ background: a.bg, color: a.color }}>
                  {a.icon}
                </div>
                <div className=\"flex-1\">
                  <div className=\"font-semibold text-sm\" style={{ color: \"var(--text)\" }}>{a.label}</div>
                  <div className=\"text-xs\" style={{ color: \"var(--text-muted)\" }}>{a.sub}</div>
                </div>
                <ChevronRight size={16} color=\"var(--text-muted)\" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Problems in Panchayat */}
        <div>
          <h2 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Recent Problems in My Panchayat</h2>
          {[
            { title: \"Handpump kharab — Ward 3\", sub: \"Bakri Bazar\", status: \"under-review\", id: \"JH-WTR-1024\" },
            { title: \"Road damaged near school\", sub: \"Kanke Chowk\", status: \"in-progress\", id: \"JH-RD-982\" },
            { title: \"Street lights not working\", sub: \"Lalgutwa\", status: \"submitted\", id: \"JH-EL-456\" },
          ].map(p => (
            <Card key={p.id} className=\"p-4 mb-3 cursor-pointer card-hover\" onClick={() => onNav(\"tracking\")}>
              <div className=\"flex items-start justify-between\">
                <div>
                  <p className=\"font-semibold text-sm\" style={{ color: \"var(--text)\" }}>{p.title}</p>
                  <p className=\"text-xs flex items-center gap-1 mt-0.5\" style={{ color: \"var(--text-muted)\" }}>
                    <MapPin size={11} /> {p.sub}
                  </p>
                  <div className=\"flex items-center gap-2 mt-2\">
                    <StatusBadge status={p.status} />
                    <span className=\"text-xs font-mono\" style={{ color: \"var(--text-muted)\" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color=\"var(--text-muted)\" />
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
  const statuses = [
    { label: \"Total Reported\", val: \"12\", color: \"var(--navy)\", icon: <FileText size={18} /> },
    { label: \"Pending Review\", val: \"2\", color: \"var(--warning)\", icon: <Clock size={18} /> },
    { label: \"In Progress\", val: \"3\", color: \"var(--green)\", icon: <Activity size={18} /> },
    { label: \"Resolved\", val: \"7\", color: \"var(--success)\", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className=\"min-h-screen pb-24\" style={{ background: \"var(--bg)\" }}>
      <NavBar role=\"citizen\" screen=\"citizen-dashboard\" onNav={onNav} />

      <div className=\"px-4 pt-5 pb-4\" style={{ background: \"var(--nav-bg)\" }}>
        <div className=\"flex items-center justify-between mb-4\">
          <div>
            <p className=\"text-xs\" style={{ color: \"rgba(255,255,255,0.55)\" }}>Local Organisation (RWA)</p>
            <h1 className=\"text-xl font-black text-white\">Kanke Jan Sewa Samiti</h1>
            <p className=\"text-xs mt-0.5\" style={{ color: \"rgba(255,255,255,0.45)\" }}>
              Kanke Block, Ranchi
            </p>
          </div>
          <button onClick={() => onNav(\"notifications\")}
            className=\"relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95\"
            style={{ background: \"rgba(255,255,255,0.1)\" }}>
            <Bell size={18} color=\"white\" />
            <span className=\"absolute top-1 right-1 w-2 h-2 rounded-full\" style={{ background: \"var(--amber)\" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav(\"report-step1\")}
          className=\"w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md\"
          style={{ background: \"var(--amber)\", color: \"var(--navy)\" }}>
          <div>
            <div className=\"font-black text-lg leading-tight\">{t(\"localorg.submit\")}</div>
            <div className=\"font-medium text-sm opacity-75\">सामुदायिक समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className=\"px-4 py-5 max-w-3xl mx-auto space-y-5\">
        {/* Simple Status Grid */}
        <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-3\">
          {statuses.map(s => (
            <Card key={s.label} className=\"p-3 flex items-center gap-3\">
              <div className=\"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0\"
                style={{ background: color-mix(in srgb,  12%, transparent), color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className=\"text-xl font-black leading-none\" style={{ color: s.color }}>{s.val}</div>
                <div className=\"text-xs mt-0.5\" style={{ color: \"var(--text-muted)\" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Primary Actions Grid */}
        <div>
          <h2 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Primary Actions</h2>
          <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">
            {[
              {
                icon: <FileText size={22} />,
                label: t(\"localorg.my_problems\"),
                sub: \"View problems reported by organisation\",
                screen: \"tracking\" as Screen,
                color: \"var(--navy)\",
                bg: \"#EFF6FF\"
              },
              {
                icon: <MapPin size={22} />,
                label: t(\"localorg.track\"),
                sub: \"Real-time tracking of community issues\",
                screen: \"tracking\" as Screen,
                color: \"var(--green)\",
                bg: \"var(--success-bg)\"
              },
              {
                icon: <Map size={22} />,
                label: t(\"localorg.area_problems\"),
                sub: \"See problems reported in your locality\",
                screen: \"problems-near-me\" as Screen,
                color: \"#7C3AED\",
                bg: \"#EDE9FE\"
              },
              {
                icon: <Bell size={22} />,
                label: t(\"notif.title\"),
                sub: \"Community alerts & notifications\",
                screen: \"notifications\" as Screen,
                color: \"#B45309\",
                bg: \"var(--warning-bg)\"
              },
            ].map(a => (
              <button key={a.label} onClick={() => onNav(a.screen)}
                className=\"p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all card-hover active:scale-95\"
                style={{ background: \"var(--card)\", borderColor: \"var(--border)\" }}>
                <div className=\"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0\"
                  style={{ background: a.bg, color: a.color }}>
                  {a.icon}
                </div>
                <div className=\"flex-1\">
                  <div className=\"font-semibold text-sm\" style={{ color: \"var(--text)\" }}>{a.label}</div>
                  <div className=\"text-xs\" style={{ color: \"var(--text-muted)\" }}>{a.sub}</div>
                </div>
                <ChevronRight size={16} color=\"var(--text-muted)\" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Community Problems */}
        <div>
          <h2 className=\"font-bold text-sm mb-3\" style={{ color: \"var(--text)\" }}>Recent Community Problems</h2>
          {[
            { title: \"Garbage accumulation near community park\", sub: \"Kanke Ward 4\", status: \"in-progress\", id: \"JH-SAN-712\" },
            { title: \"Drainage overflow during monsoon\", sub: \"Kanke Main Rd\", status: \"under-review\", id: \"JH-DRN-389\" },
            { title: \"Street light pole damaged\", sub: \"Sector 2 Block B\", status: \"resolved\", id: \"JH-EL-204\" },
          ].map(p => (
            <Card key={p.id} className=\"p-4 mb-3 cursor-pointer card-hover\" onClick={() => onNav(\"tracking\")}>
              <div className=\"flex items-start justify-between\">
                <div>
                  <p className=\"font-semibold text-sm\" style={{ color: \"var(--text)\" }}>{p.title}</p>
                  <p className=\"text-xs flex items-center gap-1 mt-0.5\" style={{ color: \"var(--text-muted)\" }}>
                    <MapPin size={11} /> {p.sub}
                  </p>
                  <div className=\"flex items-center gap-2 mt-2\">
                    <StatusBadge status={p.status} />
                    <span className=\"text-xs font-mono\" style={{ color: \"var(--text-muted)\" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color=\"var(--text-muted)\" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

'''

pattern = r'function PanchayatDashboardScreen[\s\S]*?(?=function OrgSolverLoginScreen)'
assert re.search(pattern, code), "Pattern not found"
code = re.sub(pattern, new_panch_org, code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Batch 3 applied successfully.")
