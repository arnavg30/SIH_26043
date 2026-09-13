app.get("/api/problems/recommended", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });

    let expertise = "";
    if (user.sub_type === "INDUSTRY") {
      const q = await pool.query('SELECT domain_expertise FROM industries WHERE user_id = $1', [user.user_id]);
      if (q.rows[0]) expertise = q.rows[0].domain_expertise || "";
    } else if (user.sub_type === "UNIVERSITY") {
      const q = await pool.query('SELECT domain_expertise FROM universities WHERE user_id = $1', [user.user_id]);
      if (q.rows[0]) expertise = q.rows[0].domain_expertise || "";
    }

    const { rows } = await pool.query(
      \SELECT p.*, c.category_name
       FROM problems p
       JOIN problem_categories c ON c.category_id = p.category_id
       WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
       ORDER BY p.created_at DESC LIMIT 50\
    );

    let recommended = rows;
    if (expertise && expertise.trim() !== "") {
       const keywords = expertise.toLowerCase().split(/[\s,]+/).filter(k => k.length > 2);
       if (keywords.length > 0) {
         recommended = rows.map(p => {
            let score = 0;
            const text = ((p.category_name||"") + " " + (p.title||"") + " " + (p.description||"")).toLowerCase();
            keywords.forEach(k => {
               if (text.includes(k)) score += 20; 
            });
            const finalScore = Math.min(99, (p.priority_score || 50) + score);
            return { ...p, priority_score: finalScore, is_match: score > 0 };
         }).filter(p => p.is_match).sort((a, b) => b.priority_score - a.priority_score);
       } else {
         recommended = rows.map(p => ({ ...p, priority_score: p.priority_score || 85 }));
       }
    } else {
       recommended = rows.map(p => ({ ...p, priority_score: p.priority_score || 85 }));
    }

    res.json({ problems: recommended.slice(0, 20) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recommended problems" });
  }
});
