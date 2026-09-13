const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// FIX 1: Transcription - double .json() and wrong field name
// Old code (lines ~3551-3554):
//   const res = await transcribeAudio(recordedAudio);
//   const data = await res.json();
//   setDesc(data.text);
//   setMode("text");
const oldTranscribe = `const res = await transcribeAudio(recordedAudio);
                          const data = await res.json();
                          setDesc(data.text);
                          setMode("text");`;

const newTranscribe = `const data = await transcribeAudio(recordedAudio);
                          if (data.error) { alert(data.error); } else {
                            setDesc(data.transcription || data.text || "");
                            setMode("text");
                          }`;

if (c.includes(oldTranscribe)) {
  c = c.replace(oldTranscribe, newTranscribe);
  console.log("FIX 1: Transcription double .json() + wrong field name - APPLIED");
} else {
  console.log("FIX 1: Target not found, trying alternate...");
  // Try matching with less whitespace sensitivity
  c = c.replace(
    /const res = await transcribeAudio\(recordedAudio\);\s*const data = await res\.json\(\);\s*setDesc\(data\.text\);\s*setMode\("text"\);/,
    `const data = await transcribeAudio(recordedAudio);
                          if (data.error) { alert(data.error); } else {
                            setDesc(data.transcription || data.text || "");
                            setMode("text");
                          }`
  );
  console.log("FIX 1: Applied via regex");
}

// FIX 2: Show lat/lng next to location on Review & Submit page
const oldLocation = `{[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map location selected"}`;
const newLocation = `{[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map location selected"}
              </p>
              {report.latitude && report.longitude && (
                <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  📍 {Number(report.latitude).toFixed(4)}° N, {Number(report.longitude).toFixed(4)}° E
                </p>
              )}
              <p className="hidden"`;

if (c.includes(oldLocation)) {
  // We need to also consume the closing </p> that follows to avoid double tags
  c = c.replace(
    oldLocation + `\n              </p>`,
    `{[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map location selected"}
              </p>
              {report.latitude && report.longitude && (
                <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  📍 {Number(report.latitude).toFixed(4)}° N, {Number(report.longitude).toFixed(4)}° E
                </p>
              )}`
  );
  console.log("FIX 2: Lat/Lng display - APPLIED");
} else {
  console.log("FIX 2: Target not found");
}

// FIX 3: Handle requiredSkills being an array (join it) and show AI summary
// The AI returns requiredSkills as an array like ["Skill1", "Skill2"]
// but the UI tries to render it as a string
const oldSkills = `["Required Skills", report.aiAnalysis?.requiredSkills || "TBD"]`;
const newSkills = `["Required Skills", Array.isArray(report.aiAnalysis?.requiredSkills) ? report.aiAnalysis.requiredSkills.join(", ") : (report.aiAnalysis?.requiredSkills || "TBD")]`;

if (c.includes(oldSkills)) {
  c = c.replace(oldSkills, newSkills);
  console.log("FIX 3a: requiredSkills array join - APPLIED");
} else {
  console.log("FIX 3a: requiredSkills target not found");
}

// FIX 3b: Add AI Summary text below Challenge DNA if aiAnalysis has originalText or expectedImpact
// Find the closing of the Challenge DNA table and add a summary card after it
const dnaTableEnd = `["Location", [report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Unknown"],`;
if (c.includes(dnaTableEnd)) {
  const afterDna = c.indexOf(dnaTableEnd) + dnaTableEnd.length;
  // Find the next closing ].map pattern
  const mapIdx = c.indexOf('].map(', afterDna);
  if (mapIdx > -1) {
    // After the DNA table rendering block, look for the parent Card closing
    const cardCloseSearch = c.indexOf('</Card>', mapIdx);
    if (cardCloseSearch > -1) {
      const insertPoint = cardCloseSearch + '</Card>'.length;
      const aiSummaryCard = `

        {report.aiAnalysis && !report.aiAnalysis.error && (
          <Card className="p-4 mb-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <Activity size={16} /> AI Analysis Summary
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {report.aiAnalysis.expectedImpact || "AI analysis completed. Category and priority have been assigned based on the problem description."}
            </p>
            {report.aiAnalysis.originalText && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--bg)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Original Problem Text:</p>
                <p className="text-sm italic" style={{ color: "var(--text)" }}>"{report.aiAnalysis.originalText}"</p>
              </div>
            )}
          </Card>
        )}`;
      c = c.substring(0, insertPoint) + aiSummaryCard + c.substring(insertPoint);
      console.log("FIX 3b: AI Summary card added after Challenge DNA - APPLIED");
    }
  }
}

fs.writeFileSync('src/App.tsx', c);
console.log("All fixes written to src/App.tsx");
