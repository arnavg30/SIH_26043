import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Replace ending of LandingScreen with footer
pattern = r'(      </div>\n    </div>\n  );\n})'
# wait let's just find the end of LandingScreen which is just before //  VICTIM ROLE SELECTION 
# I will use a simple split or replace
parts = app_code.split('//  VICTIM ROLE SELECTION ')
if len(parts) > 1:
    # replace the last "    </div>\n  );\n}\n\n" before the comment
    sub = parts[0]
    idx = sub.rfind('    </div>\n  );\n}\n')
    if idx != -1:
        footer = '''      <footer className="mt-auto py-4 px-4 text-center" style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,0.6)" }}>
        <p className="text-xs">A Government of Jharkhand Initiative.</p>
        <p className="text-xs mt-1">Supported by JSAC.</p>
      </footer>
'''
        parts[0] = sub[:idx] + footer + sub[idx:]
        
    app_code = '//  VICTIM ROLE SELECTION '.join(parts)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
