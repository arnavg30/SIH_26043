const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix MitraAssistantProps
code = code.replace(/interface MitraAssistantProps \{/g, 'interface MitraAssistantProps {\n  badgeText?: string;');

// 2. Fix Btn Props
code = code.replace(/icon\?: React\.ReactNode;\n\s*\}/g, 'icon?: React.ReactNode; type?: "button" | "submit" | "reset";\n  }');
code = code.replace(/function Btn\(\{ children, variant = "primary", onClick, className = "", disabled = false, icon \}/g, 'function Btn({ children, variant = "primary", onClick, className = "", disabled = false, icon, type = "button" }');
code = code.replace(/<button\n\s*className=\{\`\$\{baseClass\} \$\{/g, '<button\n      type={type}\n      className={`${baseClass} ${');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Types precisely');
