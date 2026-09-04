with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if "Mitra Assistant" in line:
        start_idx = i
    if "Language Modal" in line:
        end_idx = i
        break

if start_idx is not None and end_idx is not None:
    lines = lines[:start_idx] + lines[end_idx:]
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Mitra dead code removed completely")
else:
    print("Indices not found:", start_idx, end_idx)
