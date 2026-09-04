import sys
sys.stdout.reconfigure(encoding='utf-8')

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update OrgSolverDashboardScreen button to point to uni-dashboard instead of solution-repo
code = code.replace(
    '<button onClick={() => onNav(\"solution-repo\")} className=\"p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover\" style={{ background: \"var(--navy)\", color: \"white\" }}>',
    '<button onClick={() => onNav(\"uni-dashboard\")} className=\"p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover\" style={{ background: \"var(--navy)\", color: \"white\" }}>'
)

# 2. Replace UniLoginScreen
old_uni_screen = '''function UniLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [step, setStep] = useState<\"profile\" | \"capability\">(\"profile\");
  return (
    <div className=\"min-h-screen flex flex-col items-center justify-center px-4 py-8\" style={{ background: \"var(--bg)\" }}>
      <div className=\"w-full max-w-md\">
        <button onClick={() => onNav(\"solver-select\")} className=\"flex items-center gap-1.5 text-sm mb-6\"
          style={{ color: \"var(--text-muted)\" }}>
          <ArrowLeft size={15} /> {t(\"btn.back\")}
        </button>
        <div className=\"text-center mb-6\">
          <div className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3\"
            style={{ background: \"var(--navy)\" }}>
            <GraduationCap size={28} color=\"var(--amber)\" />
          </div>
          <h1 className=\"text-xl font-black\" style={{ color: \"var(--text)\" }}>Institute / University</h1>
          <p className=\"text-xs mt-1\" style={{ color: \"var(--text-muted)\" }}>
            Professional & Academic Registration
          </p>
        </div>
        <div className=\"flex gap-2 mb-5\">
          {[\"Institution Profile\", \"Capabilities\"].map((tab, i) => (
            <button key={tab} onClick={() => setStep(i === 0 ? \"profile\" : \"capability\")}
              className=\"flex-1 py-2 rounded-xl text-xs font-semibold transition-all\"
              style={{
                background: (i === 0 ? step === \"profile\" : step === \"capability\") ? \"var(--navy)\" : \"var(--border)\",
                color: (i === 0 ? step === \"profile\" : step === \"capability\") ? \"white\" : \"var(--text-muted)\"
              }}>{tab}</button>
          ))}
        </div>
        <div className=\"rounded-2xl border p-6\" style={{ background: \"var(--card)\", borderColor: \"var(--border)\" }}>
          {step === \"profile\" ? (
            <>
              {[
                { label: \"University Name\", ph: \"e.g. BIT Mesra\", req: true },
                { label: \"SPOC Name\", ph: \"Single Point of Contact name\", req: true },
                { label: \"University Address\", ph: \"Full institutional address\", req: true },
                { label: \"SPOC Number\", ph: \"+91 98765 43210\", req: true },
              ].map(f => (
                <div key={f.label} className=\"mb-4\">
                  <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                    {f.label} {f.req && <span style={{ color: \"var(--error)\" }}>*</span>}
                  </label>
                  <input placeholder={f.ph}
                    className=\"w-full px-3 py-2.5 rounded-xl border text-sm outline-none\"
                    style={{ background: \"var(--input-bg)\", borderColor: \"var(--border)\", color: \"var(--text)\" }} />
                </div>
              ))}
              <Btn onClick={() => setStep(\"capability\")} className=\"w-full\" icon={<ArrowRight size={16} />}>
                Next: Capabilities
              </Btn>
            </>
          ) : (
            <>
              {[
                { label: \"Expertise Areas\", ph: \"e.g. Civil Engineering, Water Management, IoT…\", rows: 2 },
                { label: \"Departments\", ph: \"List relevant departments\", rows: 2 },
                { label: \"Research Facilities / Labs\", ph: \"Available labs and facilities\", rows: 2 },
                { label: \"Previous Projects\", ph: \"Brief description of past relevant work\", rows: 2 },
              ].map(f => (
                <div key={f.label} className=\"mb-4\">
                  <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>{f.label}</label>
                  <textarea rows={f.rows} placeholder={f.ph}
                    className=\"w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none\"
                    style={{ background: \"var(--input-bg)\", borderColor: \"var(--border)\", color: \"var(--text)\" }} />
                </div>
              ))}
              <div className=\"flex gap-2\">
                <Btn variant=\"ghost\" onClick={() => setStep(\"profile\")} className=\"px-4\" icon={<ArrowLeft size={16} />}>Back</Btn>
                <Btn onClick={() => onNav(\"uni-dashboard\")} className=\"flex-1\" icon={<CheckCircle size={16} />}>
                  Register & Enter
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}'''

new_uni_screen = '''function UniLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className=\"min-h-screen flex flex-col items-center justify-center px-4 py-8\" style={{ background: \"var(--bg)\" }}>
      <div className=\"w-full max-w-md\">
        <button onClick={() => onNav(\"solver-select\")} className=\"flex items-center gap-1.5 text-sm mb-6 transition-all active:scale-95\"
          style={{ color: \"var(--text-muted)\" }}>
          <ArrowLeft size={15} /> {t(\"btn.back\")}
        </button>
        <div className=\"text-center mb-6\">
          <div className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm\"
            style={{ background: \"var(--navy)\" }}>
            <GraduationCap size={28} color=\"var(--amber)\" />
          </div>
          <h1 className=\"text-xl font-black\" style={{ color: \"var(--text)\" }}>Institute / University</h1>
          <p className=\"text-xs mt-1\" style={{ color: \"var(--text-muted)\" }}>
            Professional & Academic Registration
          </p>
        </div>
        <div className=\"rounded-2xl border p-6 shadow-sm\" style={{ background: \"var(--card)\", borderColor: \"var(--border)\" }}>
          <h2 className=\"font-bold mb-4 text-base flex items-center gap-2\" style={{ color: \"var(--text)\" }}>
            <GraduationCap size={18} style={{ color: \"var(--navy)\" }} /> Institution Profile
          </h2>
          {[
            { label: \"University Name\", ph: \"e.g. BIT Mesra\", req: true },
            { label: \"SPOC Name\", ph: \"Single Point of Contact name\", req: true },
            { label: \"University Address\", ph: \"Full institutional address\", req: true },
            { label: \"Expertise Areas\", ph: \"e.g. Civil Engineering, Water Management, IoT, Agriculture...\", req: true },
            { label: \"SPOC Number\", ph: \"+91 98765 43210\", req: true },
          ].map(f => (
            <div key={f.label} className=\"mb-3.5\">
              <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                {f.label} {f.req && <span style={{ color: \"var(--error)\" }}>*</span>}
              </label>
              <input placeholder={f.ph}
                className=\"w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all\"
                style={{ background: \"var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <Btn onClick={() => onNav("uni-dashboard")} className="w-full mt-3 py-3" icon={<CheckCircle size={16} />}>
            Register & Continue
          </Btn>
        </div>
      </div>
    </div>
  );
}'''

assert old_uni_screen in code, "old_uni_screen not found"
code = code.replace(old_uni_screen, new_uni_screen)

# 3. Replace IndustryLoginScreen with official email verification and no capabilities
old_ind_screen = '''function IndustryLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className=\"min-h-screen flex flex-col items-center justify-center px-4 py-8\" style={{ background: \"var(--bg)\" }}>
      <div className=\"w-full max-w-md\">
        <button onClick={() => onNav(\"solver-select\")} className=\"flex items-center gap-1.5 text-sm mb-6\"
          style={{ color: \"var(--text-muted)\" }}>
          <ArrowLeft size={15} /> {t(\"btn.back\")}
        </button>
        <div className=\"text-center mb-6\">
          <div className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3\"
            style={{ background: \"var(--navy)\" }}>
            <Factory size={28} color=\"var(--amber)\" />
          </div>
          <h1 className=\"text-xl font-black\" style={{ color: \"var(--text)\" }}>Industry</h1>
          <p className=\"text-xs mt-1\" style={{ color: \"var(--text-muted)\" }}>Industry Partner Registration</p>
        </div>
        <div className=\"rounded-2xl border p-6\" style={{ background: \"var(--card)\", borderColor: \"var(--border)\" }}>
          {[
            { label: \"Industry Name\", ph: \"e.g. TechGrow Solutions Pvt. Ltd.\", req: true },
            { label: \"SPOC Name\", ph: \"Single Point of Contact name\", req: true },
            { label: \"Category\", ph: \"e.g. IoT, AgriTech, Construction…\", req: true },
            { label: \"Address\", ph: \"Company registered address\", req: true },
          ].map(f => (
            <div key={f.label} className=\"mb-4\">
              <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                {f.label} {f.req && <span style={{ color: \"var(--error)\" }}>*</span>}
              </label>
              <input placeholder={f.ph}
                className=\"w-full px-3 py-2.5 rounded-xl border text-sm outline-none\"
                style={{ background: \"var(--input-bg)\", borderColor: \"var(--border)\", color: \"var(--text)\" }} />
            </div>
          ))}
          <div className=\"mb-4\">
            <p className=\"text-xs font-semibold mb-2\" style={{ color: \"var(--text)\" }}>
              Capability Offering (optional)
            </p>
            <div className=\"flex flex-wrap gap-2\">
              {[\"Industry Expertise\", \"Technology Capability\", \"Mentorship\", \"Funding / CSR\", \"Co-development\"].map(cap => (
                <label key={cap} className=\"flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer\"
                  style={{ borderColor: \"var(--border)\", color: \"var(--text)\" }}>
                  <input type=\"checkbox\" className=\"accent-navy\" /> {cap}
                </label>
              ))}
            </div>
          </div>
          <Btn onClick={() => onNav(\"industry-dashboard\")} className=\"w-full\" icon={<CheckCircle size={16} />}>
            Register & Enter
          </Btn>
        </div>
      </div>
    </div>
  );
}'''

new_ind_screen = '''function IndustryLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [step, setStep] = useState<\"email\" | \"code\" | \"profile\">(\"email\");
  const [email, setEmail] = useState(\"\");
  const [code, setCode] = useState(\"\");
  const [resendNotice, setResendNotice] = useState(false);

  return (
    <div className=\"min-h-screen flex flex-col items-center justify-center px-4 py-8\" style={{ background: \"var(--bg)\" }}>
      <div className=\"w-full max-w-md\">
        <button onClick={() => {
          if (step === \"code\") setStep(\"email\");
          else if (step === \"profile\") setStep(\"code\");
          else onNav(\"solver-select\");
        }} className=\"flex items-center gap-1.5 text-sm mb-6 transition-all active:scale-95\"
          style={{ color: \"var(--text-muted)\" }}>
          <ArrowLeft size={15} /> {t(\"btn.back\")}
        </button>

        <div className=\"text-center mb-6\">
          <div className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm\"
            style={{ background: \"var(--navy)\" }}>
            <Factory size={28} color=\"var(--amber)\" />
          </div>
          <h1 className=\"text-xl font-black\" style={{ color: \"var(--text)\" }}>
            {step === \"email\" ? t(\"ind.verify_email_title\") :
             step === \"code\" ? t(\"ind.enter_code_title\") :
             t(\"ind.profile_setup\")}
          </h1>
          <p className=\"text-xs mt-1\" style={{ color: \"var(--text-muted)\" }}>
            {step === \"email\" ? t(\"ind.verify_email_sub\") :
             step === \"code\" ? t(\"ind.enter_code_sub\") :
             \"Professional Industry Partner Onboarding\"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className=\"flex gap-2 mb-5\">
          <div className=\"flex-1 h-1.5 rounded-full\" style={{ background: \"var(--navy)\" }} />
          <div className=\"flex-1 h-1.5 rounded-full\" style={{ background: step !== \"email\" ? \"var(--navy)\" : \"var(--border)\" }} />
          <div className=\"flex-1 h-1.5 rounded-full\" style={{ background: step === \"profile\" ? \"var(--navy)\" : \"var(--border)\" }} />
        </div>

        <div className=\"rounded-2xl border p-6 shadow-sm\" style={{ background: \"var(--card)\", borderColor: \"var(--border)\" }}>
          {step === \"email\" && (
            <div className=\"space-y-4\">
              <div>
                <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                  {t(\"ind.official_email\")} <span style={{ color: \"var(--error)\" }}>*</span>
                </label>
                <input
                  type=\"email\"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder=\"e.g. contact@techgrow.com\"
                  className=\"w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all\"
                  style={{ background: \"var(--input-bg)\", borderColor: \"var(--border)\", color: \"var(--text)\" }}
                />
                <p className=\"text-[11px] mt-1\" style={{ color: \"var(--text-muted)\" }}>
                  Please enter your official corporate/organization email.
                </p>
              </div>
              <Btn onClick={() => setStep(\"code\")} className=\"w-full py-3\" icon={<ArrowRight size={16} />}>
                {t(\"ind.send_code\")}
              </Btn>
            </div>
          )}

          {step === \"code\" && (
            <div className=\"space-y-4\">
              <div className=\"p-3 rounded-xl flex items-center justify-between\" style={{ background: \"#EFF6FF\" }}>
                <span className=\"text-xs font-semibold\" style={{ color: \"var(--navy)\" }}>{email || \"contact@techgrow.com\"}</span>
                <button onClick={() => setStep(\"email\")} className=\"text-xs underline font-medium\" style={{ color: \"var(--navy)\" }}>Change</button>
              </div>

              <div>
                <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                  {t(\"ind.enter_code_title\")} <span style={{ color: \"var(--error)\" }}>*</span>
                </label>
                <input
                  type=\"text\"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder=\"e.g. 582914\"
                  className=\"w-full px-3 py-2.5 rounded-xl border text-base tracking-widest text-center font-mono font-bold outline-none transition-all\"
                  style={{ background: \"var(--input-bg)\", borderColor: \"var(--border)\", color: \"var(--text)\" }}
                />
              </div>

              {resendNotice && (
                <p className=\"text-xs text-center font-medium\" style={{ color: \"var(--success)\" }}>
                  Verification code resent to your official company email!
                </p>
              )}

              <div className=\"flex gap-2\">
                <Btn variant=\"secondary\" onClick={() => setResendNotice(true)} className=\"px-4 text-xs\">
                  {t(\"ind.resend_btn\")}
                </Btn>
                <Btn onClick={() => setStep(\"profile\")} className=\"flex-1 py-3\" icon={<CheckCircle size={16} />}>
                  {t(\"ind.verify_btn\")}
                </Btn>
              </div>
            </div>
          )}

          {step === \"profile\" && (
            <div className=\"space-y-3.5\">
              <div className=\"p-2.5 rounded-xl flex items-center gap-2\" style={{ background: \"var(--success-bg)\" }}>
                <CheckCircle size={16} color=\"var(--success)\" />
                <span className=\"text-xs font-semibold\" style={{ color: \"var(--success)\" }}>
                  Verified: {email || \"contact@techgrow.com\"}
                </span>
              </div>

              {[
                { label: \"Industry Name\", ph: \"e.g. TechGrow Solutions Pvt. Ltd.\", req: true },
                { label: \"SPOC Name\", ph: \"Single Point of Contact name\", req: true },
                { label: \"Category\", ph: \"e.g. IoT, AgriTech, Water Technology, Manufacturing...\", req: true },
                { label: \"Address\", ph: \"Company registered address\", req: true },
                { label: \"Expertise Areas\", ph: \"e.g. IoT, AgriTech, Water Technology, Manufacturing...\", req: true },
                { label: \"Official Company Email\", ph: email || \"contact@techgrow.com\", val: email || \"contact@techgrow.com\", req: true, readOnly: true },
              ].map(f => (
                <div key={f.label}>
                  <label className=\"block text-xs font-semibold mb-1\" style={{ color: \"var(--text)\" }}>
                    {f.label} {f.req && <span style={{ color: \"var(--error)\" }}>*</span>}
                  </label>
                  <input
                    defaultValue={f.val}
                    placeholder={f.ph}
                    readOnly={f.readOnly}
                    className=\"w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all\"
                    style={{
                      background: f.readOnly ? \"var(--bg)\" : \"var(--input-bg)\",
                      borderColor: \"var(--border)\",
                      color: \"var(--text)\"
                    }}
                  />
                </div>
              ))}

              <Btn onClick={() => onNav(\"industry-dashboard\")} className=\"w-full mt-2 py-3\" icon={<CheckCircle size={16} />}>
                Register & Enter
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}'''

assert old_ind_screen in code, "old_ind_screen not found"
code = code.replace(old_ind_screen, new_ind_screen)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Batch 2 applied successfully.")
