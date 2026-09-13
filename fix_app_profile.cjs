const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/function ProfileScreen\(\{ onNav, role \}: \{ onNav: \(s: Screen\) => void; role: string \}\) \{\r?\n    const \{ t, role, resetReport \} = useApp\(\);/g, 'function ProfileScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {\n    const { t, resetReport } = useApp();');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed ProfileScreen redeclaration');
