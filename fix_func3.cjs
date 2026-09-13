const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].trim() === '({ onNav }: { onNav: (s: Screen) => void }) {') {
        lines[i] = 'function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {';
        break;
    }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed function definition via lines');
