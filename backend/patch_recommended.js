const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldRoute = // --- RECOMMENDED PROBLEMS ROUTE ---
app.get("/api/problems/recommended", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
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
});;

const newRoute = // --- RECOMMENDED PROBLEMS ROUTE ---
app.get("/api/problems/recommended", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
    let domains = [];
    if (user.sub_type === "INDUSTRY") {
      const pRes = await pool.query("SELECT domain_expertise FROM industries WHERE user_id = ", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    } else if (user.sub_type === "UNIVERSITY") {
      const pRes = await pool.query("SELECT domain_expertise FROM universities WHERE user_id = ", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    } else if (user.sub_type === "LOCAL_ORGANIZATION" || user.sub_type === "NGO") {
      const pRes = await pool.query("SELECT domain_expertise FROM local_organizations WHERE user_id = ", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    }

    let query = \
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
    \;
    let params = [];
    
    if (domains.length > 0) {
      // Create flexible matching clauses
      const matchClauses = domains.map((d, i) => \c.category_name ILIKE $\\);
      query += \ AND (\)\;
      params = domains.map(d => \%\%\);
    }

    query += \ ORDER BY p.created_at DESC LIMIT 50\;
    
    const { rows } = await pool.query(query, params);
    res.json({ problems: rows });
  } catch(e) { 
    console.error(e);
    res.status(500).json({ error: e.message }); 
  }
});;

code = code.replace(oldRoute, newRoute);
fs.writeFileSync('server.js', code);
