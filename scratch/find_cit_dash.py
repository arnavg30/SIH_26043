with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "citizen-dashboard" in line:
        print(f"{i+1}: {line.strip()}")
