const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setScreen\(s\);\s*window\.scrollTo\(0, 0\);/g,
  'setScreen(s);\n        localStorage.setItem("active_screen", s);\n        window.scrollTo(0, 0);'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed navigate localStorage setItem');
