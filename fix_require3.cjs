const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const { getProblemsNearMe } = require("./api");\n          getProblemsNearMe(pos.coords.latitude, pos.coords.longitude)\n            .then((data: any) => { setProblems(data.problems || []); setLoading(false); })',
  'import("./api").then(({ getProblemsNearMe }) => {\n            getProblemsNearMe(pos.coords.latitude, pos.coords.longitude).then((data: any) => { setProblems(data.problems || []); setLoading(false); });\n          })'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed ProblemsNearMeScreen");
