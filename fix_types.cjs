const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add badgeText to MitraAssistantProps
code = code.replace(/interface MitraAssistantProps \{/, 'interface MitraAssistantProps {\n  badgeText?: string;');

// 2. Add type to Btn props
code = code.replace(/icon\?: ReactNode;\n\}/, 'icon?: ReactNode;\n  type?: "button" | "submit" | "reset";\n}');

// 3. Add solver-dashboard to Screen type
code = code.replace(/type Screen =/, 'type Screen = "solver-dashboard" |');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed types in App.tsx');
