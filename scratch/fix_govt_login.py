import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# I will replace the login block in GovtLoginScreen
old_login = '''              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
                  Official Email / Employee ID
                </label>
                <input defaultValue="collector@jharkhand.gov.in"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Password</label>
                <input type="password" defaultValue="        "
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <Btn onClick={() => setStep("2fa")} className="w-full">Sign In</Btn>'''

new_login = '''              <div className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
                  Official Email / Employee ID
                </label>
                <input placeholder="e.g. collector@jharkhand.gov.in"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Password</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              
              {/* Support & Recovery Links */}
              <div className="flex items-center justify-between mb-5 mt-3">
                <button className="text-[11px] font-semibold hover:underline opacity-80" style={{ color: "var(--navy)" }}>
                  Forgot Password?
                </button>
                <button className="text-[11px] font-semibold hover:underline opacity-80 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <HelpCircle size={10} /> Contact IT Support
                </button>
              </div>

              <Btn onClick={() => setStep("2fa")} className="w-full transition-all active:scale-95">Sign In</Btn>'''

app_code = app_code.replace(old_login, new_login)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)

# Add global button active scale for smoothness
css_path = 'src/index.css'
with open(css_path, 'a', encoding='utf-8') as f:
    f.write('''\n\n/* Global smooth click interactions */\nbutton, a, .card-hover {\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n}\nbutton:active, a:active {\n  transform: scale(0.97);\n}\n''')
