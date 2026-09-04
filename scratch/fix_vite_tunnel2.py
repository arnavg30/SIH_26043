import re

file_path = 'vite.config.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Revert previous bad insertion
code = code.replace(
    "    base: process.env.FIGMA_PUBLIC_URL ? ${process.env.FIGMA_PUBLIC_URL}/ : '/',\n    server: { allowedHosts: true },",
    "    base: process.env.FIGMA_PUBLIC_URL ? ${process.env.FIGMA_PUBLIC_URL}/ : '/',"
)

# Insert allowedHosts into existing server block
code = code.replace(
    "    server: {\n      host: '0.0.0.0',",
    "    server: {\n      allowedHosts: true,\n      host: '0.0.0.0',"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
