const fs = require('fs');
let c = fs.readFileSync('backend/server.js', 'utf8');

const targetStr = `app.patch("/api/problems/:problemCode/accept", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    const { rowCount } = await pool.query(
      \`UPDATE problems SET status = 'ASSIGNED' WHERE problem_code = $1\`,
      [problemCode]
    );
    if (rowCount === 0) return res.status(404).json({ message: "Problem not found" });
    res.json({ message: "Problem status updated to ASSIGNED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting problem" });
  }
});`;

const newStr = `app.patch("/api/problems/:problemCode/accept", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
    const { problemCode } = req.params;
    
    const pRes = await pool.query(\`SELECT problem_id FROM problems WHERE problem_code = $1\`, [problemCode]);
    if (pRes.rows.length === 0) return res.status(404).json({ message: "Problem not found" });
    const pid = pRes.rows[0].problem_id;
    
    await pool.query(
      \`UPDATE problems SET status = 'ASSIGNED' WHERE problem_code = $1\`,
      [problemCode]
    );
    
    await pool.query(
      \`INSERT INTO problem_initiatives (problem_id, solver_user_id, status) VALUES ($1, $2, 'DEVELOPMENT')\`,
      [pid, user.user_id]
    );
    
    res.json({ message: "Problem status updated to ASSIGNED and initiative created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting problem" });
  }
});`;

c = c.replace(targetStr, newStr);
fs.writeFileSync('backend/server.js', c);
