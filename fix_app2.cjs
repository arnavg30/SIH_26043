const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Move ErrorBoundary
const ebMatch = code.match(/import React from 'react';\r?\nclass ErrorBoundary extends React\.Component \{[\s\S]*?return this\.props\.children;\r?\n  \}\r?\n\}\r?\n/);
if (ebMatch) {
  code = code.replace(ebMatch[0], '');
  // Find the last import
  const importMatches = [...code.matchAll(/^import .*?;?\r?\n/gm)];
  const lastImportMatch = importMatches[importMatches.length - 1];
  const insertPos = lastImportMatch.index + lastImportMatch[0].length;
  
  code = code.slice(0, insertPos) + '\n' + ebMatch[0] + '\n' + code.slice(insertPos);
}

// 2. Fix resetReport
code = code.replace(/const \{ t, lang, resetReport \} = useApp\(\);/g, 'const { t, role, resetReport } = useApp();');
code = code.replace(/const \{ t, role \} = useApp\(\);[\s\S]*?const \[sel, setSel\] = useState<string \| null>\(null\);/g, 'const { t, role, resetReport } = useApp();\n    const [sel, setSel] = useState<string | null>(null);');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx imports and resetReport');
