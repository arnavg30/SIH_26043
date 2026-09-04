import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

old_grid = '''        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <FileText size={18} />, label: "Reported Problems", value: "12", color: "var(--navy)" },
            { icon: <CheckCircle size={18} />, label: "Resolved", value: "7", color: "var(--success)" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>'''

new_grid = '''        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <FileText size={18} />, label: "Reported Problems", value: "12", color: "var(--navy)" },
            { icon: <Clock size={18} />, label: "Pending Review", value: "2", color: "var(--warning)" },
            { icon: <Activity size={18} />, label: "In Progress", value: "3", color: "var(--amber)" },
            { icon: <CheckCircle size={18} />, label: "Resolved", value: "7", color: "var(--success)" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>'''

app_code = app_code.replace(old_grid, new_grid)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
