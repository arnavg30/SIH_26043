import re

app_path = 'src/App.tsx'

with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    app_code = f.read()

# Replace any garbled text pattern
app_code = re.sub(r'\?\? \?\?\?\?\?\? \?\? \?\?\? \?\?\?\?\?\?', '\u0939\u0930 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0928\u092f\u093e \u0938\u092e\u093e\u0927\u093e\u0928', app_code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)

print('Fixed App.tsx')
