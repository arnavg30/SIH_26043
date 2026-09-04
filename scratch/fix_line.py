with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('\"var(--green)\\ theming\" || \"var(--green)\"', '\"var(--green)\"')
text = text.replace('\"var(--green) theming\" || \"var(--green)\"', '\"var(--green)\"')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Cleaned up line 3210')
