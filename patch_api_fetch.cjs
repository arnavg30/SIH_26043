const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

code = code.replace(
  'export async function apiFetch(',
  'export async function apiFetch('
);

code = code.replace(
  '  const user = auth.currentUser;',
  '  await auth.authStateReady();\n  const user = auth.currentUser;'
);

// Also fix transcribeAudio which doesn't use apiFetch
code = code.replace(
  'const token = await auth.currentUser?.getIdToken();',
  'await auth.authStateReady();\n  const token = await auth.currentUser?.getIdToken();'
);

fs.writeFileSync('src/api.ts', code);
console.log('Fixed apiFetch to wait for auth initialization');
