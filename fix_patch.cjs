const fs = require('fs');
let text = fs.readFileSync('patch_app.js', 'utf8');
text = text.replace('const modalCode = \\', 'const modalCode = `');
text = text.replace('function IndustryProjectDetailScreen\\;', '`\n\nfunction IndustryProjectDetailScreen');
fs.writeFileSync('patch_app.js', text);

let text2 = fs.readFileSync('patch_app2.js', 'utf8');
text2 = text2.replace('const modal = ', 'const modal = `');
text2 = text2.replace('\n;\n\ncode = code.replace', '`;\n\ncode = code.replace');
text2 = text2.replace('const replaceBtn = ', 'const replaceBtn = `');
text2 = text2.replace('\n;\ncode = code.replace', '`;\ncode = code.replace');
text2 = text2.replace('const replaceBtnUni = ', 'const replaceBtnUni = `');
text2 = text2.replace('\n;\n\ncode = code.replace', '`;\n\ncode = code.replace');
fs.writeFileSync('patch_app2.js', text2);
console.log('Fixed syntax in patch scripts');
