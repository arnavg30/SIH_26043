with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()
import re
# check makeT
print('Languages configured in makeT:')
match = re.search(r'function makeT[\s\S]*?\}', text)
if match:
    print(match.group(0))
