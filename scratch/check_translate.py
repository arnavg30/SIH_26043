import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for line in lines[-25:]:
    print(line, end='')
