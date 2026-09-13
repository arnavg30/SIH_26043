const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Industry Partner') && lines[i].includes('profile.detail ?')) {
        lines[i] = '            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{profile.name || "Industry Partner"}{profile.detail ? " - " + profile.detail : ""}</p>';
    }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Replaced line completely');
