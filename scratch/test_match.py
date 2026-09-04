with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
p_match = re.search(r'function PanchayatDashboardScreen[\s\S]*?function OrgSolverLoginScreen', text)
if p_match:
    print("Found match, length:", len(p_match.group(0)))
    with open('scratch/found_block.txt', 'w', encoding='utf-8') as out:
        out.write(p_match.group(0))
else:
    print("Not found")
