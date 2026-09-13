const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Btn Props precisely
app = app.replace(
  /function Btn\(\{ children, variant = "primary", onClick, className = "", disabled = false, icon, type = "button" \}: \{\r?\n\s*children: React\.ReactNode; variant\?: "primary" \| "secondary" \| "ghost" \| "danger" \| "success" \| "nav";\r?\n\s*onClick\?: \(\) => void; className\?: string; disabled\?: boolean; icon\?: React\.ReactNode;\r?\n\s*\}\)/g,
  'function Btn({ children, variant = "primary", onClick, className = "", disabled = false, icon, type = "button" }: {\n    children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "nav";\n    onClick?: () => void; className?: string; disabled?: boolean; icon?: React.ReactNode; type?: "button" | "submit" | "reset";\n  })'
);

// Remove the `if (onNav) onNav("org-victim-dashboard");` at line 2844
app = app.replace(/if \(onNav\) onNav\("org-victim-dashboard"\);/g, 'onNav("org-victim-dashboard");');

fs.writeFileSync('src/App.tsx', app);

let mitra = fs.readFileSync('src/components/MitraAssistant.tsx', 'utf8');
mitra = mitra.replace(/interface MitraAssistantProps \{/g, 'interface MitraAssistantProps {\n  badgeText?: string;');
fs.writeFileSync('src/components/MitraAssistant.tsx', mitra);

console.log('Fixed everything');
