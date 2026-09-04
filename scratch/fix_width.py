with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('width: ${f.score}%,', 'width: `${f.score}%`,')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed width in ProjectHealthScreen')
