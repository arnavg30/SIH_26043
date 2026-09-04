with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Regex for emoji characters
emoji_pattern = re.compile("[\U00010000-\U0010ffff]", flags=re.UNICODE)
matches = emoji_pattern.findall(text)
print(f"Total emojis found: {len(matches)}")
if matches:
    print("Found:", set(matches))
