const fs = require('fs');
let code = fs.readFileSync('patch_app_real.cjs', 'utf8');
code = code.replace('`\n\nfunction IndustryProjectDetailScreen\ncode = code.replace', '`;\n\ncode = code.replace');
fs.writeFileSync('patch_app_real.cjs', code);
console.log('Fixed floating text');
