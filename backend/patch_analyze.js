const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const route = 
// --- AI ANALYZE PROBLEM ---
app.post("/api/problems/ai-analyze", verifyToken, async (req, res) => {
  try {
    const { text, latitude, longitude } = req.body;
    
    // Fetch nearby problems for duplicate check
    let existing = [];
    if (latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const radiusKm = 10;
      const nearbyRes = await pool.query(
        "SELECT problem_code, title, description, (6371 * acos(LEAST(1, GREATEST(-1, cos(radians(\\\)) * cos(radians(latitude)) * cos(radians(longitude) - radians(\\\)) + sin(radians(\\\)) * sin(radians(latitude)))))) AS distance_km FROM problems WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND (6371 * acos(LEAST(1, GREATEST(-1, cos(radians(\\\)) * cos(radians(latitude)) * cos(radians(longitude) - radians(\\\)) + sin(radians(\\\)) * sin(radians(latitude)))))) <= \\\",
        [lat, lng, radiusKm]
      );
      existing = nearbyRes.rows.map(r => ({ text: r.description, location: "Nearby" }));
    }

    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, coordinates: \\,\\, existing_problems: existing })
    });
    
    const aiData = await aiRes.json();
    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error analyzing problem" });
  }
});
;

code = code.replace('// ---------------- Error handler ----------------', route + '\n// ---------------- Error handler ----------------');
fs.writeFileSync('server.js', code);
console.log('Added /api/problems/ai-analyze');
