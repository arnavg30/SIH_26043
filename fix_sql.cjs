const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');

const oldCode = `    let query = \`
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
      ORDER BY p.created_at DESC
    \`;
    let params = [];
    
    if (domains.length > 0) {
      const matchClauses = domains.map((d, i) => \`($\${i + 1} ILIKE '%' || c.category_name || '%' OR c.category_name ILIKE '%' || $\${i + 1} || '%')\`);
      query += \` AND (\${matchClauses.join(' OR ')})\`;
      params = domains;
    }

    query += \` ORDER BY p.created_at DESC LIMIT 50\`;`;

const newCode = `    let query = \`
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
    \`;
    let params = [];
    
    if (domains.length > 0) {
      const matchClauses = domains.map((d, i) => \`($\${i + 1} ILIKE '%' || c.category_name || '%' OR c.category_name ILIKE '%' || $\${i + 1} || '%')\`);
      query += \` AND (\${matchClauses.join(' OR ')})\`;
      params = domains;
    }

    query += \` ORDER BY p.created_at DESC LIMIT 50\`;`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('backend/server.js', code);
console.log("Fixed SQL bug");
