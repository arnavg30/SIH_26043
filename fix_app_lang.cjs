const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \{ t, role, resetReport \} = useApp\(\);/g, 'const { t, lang, role, resetReport } = useApp();');
code = code.replace(/const \{ t, resetReport \} = useApp\(\);/g, 'const { t, lang, resetReport } = useApp();');

fs.writeFileSync('src/App.tsx', code);
console.log('Restored lang variable in useApp()');
