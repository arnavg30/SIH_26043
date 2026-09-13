const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Use regex to wrap the return statement
code = code.replace(
  /return \(\s*<form onSubmit=\{onSubmit\} className="space-y-4">/,
  `return (\n    <>\n    <form onSubmit={onSubmit} className="space-y-4">`
);

// Now find the closing </form> of EmailPasswordAuthForm.
// It's the one right before `}` that ends the function.
// Let's use a targeted replace for the exact area.
code = code.replace(
  /      \{\/\* Error Alert \*\/\}\s*\{errorMsg && \([\s\S]*?\}\)\s*<\/form>/,
  (match) => {
    return match + `\n    <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} initialEmail={email} />\n    </>`;
  }
);

fs.writeFileSync('src/App.tsx', code);
console.log('Wrapped and injected modal');
