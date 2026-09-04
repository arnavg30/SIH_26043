with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'color-mix(in srgb,  12%, transparent)'
replacement = '`color-mix(in srgb, ${s.color} 12%, transparent)`'

text = text.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully replaced target')
