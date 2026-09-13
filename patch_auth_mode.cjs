const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to find the added validations and wrap them in `if (authMode === "signup") { ... }`
// The validation code looks like this:
// const eDomain = email.trim().toLowerCase();
// if (!eDomain.endsWith(".edu") && ... ) { ... }

// Let's replace the whole validation block
code = code.replace(/const eDomain = email\.trim\(\)\.toLowerCase\(\);\s*if \(\!eDomain\.endsWith\("\.edu"\).*?return;\s*\}/g, 
  'const eDomain = email.trim().toLowerCase();\n    if (authMode === "signup" && !eDomain.endsWith(".edu") && !eDomain.endsWith(".ac.in") && !eDomain.endsWith(".edu.in")) {\n      setErrorMsg("University accounts must use a valid institutional email (.edu or .ac.in).");\n      return;\n    }');

code = code.replace(/const eDomain = email\.trim\(\)\.toLowerCase\(\);\s*if \(eDomain\.endsWith\("\.edu"\).*?return;\s*\}/g, 
  'const eDomain = email.trim().toLowerCase();\n    if (authMode === "signup" && (eDomain.endsWith(".edu") || eDomain.endsWith(".ac.in") || eDomain.endsWith(".edu.in"))) {\n      setErrorMsg("Institutional emails (.edu, .ac.in) are reserved for University accounts. Please sign in via the University portal.");\n      return;\n    }');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed authMode validation');
