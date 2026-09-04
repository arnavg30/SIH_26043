import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Replace OrgSolverLoginScreen
old_login = '''function OrgSolverLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <OTPLoginScreen
      title="Organisation Login"
      icon={<Briefcase size={28} color="var(--amber)" />}
      onSuccess={() => onNav("org-solver-dashboard")}
      onBack={() => onNav("solver-select")}
    />
  );
}'''

new_login = '''function OrgSolverLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [step, setStep] = useState<"profile" | "capability">("profile");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <button onClick={() => onNav("solver-select")} className="flex items-center gap-1.5 text-sm mb-6"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={15} /> {t("btn.back")}
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--navy)" }}>
            <Briefcase size={28} color="var(--amber)" />
          </div>
          <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>Organisation Registration</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Professional Entity Onboarding
          </p>
        </div>
        <div className="flex gap-2 mb-5">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--amber)" }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background: step === "capability" ? "var(--amber)" : "rgba(255,255,255,0.1)" }} />
        </div>
        <Card className="p-6">
          {step === "profile" ? (
            <>
              <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
                <Building2 size={16} className="inline mr-1" /> Organisation Profile
              </h2>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Organisation Name <span style={{ color: "var(--error)" }}>*</span></label>
                <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registration Number (e.g., Darpan ID)</label>
                <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label>
                <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Contact Number <span style={{ color: "var(--error)" }}>*</span></label>
                <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registered Office Address <span style={{ color: "var(--error)" }}>*</span></label>
                <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <Btn onClick={() => setStep("capability")} className="w-full">Continue <ArrowRight size={16} /></Btn>
            </>
          ) : (
            <>
              <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
                <Layers size={16} className="inline mr-1" /> Sector & Capabilities
              </h2>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--text)" }}>Domain / Sector of Work <span style={{ color: "var(--error)" }}>*</span></label>
                <div className="space-y-2">
                  {["Education", "Healthcare", "Women Empowerment", "Water Management", "Rural Development"].map(c => (
                    <label key={c} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                      <input type="checkbox" className="rounded" style={{ accentColor: "var(--navy)" }} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--text)" }}>Capabilities <span style={{ color: "var(--error)" }}>*</span></label>
                <div className="space-y-2">
                  {["Community Mobilisation", "Field Implementation", "Volunteer Network", "Training & Capacity Building", "Survey & Data Collection"].map(c => (
                    <label key={c} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                      <input type="checkbox" className="rounded" style={{ accentColor: "var(--navy)" }} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep("profile")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text)" }}>Back</button>
                <Btn onClick={() => onNav("org-solver-dashboard")} className="flex-1">Complete Registration <CheckCircle size={16} /></Btn>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}'''

app_code = app_code.replace(old_login, new_login)

# Add Edit button in OrgSolverDashboardScreen
old_header = '''          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{t("org.expertise")}</h3>
          </div>'''

new_header = '''          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{t("org.expertise")}</h3>
            <button className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "var(--amber)" }}>
              <Edit2 size={12} /> Update Profile
            </button>
          </div>'''

app_code = app_code.replace(old_header, new_header)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
