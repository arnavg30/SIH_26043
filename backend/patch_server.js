const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const newEndpoint = `
app.post("/api/auth/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const existing = await pool.query("SELECT sub_type FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        exists: true, 
        role: existing.rows[0].sub_type,
        message: \`Yeh email pehle se '\${existing.rows[0].sub_type}' ke roop mein registered hai. Ek email sirf ek role ke liye use ho sakta hai.\` 
      });
    }
    res.json({ exists: false });
  } catch(err) {
    res.status(500).json({ message: "Server error" });
  }
});
`;

code = code.replace('app.post("/api/auth/sync"', newEndpoint + '\napp.post("/api/auth/sync"');
fs.writeFileSync('server.js', code);
console.log('Added /api/auth/check-email');
