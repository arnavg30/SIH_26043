const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setShowForgotModal\(true\)\}\s*Forgot Password\?/g,
  `onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold hover:underline cursor-pointer" 
              style={{ color: "var(--amber)" }}
            >
              Forgot Password?`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed button JSX');
