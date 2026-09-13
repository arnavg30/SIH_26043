const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
  '// --- ADMIN ROUTES ---',
  \// --- SOLUTION GET ROUTE ---
app.get("/api/problems/:problemCode/solution", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = ", [req.params.problemCode]);
    res.json({ solution: rows[0] || null });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- ADMIN ROUTES ---\
);

fs.writeFileSync('server.js', code);
