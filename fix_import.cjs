const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/submitSolutionAI[\r\n\s]*\} from "\.\/api";/g, 'submitSolutionAI,\n  markSolved\n} from "./api";');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed markSolved import');
