const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /await syncAuth\(([^,]+),\s*lang\);\s*try\s*\{\s*const pRes = await getProfileMe\(\);/g;

code = code.replace(regex, (match, profileType) => {
  return `try {\n      await syncAuth(${profileType}, lang);\n    } catch (e: any) {\n      setErrorMsg(e.message || "Account role conflict.");\n      setStep("email");\n      return;\n    }\n    try { const pRes = await getProfileMe();`;
});

fs.writeFileSync('src/App.tsx', code);
console.log('Replaced try/catch successfully');
