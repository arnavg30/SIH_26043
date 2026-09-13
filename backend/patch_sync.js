const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldSync =   const existing = await client.query(
      \SELECT user_id, user_type, sub_type FROM users WHERE firebase_uid =  LIMIT 1\,
      [req.user.uid]
    );

    let row;
    if (existing.rows[0]) {
      const result = await client.query(
        \UPDATE users
         SET phone_number = COALESCE(, phone_number),
             email = COALESCE(, email),
             language_id = COALESCE(, language_id),
             is_verified = TRUE,
             updated_at = CURRENT_TIMESTAMP
         WHERE firebase_uid = 
         RETURNING user_id, user_type, sub_type, phone_number, email, language_id, is_verified\,
        [req.user.uid, phone, email, languageId]
      );
      row = result.rows[0];
    } else {;

const newSync =   const existing = await client.query(
      \SELECT user_id, user_type, sub_type FROM users WHERE firebase_uid =  LIMIT 1\,
      [req.user.uid]
    );

    // --- ENFORCE EMAIL DOMAIN CONSTRAINT ---
    if (subType === 'UNIVERSITY') {
      if (!email || (!email.endsWith('.edu') && !email.endsWith('.ac.in') && !email.endsWith('.edu.in'))) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: "University accounts must use a valid institutional email (.edu or .ac.in)." });
      }
    } else {
      if (email && (email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in'))) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: "Institutional emails (.edu or .ac.in) are strictly reserved for University accounts." });
      }
    }

    let row;
    if (existing.rows[0]) {
      // --- ENFORCE ROLE CONSISTENCY CONSTRAINT ---
      if (existing.rows[0].sub_type !== subType) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: \This email is already registered as a \. You cannot switch roles.\ });
      }

      const result = await client.query(
        \UPDATE users
         SET phone_number = COALESCE(, phone_number),
             email = COALESCE(, email),
             language_id = COALESCE(, language_id),
             is_verified = TRUE,
             updated_at = CURRENT_TIMESTAMP
         WHERE firebase_uid = 
         RETURNING user_id, user_type, sub_type, phone_number, email, language_id, is_verified\,
        [req.user.uid, phone, email, languageId]
      );
      row = result.rows[0];
    } else {;

code = code.replace(oldSync, newSync);
fs.writeFileSync('server.js', code);
