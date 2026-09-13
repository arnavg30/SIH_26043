const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');

const missingEndpoints = `
// --- TRANSCRIBE AUDIO ---
app.post("/api/transcribe", verifyToken, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No audio file provided" });
    const FormData = require('form-data');
    const fs = require('fs');
    const fetch = require('node-fetch');
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));
    const aiRes = await fetch('http://127.0.0.1:8000/transcribe', {
      method: 'POST',
      body: form
    });
    const aiData = await aiRes.json();
    res.json(aiData);
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ message: "Transcription failed" });
  }
});

// --- FIND SIMILAR IDEAS ---
app.post("/api/problems/find-similar-ideas", verifyToken, async (req, res) => {
  try {
    const { ideas } = req.body; // array of {text, location}
    let inputIdeas = ideas;
    if (!inputIdeas || inputIdeas.length === 0) {
      const { rows } = await pool.query("SELECT description as text, district as location FROM problems LIMIT 10");
      inputIdeas = rows;
    }
    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/find-similar-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideas: inputIdeas })
    });
    const aiData = await aiRes.json();
    res.json(aiData);
  } catch (err) {
    console.error("Find similar ideas error:", err);
    res.status(500).json({ message: "Find similar ideas failed" });
  }
});
`;

code = code.replace('// --- SOLUTION GET ROUTE ---', missingEndpoints + '\n// --- SOLUTION GET ROUTE ---');
fs.writeFileSync('backend/server.js', code);
console.log('Added missing endpoints to server.js');
