const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

if (!code.includes('getProblemByCode')) {
  code += `
export async function getProblemByCode(code: string) {
  return apiFetch(\`/api/problems/\${code}\`);
}
`;
  fs.writeFileSync('src/api.ts', code);
  console.log("Added getProblemByCode");
}
