const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/>Domain <span style={{ color: "var\(--error\)" }}>\*<\/span><\/label>/g, '>Organization Profile Description (AI Analyzed) <span style={{ color: "var(--error)" }}>*</span></label>');
code = code.replace(/placeholder="e\.g\. Education, Healthcare, Water Management, Rural Development\.\.\."/g, 'placeholder="Describe your capabilities. AI will automatically match you with relevant problems."');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated Profile Form!");
