import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Instead of splitting by comment, just search for LandingScreen and then find its closing tag
match = re.search(r'function LandingScreen\(.*?\)\s*\{([\s\S]*?)(?=\nfunction VictimSelectScreen)', app_code)
if match:
    landing_body = match.group(0)
    idx = landing_body.rfind('    </div>\n  );\n}')
    if idx != -1:
        footer = '''      <footer className="mt-auto py-4 px-4 text-center" style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,0.6)" }}>
        <p className="text-xs">A Government of Jharkhand Initiative.</p>
        <p className="text-xs mt-1">Supported by JSAC.</p>
      </footer>
'''
        new_body = landing_body[:idx] + footer + landing_body[idx:]
        app_code = app_code.replace(landing_body, new_body)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
