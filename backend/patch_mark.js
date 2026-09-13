const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldMark = pp.post("/api/problems/:problemCode/mark-solved", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    await pool.query(\UPDATE problems SET status = 'SOLVED' WHERE problem_code = \, [problemCode]);
    const probRes = await pool.query(\SELECT description FROM problems WHERE problem_code = \, [problemCode]);
    const initRes = await pool.query(\SELECT proposed_solution FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = \, [problemCode]);
    let probDesc = probRes.rows[0]?.description || "";
    let solDesc = initRes.rows[0]?.proposed_solution || "";
    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_description: probDesc, solution_details: solDesc })
    });
    const aiData = await aiRes.json();
    const reportRes = await pool.query(
      \INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES (, , , , ) RETURNING *\,
      [problemCode, aiData.title || "Impact Report", aiData.summary || "", JSON.stringify(aiData.key_metrics || []), aiData.challenges_overcome || ""]
    );
    res.json({ message: "Solved & Impact Report Generated", report: reportRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking problem as solved" });
  }
});;

const newMark = pp.post("/api/problems/:problemCode/mark-solved", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    await pool.query(\UPDATE problems SET status = 'SOLVED' WHERE problem_code = \, [problemCode]);
    const probRes = await pool.query(\SELECT description FROM problems WHERE problem_code = \, [problemCode]);
    const initRes = await pool.query(\SELECT proposed_solution FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = \, [problemCode]);
    let probDesc = probRes.rows[0]?.description || "";
    let solDesc = initRes.rows[0]?.proposed_solution || "";
    const fetch = require('node-fetch');
    
    // AI expects challenge_data, solution_data, feedback_list
    const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_data: { description: probDesc }, solution_data: { solution: solDesc }, feedback_list: [] })
    });
    const aiData = await aiRes.json();
    const reportRes = await pool.query(
      \INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES (, , , , ) RETURNING *\,
      [problemCode, "AI Impact Report", aiData.report || "No summary generated", "[]", ""]
    );
    res.json({ message: "Solved & Impact Report Generated", report: reportRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking problem as solved" });
  }
});;

code = code.replace(oldMark, newMark);
fs.writeFileSync('server.js', code);
