const fs = require('fs');
let c = fs.readFileSync('src/api.ts', 'utf8');

const toAdd = `
export async function getNotifications() {
  return apiFetch('/api/notifications');
}

export async function markNotificationRead(id: number) {
  return apiFetch(\`/api/notifications/\${id}/read\`, { method: 'PATCH' });
}
`;

c += toAdd;
fs.writeFileSync('src/api.ts', c);
