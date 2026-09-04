import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Define the new OrgSolverDashboardScreen
new_org_dashboard = '''function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <h1 className="text-xl font-black text-white">{t("org.dashboard")}</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Ranchi Development Trust - {t("org.subtitle")}</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Layers size={18} />, label: t("org.recommended"), value: "6", color: "var(--amber)", screen: "uni-dashboard" as Screen },
            { icon: <Briefcase size={18} />, label: t("org.collabs"), value: "3", color: "var(--green)", screen: "project-lifecycle" as Screen },
            { icon: <CheckCircle size={18} />, label: t("org.completed"), value: "8", color: "var(--success)", screen: "" as Screen },
            { icon: <Users size={18} />, label: t("org.reach"), value: "12K", color: "var(--navy)", screen: "" as Screen },
          ].map(k => (
            <div key={k.label} onClick={() => k.screen ? onNav(k.screen) : null} className={k.screen ? "cursor-pointer active:scale-95 transition-all" : ""}>
              <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
            </div>
          ))}
        </div>
        
        {/* Core Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNav("solution-repo")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--navy)", color: "white" }}>
            <Search size={16} /> {t("org.find_problems")}
          </button>
          <button onClick={() => onNav("partnership-form")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--green)", color: "white" }}>
            <SendHorizontal size={16} /> {t("org.support")}
          </button>
        </div>

        {/* Top Recommended Challenges */}
        <h3 className="font-bold text-sm mt-6 mb-2" style={{ color: "var(--text)" }}>{t("org.recommended")}</h3>
        <div className="space-y-3">
          <Card className="p-4 cursor-pointer card-hover" onClick={() => onNav("uni-challenge-detail")}>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>Handpump Broken — Ward 3</h4>
                 <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> Kanke, Ranchi</p>
               </div>
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Under Review</span>
             </div>
             <p className="text-xs font-semibold" style={{ color: "var(--navy)" }}>Match Score: 92%</p>
          </Card>
          <Card className="p-4 cursor-pointer card-hover" onClick={() => onNav("uni-challenge-detail")}>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>Village Water Quality Issue</h4>
                 <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> Gumla</p>
               </div>
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--error-bg)", color: "var(--error)" }}>High Priority</span>
             </div>
             <p className="text-xs font-semibold" style={{ color: "var(--navy)" }}>Match Score: 88%</p>
          </Card>
        </div>

        {/* Profile */}
        <Card className="p-4 mt-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{t("org.expertise")}</h3>
          </div>
          
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>DOMAIN / SECTOR:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Education", "Healthcare", "Rural Development"].map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}>{t}</span>
            ))}
          </div>

          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>EXPERTISE:</p>
          <div className="flex flex-wrap gap-2">
            {["Community Mobilisation", "Water Management", "Sanitation", "NGO Network", "Field Implementation"].map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ background: "#EFF6FF", color: "var(--navy)" }}>{t}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}'''

# Replace the old component
pattern = r'function OrgSolverDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{[\s\S]*?\n\}'
app_code = re.sub(pattern, new_org_dashboard, app_code, count=1)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
