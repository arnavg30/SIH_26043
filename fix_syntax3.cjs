const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\(pos\) \=\> \{\s+const \{ getProblemsNearMe \} \= await import\(\"\.\/api\"\)\;/g, 'async (pos) => {\n          const { getProblemsNearMe } = await import("./api");');

fs.writeFileSync('src/App.tsx', code);
console.log("Regex replace done");
