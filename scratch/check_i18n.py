with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()
import re
keys = re.findall(r'"([a-zA-Z0-9\._]+)":\s*\{', text)
print(f"Total translation keys: {len(keys)}")
for k in keys[:25]:
    print(k)
