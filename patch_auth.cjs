const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(authMode === "signup"\) \{\s*await createUserWithEmailAndPassword\(auth, email\.trim\(\), password\);/g,
  `if (authMode === "signup") {
          const { checkEmailExists } = await import("./api");
          await checkEmailExists(email.trim());
          await createUserWithEmailAndPassword(auth, email.trim(), password);`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Injected pre-flight email check');
