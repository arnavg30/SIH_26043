import re

file_path = 'vite.config.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Insert server config after ase:
code = code.replace(
    "    base: process.env.FIGMA_PUBLIC_URL ? ${process.env.FIGMA_PUBLIC_URL}/ : '/',",
    "    base: process.env.FIGMA_PUBLIC_URL ? ${process.env.FIGMA_PUBLIC_URL}/ : '/',\n    server: { allowedHosts: true },"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
