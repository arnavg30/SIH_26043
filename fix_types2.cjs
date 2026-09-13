const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix MitraAssistantProps
code = code.replace(/interface MitraAssistantProps \{/, 'interface MitraAssistantProps {\n  badgeText?: string;');
// Fix Btn Props
code = code.replace(/icon\?: ReactNode;\n\}/g, 'icon?: ReactNode;\n  type?: "button" | "submit" | "reset";\n}');

// Fix line 2844 condition (if(onNav) -> if(true))
code = code.replace(/if \(onNav\) onNav\("org-victim-dashboard"\);/g, 'onNav("org-victim-dashboard");');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Types again');
