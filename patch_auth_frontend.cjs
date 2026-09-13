const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /setErrorMsg\("Password must be at least 6 characters\."\);\s*return;\s*\}\s*setLoading\(true\);/g;

let count = 0;
code = code.replace(regex, (match) => {
  count++;
  if (count === 3) {
    return 'setErrorMsg("Password must be at least 6 characters.");\n      return;\n    }\n    const eDomain = email.trim().toLowerCase();\n    if (!eDomain.endsWith(".edu") && !eDomain.endsWith(".ac.in") && !eDomain.endsWith(".edu.in")) {\n      setErrorMsg("University accounts must use a valid institutional email (.edu or .ac.in).");\n      return;\n    }\n    setLoading(true);';
  } else {
    return 'setErrorMsg("Password must be at least 6 characters.");\n      return;\n    }\n    const eDomain = email.trim().toLowerCase();\n    if (eDomain.endsWith(".edu") || eDomain.endsWith(".ac.in") || eDomain.endsWith(".edu.in")) {\n      setErrorMsg("Institutional emails (.edu, .ac.in) are reserved for University accounts. Please sign in via the University portal.");\n      return;\n    }\n    setLoading(true);';
  }
});
fs.writeFileSync('src/App.tsx', code);
console.log('Replaced successfully ' + count);
