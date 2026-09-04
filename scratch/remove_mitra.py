with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Remove MitraAvatar and MitraCard functions
text = re.sub(r'// [^\n]*Mitra Assistant[^\n]*\nfunction MitraAvatar[\s\S]*?function MitraCard[\s\S]*?\}\n\}', '', text)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned Mitra dead code')
