import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

app_code = app_code.replace(
    '  ClipboardList, HelpCircle, Volume2, UserCheck, Building, Factory,',
    '  ClipboardList, HelpCircle, Volume2, UserCheck, Building, Factory, Edit2,'
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
