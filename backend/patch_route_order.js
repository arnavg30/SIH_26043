const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const recommendedRoute = // --- RECOMMENDED PROBLEMS ROUTE ---
app.get("/api/problems/recommended", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
    // For now, return all problems that are in SUBMITTED or UNDER_REVIEW status
    // so solvers can view and accept them.
    const { rows } = await pool.query(\
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
      ORDER BY p.created_at DESC
      LIMIT 50
    \);
    res.json({ problems: rows });
  } catch(e) { 
    console.error(e);
    res.status(500).json({ error: e.message }); 
  }
});
;

code = code.replace(recommendedRoute, '');

const targetPos = code.indexOf('app.get("/api/problems/:problemCode",');
code = code.substring(0, targetPos) + recommendedRoute + '\n' + code.substring(targetPos);

fs.writeFileSync('server.js', code);
