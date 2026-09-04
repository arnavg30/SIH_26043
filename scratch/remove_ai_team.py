import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Regex to match the AI Recommended Team Card
pattern = r'<Card className="p-5">\s*<div className="flex items-center justify-between mb-4">\s*<h3[^>]*>AI Recommended Team</h3>[\s\S]*?</Card>'
app_code = re.sub(pattern, '', app_code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
