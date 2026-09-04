with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'style={{ background: color-mix(in srgb,  12%, transparent), color: s.color }}>',
    'style={{ background: color-mix(in srgb,  12%, transparent), color: s.color }}>'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed color-mix template strings')
