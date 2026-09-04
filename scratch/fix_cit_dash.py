import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Action grid replacement
old_action_grid = '''        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <MapPin size={22} />, key: "cit.track", screen: "tracking" as Screen, color: "var(--navy)" },
            { icon: <Map size={22} />, key: "cit.nearby", screen: "problems-near-me" as Screen, color: "var(--green)" },
            { icon: <Users size={22} />, key: "cit.foranother", screen: "report-for-someone" as Screen, color: "#7C3AED" },
            { icon: <HelpCircle size={22} />, key: "nav.help", screen: "notifications" as Screen, color: "#B45309" },
          ].map(a => (
            <button key={a.key} onClick={() => onNav(a.screen)}
              className="p-4 rounded-xl border-2 text-left transition-all card-hover active:scale-95"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: color-mix(in srgb,  10%, transparent), color: a.color }}>
                {a.icon}
              </div>
              <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{t(a.key)}</div>
            </button>
          ))}
        </div>'''

new_action_grid = '''        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <MapPin size={22} />, label: t("cit.track"), screen: "tracking" as Screen, color: "var(--navy)" },
            { icon: <Map size={22} />, label: t("cit.nearby"), screen: "problems-near-me" as Screen, color: "var(--green)" },
            { icon: <Users size={22} />, label: t("cit.foranother"), screen: "report-for-someone" as Screen, color: "#7C3AED" },
            { icon: <Phone size={22} />, label: "Panchayat Helpline", screen: "citizen-dashboard" as Screen, color: "var(--amber)" },
            { icon: <Shield size={22} />, label: "Emergency (112)", screen: "citizen-dashboard" as Screen, color: "var(--error)" }
          ].map(a => (
            <button key={a.label} onClick={() => onNav(a.screen)}
              className="p-4 rounded-xl border-2 text-left transition-all card-hover active:scale-95"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: color-mix(in srgb,  10%, transparent), color: a.color }}>
                {a.icon}
              </div>
              <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{a.label}</div>
            </button>
          ))}
        </div>'''

app_code = app_code.replace(old_action_grid, new_action_grid)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
