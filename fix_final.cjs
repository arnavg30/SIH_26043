const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// AppCtx Context Provider Defaults
code = code.replace(
  'report: { description: "", category: "", categoryId: "", evidence: "", files: [], previews: [], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "", aiAnalysis: null, impactReport: null, status: undefined }, setReport: () => {},',
  'report: { description: "", category: "", categoryId: "", evidence: "", files: [], previews: [], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "", aiAnalysis: null, impactReport: null, status: undefined }, setReport: () => {}, selectedTrackingId: null, setSelectedTrackingId: () => {},'
);

// Add behind
code = code.replaceAll(
  '{ label: "Reviewed", pending: true, done: false }',
  '{ label: "Reviewed", pending: true, done: false, behind: false }'
);
code = code.replaceAll(
  '{ label: "Assigned", pending: true, done: false }',
  '{ label: "Assigned", pending: true, done: false, behind: false }'
);
code = code.replaceAll(
  '{ label: "Resolved", pending: true, done: false }',
  '{ label: "Resolved", pending: true, done: false, behind: false }'
);
code = code.replaceAll(
  '{ label: "Verification", pending: true, done: false }',
  '{ label: "Verification", pending: true, done: false, behind: false }'
);
code = code.replaceAll(
  '{ label: "Reported", done: true }',
  '{ label: "Reported", done: true, behind: false }'
);
code = code.replaceAll(
  '{ label: "Reviewed", active: true, done: false }',
  '{ label: "Reviewed", active: true, done: false, behind: false }'
);

code = code.replaceAll(
  'onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}',
  'onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIsOpen(false); }}'
);

code = code.replace(
  'type Screen = "citizen-dashboard"',
  'type Screen = "citizen-dashboard" | "govt-validation"'
);
code = code.replace(
  'type Screen = "citizen-dashboard"',
  'type Screen = "citizen-dashboard" | "govt-validation"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed final tsc");
