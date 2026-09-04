import sys
sys.stdout.reconfigure(encoding='utf-8')

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update NavBar navItems to remove Repository and Impact from govt and university
old_nav_items = '''    ] : role === "govt" ? [
      { label: "Dashboard", screen: "govt-dashboard", icon: <BarChart3 size={15} /> },
      { label: "Validation", screen: "govt-validation", icon: <CheckCircle size={15} /> },
      { label: "Repository", screen: "solution-repo", icon: <BookOpen size={15} /> },
      { label: "Impact", screen: "impact-dashboard", icon: <TrendingUp size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },
    ] : role === "university" ? [
      { label: "Challenges", screen: "uni-dashboard", icon: <Layers size={15} /> },
      { label: "Projects", screen: "project-lifecycle", icon: <Activity size={15} /> },
      { label: "Repository", screen: "solution-repo", icon: <BookOpen size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },'''

new_nav_items = '''    ] : role === "govt" ? [
      { label: "Dashboard", screen: "govt-dashboard", icon: <BarChart3 size={15} /> },
      { label: "Validation", screen: "govt-validation", icon: <CheckCircle size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },
    ] : role === "university" ? [
      { label: "Challenges", screen: "uni-dashboard", icon: <Layers size={15} /> },
      { label: "Projects", screen: "project-lifecycle", icon: <Activity size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },'''

assert old_nav_items in code, "old_nav_items not found in App.tsx"
code = code.replace(old_nav_items, new_nav_items)

# 2. Remove public government login link from LandingScreen
old_govt_link = '''        {/* Government link */}
        <div className="text-center py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={() => onNav("govt-login")}
            className="text-xs font-medium flex items-center gap-1.5 mx-auto transition-all hover:opacity-70"
            style={{ color: "var(--text-muted)" }}>
            <Shield size={13} /> {t("landing.govt.link")}
          </button>
        </div>'''

assert old_govt_link in code, "old_govt_link not found in App.tsx"
code = code.replace(old_govt_link, '')

# 3. Update OTPLoginScreen university and industry profile setup to match Expertise Areas and no capability checkboxes
old_uni_otp_profile = '''    if (profileType === "university") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.uni_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Address of Institute <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Number <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          
          <h3 className="font-bold mt-4 mb-2 text-sm" style={{ color: "var(--text)" }}>Institutional Capabilities</h3>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Areas of Expertise</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Departments</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Research Centres & Labs / Facilities</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Previous Projects</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Student Skills</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }
    if (profileType === "industry") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.industry_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.category")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Address <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          
          <h3 className="font-bold mt-4 mb-2 text-sm" style={{ color: "var(--text)" }}>Capabilities (Optional)</h3>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Industry Expertise</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Technology Capability</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Mentorship Capability</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Funding / CSR Capability</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Field Testing Capability</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Co-development Capability</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }'''

new_uni_otp_profile = '''    if (profileType === "university") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>University Name <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="e.g. BIT Mesra" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="Single Point of Contact name" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>University Address <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="Full institutional address" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Expertise Areas <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="e.g. Civil Engineering, Water Management, IoT, Agriculture..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Number <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="+91 98765 43210" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }
    if (profileType === "industry") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Industry Name <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="e.g. TechGrow Solutions Pvt. Ltd." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="Single Point of Contact name" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Category <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="e.g. IoT, AgriTech, Construction..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Address <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="Company registered address" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Expertise Areas <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="e.g. IoT, AgriTech, Water Technology, Manufacturing..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Official Company Email <span style={{ color: "var(--error)" }}>*</span></label><input placeholder="contact@techgrow.com" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }'''

assert old_uni_otp_profile in code, "old_uni_otp_profile not found in App.tsx"
code = code.replace(old_uni_otp_profile, new_uni_otp_profile)

# 4. Update GovtDashboardScreen tabs to remove Impact
old_govt_tabs = 'const tabs = ["Overview", "Challenges", "Validation", "Universities", "Industry", "Impact", "Reports"];'
new_govt_tabs = 'const tabs = ["Overview", "Challenges", "Validation", "Universities", "Industry", "Reports"];'
assert old_govt_tabs in code, "old_govt_tabs not found in App.tsx"
code = code.replace(old_govt_tabs, new_govt_tabs)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Batch 1 applied successfully.")
