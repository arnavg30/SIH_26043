import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()
import re
for m in re.finditer(r'\"(panch\.[^\"]+)\":\s*(\{[^\}]+\})', text):
    print(m.group(1), m.group(2))
