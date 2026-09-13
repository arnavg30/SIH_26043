const fs = require('fs');

let mitra = fs.readFileSync('src/components/MitraAssistant.tsx', 'utf8');
mitra = mitra.replace(/  badgeText\?: string;\r?\n  badgeText\?: string;/g, '  badgeText?: string;');
fs.writeFileSync('src/components/MitraAssistant.tsx', mitra);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/if \(navigator\.mediaDevices && navigator\.mediaDevices\.getUserMedia\)/g, 'if (navigator.mediaDevices && "getUserMedia" in navigator.mediaDevices)');
fs.writeFileSync('src/App.tsx', app);
console.log('Fixed camera feature check and duplicated badgeText');
