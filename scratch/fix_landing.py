import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Fix garbled text
app_code = app_code.replace('?? ?????? ?? ??? ??????', '\u0939\u0930 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0928\u092f\u093e \u0938\u092e\u093e\u0927\u093e\u0928')

# Add Footer
footer = '''      <footer className="mt-auto py-4 px-4 text-center" style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,0.6)" }}>
        <p className="text-xs">A Government of Jharkhand Initiative.</p>
        <p className="text-xs mt-1">Supported by JSAC.</p>
      </footer>
    </div>'''

app_code = app_code.replace('    </div>\n  );\n}\n\n// \ufffd VICTIM SELECT \ufffd', footer + '\n  );\n}\n\n// \ufffd VICTIM SELECT \ufffd')
app_code = app_code.replace('    </div>\n  );\n}\n\n//  VICTIM SELECT ', footer + '\n  );\n}\n\n//  VICTIM SELECT ')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
