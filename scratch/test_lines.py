with open('scratch/found_block.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print("Total lines:", len(lines))
print("First 15 lines:")
for l in lines[:15]:
    print(l, end='')
print("---")
print("Last 15 lines:")
for l in lines[-15:]:
    print(l, end='')
