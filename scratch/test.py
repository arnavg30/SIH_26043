app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()
print(repr(lines[445]))
