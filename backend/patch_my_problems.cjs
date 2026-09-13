const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /if \(user\.sub_type === 'PANCHAYAT'\) \{([\s\S]*?)\}\s*const \{ rows \} = await pool\.query\(query, params\);/g;

code = code.replace(regex, (match, panchayatBlock) => {
  return `if (user.sub_type === 'PANCHAYAT') {${panchayatBlock}} else if (['INDUSTRY', 'UNIVERSITY', 'ORGANIZATION'].includes(user.sub_type)) {
      query = \`
        SELECT p.*, c.category_name, pi.status as initiative_status, pi.proposed_solution
        FROM problem_initiatives pi
        JOIN problems p ON pi.problem_id = p.problem_id
        JOIN problem_categories c ON c.category_id = p.category_id
        WHERE pi.solver_user_id = $1
        ORDER BY pi.created_at DESC
      \`;
      params = [user.user_id];
    }
    const { rows } = await pool.query(query, params);`;
});

fs.writeFileSync('server.js', code);
console.log('Fixed /api/problems/my successfully');
