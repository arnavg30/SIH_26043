const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{ icon: <SendHorizontal size=\{20\} \/>, val: problems\.length\.toString\(\), key: "cit\.submitted"/g,
  '{ icon: <SendHorizontal size={20} />, val: problems.filter((p: any) => p.status === "SUBMITTED").length.toString(), key: "cit.submitted"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed citizen submitted count');
