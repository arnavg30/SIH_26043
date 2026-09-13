const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');

// 1. Add AI logic to Industry Profile
const indReplace =     if (!clean(companyAddress)) return res.status(400).json({ message: "Company address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");;
code = code.replace(/    if \(\!clean\(companyAddress\)\) return res\.status\(400\)\.json\(\{ message: "Company address is required" \}\);\n\n    await client\.query\("BEGIN"\);/, indReplace);
code = code.replace(/clean\(domainExpertise\) \|\| "",\n          clean\(companyAddress\),\n          csrBudgetAvailable/g, 'clean(aiExpertise) || "",\n          clean(companyAddress),\n          csrBudgetAvailable');

// 2. Add AI logic to University Profile
const uniReplace =     if (!clean(institutionalAddress)) return res.status(400).json({ message: "Institutional address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");;
code = code.replace(/    if \(\!clean\(institutionalAddress\)\) return res\.status\(400\)\.json\(\{ message: "Institutional address is required" \}\);\n\n    await client\.query\("BEGIN"\);/, uniReplace);
code = code.replace(/clean\(institutionalAddress\),\n          clean\(domainExpertise\) \|\| "",\n        \]/g, 'clean(institutionalAddress),\n          clean(aiExpertise) || "",\n        ]');


// 3. Add AI logic to NGO Profile
const ngoReplace =     if (!clean(registeredAddress)) return res.status(400).json({ message: "Registered address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");;
code = code.replace(/    if \(\!clean\(registeredAddress\)\) return res\.status\(400\)\.json\(\{ message: "Registered address is required" \}\);\n\n    await client\.query\("BEGIN"\);/, ngoReplace);
code = code.replace(/clean\(domain\) \|\| "Societal Innovation",\n          clean\(domainExpertise\) \|\| "",\n          clean\(registeredAddress\),/g, 'clean(domain) || "Societal Innovation",\n          clean(aiExpertise) || "",\n          clean(registeredAddress),');


// 4. FIX 1: Status Jump Bug
code = code.replace(/UPDATE problems SET status = 'IN_PROGRESS' WHERE problem_code = \\\/, "UPDATE problems SET status = 'ASSIGNED' WHERE problem_code = \\");
code = code.replace(/res\.json\(\{ message: "Problem status updated to IN_PROGRESS" \}\);/, 'res.json({ message: "Problem status updated to ASSIGNED" });');

fs.writeFileSync('backend/server.js', code);
console.log('Modified server.js successfully');
