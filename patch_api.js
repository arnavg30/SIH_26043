const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

code += `
export async function checkEmailExists(email: string) {
  const res = await fetch("/api/auth/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to check email");
  }
  return res.json();
}
`;
fs.writeFileSync('src/api.ts', code);
console.log('Added checkEmailExists to api.ts');
