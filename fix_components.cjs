const fs = require('fs');

// Fix MitraAssistantProps
let mitra = fs.readFileSync('src/components/MitraAssistant.tsx', 'utf8');
mitra = mitra.replace(/interface MitraAssistantProps \{/, 'interface MitraAssistantProps {\n  badgeText?: string;');
fs.writeFileSync('src/components/MitraAssistant.tsx', mitra);

// Fix Btn Props
let btn = fs.readFileSync('src/components/Btn.tsx', 'utf8');
btn = btn.replace(/icon\?: React\.ReactNode;\n\}/, 'icon?: React.ReactNode;\n  type?: "button" | "submit" | "reset";\n}');
btn = btn.replace(/function Btn\(\{ children, variant = "primary", onClick, className = "", disabled = false, icon \}/, 'function Btn({ children, variant = "primary", onClick, className = "", disabled = false, icon, type = "button" }');
btn = btn.replace(/<button\n\s*className=\{\`\$\{baseClass\} \$\{/g, '<button\n      type={type}\n      className={`${baseClass} ${');
fs.writeFileSync('src/components/Btn.tsx', btn);

console.log('Fixed components');
