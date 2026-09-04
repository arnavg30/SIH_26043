import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Remove Affected People from AI DNA arrays
app_code = app_code.replace('["Affected People", "Est. 500 farmers"],', '')
app_code = app_code.replace('["Affected", "~500 farmers"],', '')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
