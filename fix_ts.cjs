const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \{ t, lang \} = useApp\(\);/g, 'const { t, lang, resetReport } = useApp();');
code = code.replace(/status: "", aiData: null as any \}\);/g, 'status: undefined as string | undefined, aiData: null as any });');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed typescript minor issues');
