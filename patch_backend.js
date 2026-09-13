
const fs = require('fs');
let c = fs.readFileSync('backend/server.js', 'utf8');

c = c.replace(
  'WHERE p.status IN (\\'SUBMITTED\\', \\'UNDER_REVIEW\\')\r\n    ;',
  'WHERE p.status IN (\\'SUBMITTED\\', \\'UNDER_REVIEW\\')\r\n      ORDER BY p.created_at DESC\r\n    ;'
);

c = c.replace(
  'WHERE p.status IN (\\'SUBMITTED\\', \\'UNDER_REVIEW\\')\n    ;',
  'WHERE p.status IN (\\'SUBMITTED\\', \\'UNDER_REVIEW\\')\n      ORDER BY p.created_at DESC\n    ;'
);

fs.writeFileSync('backend/server.js', c);

