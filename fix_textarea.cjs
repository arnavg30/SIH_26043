const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<label className="block text-xs font-medium mb-1" style={{ color: "var\(--text\)" }}>Organization Profile Description \(AI Analyzed\) <span style={{ color: "var\(--error\)" }}>\*<\/span><\/label>\s*<input\s*required\s*value=\{domain\}\s*onChange=\{e => setDomain\(e\.target\.value\)\}\s*placeholder="Describe your capabilities\. AI will automatically match you with relevant problems\."\s*className="w-full px-3 py-2 rounded-xl border text-sm outline-none"\s*style=\{\{ background: "var\(--input-bg\)", borderColor: "var\(--border\)", color: "var\(--text\)" \}\}\s*\/>/;

const replacement = `<label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Organization Profile Description (AI Analyzed) <span style={{ color: "var(--error)" }}>*</span></label>
                  <textarea
                    required
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    rows={3}
                    placeholder="Describe your organization capabilities. AI will automatically match you with relevant problems."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Updated to textarea!");
} else {
  console.log("Could not find regex match!");
}
