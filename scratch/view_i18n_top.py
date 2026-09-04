import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Check language keys
print('LANG_NAMES:')
for line in text.splitlines()[:20]:
    print(line)
