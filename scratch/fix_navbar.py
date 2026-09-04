import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# 1. Update NavBar navItems to include isCTA
nav_items_old = '''  const navItems: { label: string; screen: Screen; icon: React.ReactNode }[] =
    role === "citizen" ? [
      { label: t("cit.report"), screen: "report-step1", icon: <FileText size={15} /> },
      { label: t("cit.track"), screen: "tracking", icon: <MapPin size={15} /> },
      { label: t("cit.nearby"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },
    ] : role === "panchayat" ? [
      { label: t("panch.problems"), screen: "panchayat-dashboard", icon: <Layers size={15} /> },
      { label: t("panch.verify"), screen: "panchayat-dashboard", icon: <CheckCircle size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },'''

nav_items_new = '''  const navItems: { label: string; screen: Screen; icon: React.ReactNode; isCTA?: boolean }[] =
    role === "citizen" ? [
      { label: t("cit.report"), screen: "report-step1", icon: <FileText size={15} /> },
      { label: t("cit.track"), screen: "tracking", icon: <MapPin size={15} /> },
      { label: t("cit.nearby"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },
    ] : role === "panchayat" ? [
      { label: t("panch.problems"), screen: "panchayat-dashboard", icon: <Layers size={15} /> },
      { label: t("panch.verify"), screen: "panchayat-dashboard", icon: <CheckCircle size={15} />, isCTA: true },
      { label: t("notif.title"), screen: "notifications", icon: <Bell size={15} /> },'''

app_code = app_code.replace(nav_items_old, nav_items_new)

# Update the rendering in NavBar for desktop
desktop_render_old = '''          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => onNav(item.screen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                color: screen === item.screen ? "var(--amber)" : "var(--nav-text)",
                background: screen === item.screen ? "rgba(242,184,75,0.12)" : "transparent"
              }}>
              {item.icon} {item.label}
            </button>
          ))}'''

desktop_render_new = '''          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => onNav(item.screen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(242,184,75,0.4)"
              } : {
                color: screen === item.screen ? "var(--amber)" : "var(--nav-text)",
                background: screen === item.screen ? "rgba(242,184,75,0.12)" : "transparent"
              }}>
              {item.icon} {item.label}
            </button>
          ))}'''

app_code = app_code.replace(desktop_render_old, desktop_render_new)

# Update the rendering in NavBar for mobile
mobile_render_old = '''          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => { onNav(item.screen); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium"
              style={{ color: screen === item.screen ? "var(--amber)" : "var(--nav-text)" }}>
              {item.icon} {item.label}
            </button>
          ))}'''

mobile_render_new = '''          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => { onNav(item.screen); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold"
              } : { color: screen === item.screen ? "var(--amber)" : "var(--nav-text)" }}>
              {item.icon} {item.label}
            </button>
          ))}'''

app_code = app_code.replace(mobile_render_old, mobile_render_new)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
