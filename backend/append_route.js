const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const route = 
// --- MARK SOLVED (IMPACT REPORT AI) ---
app.post("/api/problems/:problemCode/mark-solved", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    
    // update status to SOLVED
    await pool.query("UPDATE problems SET status = 'SOLVED' WHERE problem_code = \\\", [problemCode]);
    
    // fetch context
    const probRes = await pool.query("SELECT description FROM problems WHERE problem_code = \\\", [problemCode]);
    const initRes = await pool.query("SELECT proposed_solution FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = \\\", [problemCode]);
    
    let probDesc = probRes.rows[0]?.description || "";
    let solDesc = initRes.rows[0]?.proposed_solution || "";
    
    // generate impact report
    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_description: probDesc, solution_details: solDesc })
    });
    
    const aiData = await aiRes.json();
    
    // save to DB
    const reportRes = await pool.query(
      "INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES (\\\, \\\, \\\, \\\, \\\) RETURNING *",
      [problemCode, aiData.title || "Impact Report", aiData.summary || "", JSON.stringify(aiData.key_metrics || []), aiData.challenges_overcome || ""]
    );
    
    res.json({ message: "Solved & Impact Report Generated", report: reportRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});
;

code = code.replace('// ---------------- Error handler ----------------', route + '\n// ---------------- Error handler ----------------');
fs.writeFileSync('server.js', code);
