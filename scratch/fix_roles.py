import re
app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    app_code = f.read()

# Fix VictimSelectScreen colors
app_code = app_code.replace(
    'icon: <Building2 size={28} color="var(--navy)" />, bg: "#EFF6FF", accentColor: "var(--navy)",',
    'icon: <Building2 size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",'
)
app_code = app_code.replace(
    'icon: <Users size={28} color="var(--navy)" />, bg: "#E8EEF5", accentColor: "var(--navy)",',
    'icon: <Users size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",'
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
