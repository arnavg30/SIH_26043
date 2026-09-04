import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Modify OTPLoginScreen signature to accept profileType
app_code = app_code.replace(
    'function OTPLoginScreen({ title, icon, onSuccess, onBack }: {',
    'function OTPLoginScreen({ title, icon, onSuccess, onBack, profileType = "citizen" }: {'
)
app_code = app_code.replace(
    '  title: string; icon: React.ReactNode;\n  onSuccess: () => void; onBack: () => void;\n}) {',
    '  title: string; icon: React.ReactNode;\n  onSuccess: () => void; onBack: () => void;\n  profileType?: string;\n}) {'
)

# Now, we need to replace the const ProfileForm = () => ( ... ) with a dynamic one.
# It is a large block. Let's find it.
profile_form_start = app_code.find('  const ProfileForm = () => (')
profile_form_end = app_code.find('  return (', profile_form_start)

# We will replace that whole block with a new dynamic ProfileForm
new_profile_form = '''  const ProfileForm = () => {
    if (profileType === "panchayat") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.panchayat_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.mukhiya_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.office_address")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.official_phone")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Village(s)</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }
    if (profileType === "localorg") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.org_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.spoc_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.spoc_designation")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.office_address")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Phone Number <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Panchayat / Area</label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
        </>
      );
    }
    if (profileType === "university") {
      return (
        <>
          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}><UserCheck size={16} className="inline mr-1" /> Profile Setup</h2>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.uni_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.spoc_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
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
          <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("profile.spoc_name")} <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
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
    }
    
    // Default (Citizen & Org)
    return (
      <>
        <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
          <UserCheck size={16} className="inline mr-1" /> Profile Setup
        </h2>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            {t("profile.name")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            {t("profile.gender")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
            <option value="">Select.</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            {t("profile.dob")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <input type="date" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
        </div>
        <div className="mb-3">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--text)" }}>
            <MapPin size={12} /> {t("profile.address")} <span style={{ color: "var(--error)" }}>*</span>
          </p>
          <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--border)" }}>
            <div className="relative">
                <input placeholder={t("profile.housenumber")} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div className="relative">
                <input placeholder={t("profile.city")} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div className="relative">
                <input placeholder={t("profile.pincode")} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div className="relative">
                <input placeholder={t("profile.landmark")} className="w-full px-3 py-2 rounded-lg border text-xs outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
        </div>
        <Btn onClick={onSuccess} className="w-full">{t("profile.getstarted")} <ChevronRight size={16} /></Btn>
      </>
    );
  };
'''

app_code = app_code[:profile_form_start] + new_profile_form + app_code[profile_form_end:]

# Now, we need to pass profileType in the caller components
app_code = app_code.replace(
    'function PanchayatLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen',
    'function PanchayatLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen profileType="panchayat"'
)
app_code = app_code.replace(
    'function OrgVictimLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen',
    'function OrgVictimLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen profileType="localorg"'
)
app_code = app_code.replace(
    'function UniLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen',
    'function UniLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen profileType="university"'
)
app_code = app_code.replace(
    'function IndustryLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen',
    'function IndustryLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <OTPLoginScreen profileType="industry"'
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
