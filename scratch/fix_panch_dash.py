import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Highlight Report on Behalf of Citizen
app_code = app_code.replace(
    '{ icon: <UserCheck size={20} />, label: t("panch.behalf"), sub: "Submit on behalf of a citizen", screen: "report-for-someone" as Screen, color: "var(--green)", bg: "var(--success-bg)" }',
    '{ icon: <UserCheck size={20} />, label: t("panch.behalf"), sub: "Submit on behalf of a citizen", screen: "report-for-someone" as Screen, color: "var(--green)", bg: "var(--success-bg)", cardBg: "#F0FDF4", borderColor: "var(--green)" }'
)

# And update the button rendering
app_code = app_code.replace(
    'className="p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all card-hover active:scale-95"\n              style={{ background: "var(--card)", borderColor: "var(--border)" }}>',
    'className="p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all card-hover active:scale-95"\n              style={{ background: (a as any).cardBg || "var(--card)", borderColor: (a as any).borderColor || "var(--border)" }}>'
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
