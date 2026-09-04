const fs = require('fs');
const path = require('path');

const appPath = 'src/App.tsx';
const i18nPath = 'src/i18n.ts';

let appCode = fs.readFileSync(appPath, 'utf8');
let i18nCode = fs.readFileSync(i18nPath, 'utf8');

// 1. Remove Mitra from App.tsx
// Remove Mitra components
appCode = appCode.replace(/\/\/ ─── Mitra Assistant ───[\s\S]*?function MitraCard.*?}\s*}/, '');
appCode = appCode.replace(/<MitraCard[^>]*\/>/g, '');
appCode = appCode.replace(/<MitraAvatar[^>]*\/>/g, '');
appCode = appCode.replace(/<MitraAvatar[^>]*>\s*<\/MitraAvatar>/g, '');
appCode = appCode.replace(/Mitra — Digital Sahayak/g, '');
appCode = appCode.replace(/<div[^>]*>\s*<MitraCard[^>]*\/>\s*<\/div>/g, '');

// 2. Remove Mitra floating button if any
appCode = appCode.replace(/<button[^>]*>\s*<MitraAvatar[^>]*\/>\s*<\/button>/g, '');

// 3. Remove Mitra from i18n
i18nCode = i18nCode.replace(/\/\/ Mitra\s*("mitra\.[^}]*},\s*)+/g, '');

// 4. Update Landing Page
appCode = appCode.replace(/JSIC Portal/g, 'NavJhar');
appCode = appCode.replace(/Jharkhand Societal Innovation Collaboration Portal/g, 'NavJhar');
appCode = appCode.replace(/"From Local Problems to Scalable Solutions"/g, '"हर समस्या का नया समाधान"');
appCode = appCode.replace(/>\s*Jharkhand Societal Innovation Portal\s*</g, '>NavJhar<');

// 5. Remove 1800-345-JSIC, Help, Voice Guide
appCode = appCode.replace(/<div[^>]*>1800-345-JSIC<\/div>/g, '');
appCode = appCode.replace(/<div[^>]*>Voice Guide<\/div>/g, '');

fs.writeFileSync(appPath, appCode);
fs.writeFileSync(i18nPath, i18nCode);
console.log("Done phase 1");
