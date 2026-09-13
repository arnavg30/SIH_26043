const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>`;

const replacement = `function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed function definition without regex');
