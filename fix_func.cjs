const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);\n  return \(\n    <div className="min-h-screen" style=\{\{ background: "var\(--bg\)" \}\}>\n      <NavBar role="industry"/, 'function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t } = useApp();\n  return (\n    <div className="min-h-screen" style={{ background: "var(--bg)" }}>\n      <NavBar role="industry"');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed function definition');
