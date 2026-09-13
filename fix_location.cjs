const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '["Location", [report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Unknown"]',
  '["Location", [report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || (report.latitude && report.longitude ? "Map-selected location" : (report.aiAnalysis?.location || "Unknown"))]'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed Location bug");
