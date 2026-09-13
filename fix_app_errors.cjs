const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix milestones in UniProjectDetailScreen (line ~227)
const msOld = `  const milestones = [
    { label: "Research & Survey", done: true },
    { label: "Prototype Design", done: problem.status === "IN_PROGRESS" || problem.status === "SOLVED" },
    { label: "Testing & Validation", active: problem.status === "ASSIGNED", done: problem.status === "SOLVED" },
    { label: "Pilot Implementation", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
    { label: "Full Deployment", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
  ];`;
const msNew = `  const milestones: { label: string; done?: boolean; active?: boolean; pending?: boolean; behind?: boolean }[] = [
    { label: "Research & Survey", done: true },
    { label: "Prototype Design", done: problem.status === "IN_PROGRESS" || problem.status === "SOLVED" },
    { label: "Testing & Validation", active: problem.status === "ASSIGNED", done: problem.status === "SOLVED" },
    { label: "Pilot Implementation", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
    { label: "Full Deployment", pending: problem.status !== "SOLVED", done: problem.status === "SOLVED" },
  ];`;
code = code.replace(msOld, msNew);

// 2. Fix multiple properties with the same name in AppCtx default value
const ctxOld = `const Ctx = createContext<AppCtx>({
  selectedTrackingId: null,
  setSelectedTrackingId: () => {},
  lang: "en", setLang: () => {}, dark: false, setDark: () => {}, t: (k) => k,
  role: "citizen", setRole: () => {},
  report: { description: "", category: "", categoryId: "", evidence: "", files: [], previews: [], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "", aiAnalysis: null, impactReport: null, status: undefined }, setReport: () => {}, selectedTrackingId: null, setSelectedTrackingId: () => {},
});`;
const ctxNew = `const Ctx = createContext<AppCtx>({
  selectedTrackingId: null,
  setSelectedTrackingId: () => {},
  lang: "en", setLang: () => {}, dark: false, setDark: () => {}, t: (k) => k,
  role: "citizen", setRole: () => {},
  report: { description: "", category: "", categoryId: "", evidence: "", files: [], previews: [], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "", aiAnalysis: null, impactReport: null, status: undefined }, setReport: () => {},
});`;
code = code.replace(ctxOld, ctxNew);

// 3. Fix the event handlers in the notifications component
code = code.replaceAll(
  'onClick={(e) => { e.stopPropagation(); onNav("assign-success"); }}',
  'onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNav("assign-success"); }}'
);

// 4. Add 'govt-validation'
code = code.replace(
  'type Screen = "citizen-dashboard" | "report-issue" | "tracking" | "tracking-detail" | "profile" | "language" | "theme" | "citizen-login"',
  'type Screen = "citizen-dashboard" | "report-issue" | "tracking" | "tracking-detail" | "profile" | "language" | "theme" | "citizen-login" | "govt-validation"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed manually!");
