import re
app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    app_code = f.read()

app_code = app_code.replace(
    'icon: <GraduationCap size={28} color="#7C3AED" />, bg: "#EDE9FE",',
    'icon: <GraduationCap size={28} color="var(--navy)" />, bg: "#EFF6FF",'
)
app_code = app_code.replace(
    'icon: <Factory size={28} color="#0E7490" />, bg: "#ECFEFF",',
    'icon: <Factory size={28} color="var(--navy)" />, bg: "#EFF6FF",'
)
app_code = app_code.replace(
    'icon: <Briefcase size={28} color="#B45309" />, bg: "#FEF3C7",',
    'icon: <Briefcase size={28} color="var(--navy)" />, bg: "#EFF6FF",'
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
