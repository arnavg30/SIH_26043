const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /setErrorMsg\("Password must be at least 6 characters\."\);\s*return;\s*}\s*setLoading\(true\);/g;

let matches = [...code.matchAll(regex)];

if (matches.length === 4) {
  // matches[0] = VictimAuthScreen
  // matches[1] = OrgAuthScreen
  // matches[2] = UniAuthScreen
  // matches[3] = IndustryAuthScreen

  const rejectEdu = setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    const eDomain = email.trim().toLowerCase();
    if (eDomain.endsWith('.edu') || eDomain.endsWith('.ac.in') || eDomain.endsWith('.edu.in')) {
      setErrorMsg("Institutional emails (.edu, .ac.in) are reserved for University accounts. Please sign in via the University portal.");
      return;
    }
    setLoading(true);;

  const requireEdu = setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    const eDomain = email.trim().toLowerCase();
    if (!eDomain.endsWith('.edu') && !eDomain.endsWith('.ac.in') && !eDomain.endsWith('.edu.in')) {
      setErrorMsg("University accounts must use a valid institutional email (.edu or .ac.in).");
      return;
    }
    setLoading(true);;

  let newCode = code.substring(0, matches[0].index) + rejectEdu + 
                code.substring(matches[0].index + matches[0][0].length, matches[1].index) + rejectEdu +
                code.substring(matches[1].index + matches[1][0].length, matches[2].index) + requireEdu +
                code.substring(matches[2].index + matches[2][0].length, matches[3].index) + rejectEdu +
                code.substring(matches[3].index + matches[3][0].length);
                
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Patched App.tsx for email validation!");
} else {
  console.log("Could not find the exact 4 auth submit blocks", matches.length);
}
