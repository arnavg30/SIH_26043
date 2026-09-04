app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    app_code = f.read()

import re
# Replace the nav-muted text
repl = r'\1\n              \u0939\u0930 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0928\u092f\u093e \u0938\u092e\u093e\u0927\u093e\u0928\n            \2'.encode('utf-8').decode('unicode_escape')
app_code = re.sub(r'(<div className="text-xs hidden sm:block" style={{ color: "var\(--nav-muted\)" }}>)[\s\S]*?(<\/div>)', repl, app_code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
