const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix AppCtx interface
code = code.replace(
  'interface AppCtx {',
  'interface AppCtx {\n  selectedTrackingId: string | null;\n  setSelectedTrackingId: (id: string | null) => void;'
);
code = code.replace(
  'const Ctx = createContext<AppCtx>({',
  'const Ctx = createContext<AppCtx>({\n  selectedTrackingId: null,\n  setSelectedTrackingId: () => {},'
);

// 2. Fix TimelineStepProps
code = code.replace(
  'type TimelineStepProps = { step: { label: string; done: boolean; active?: boolean; pending?: boolean }; index: number; total: number };',
  'type TimelineStepProps = { step: { label: string; done: boolean; active?: boolean; pending?: boolean; behind?: boolean }; index: number; total: number };'
);

// 3. Fix event handlers
code = code.replaceAll(
  'onClick={(e) => { e.stopPropagation(); onNav("assign-success"); }}',
  'onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNav("assign-success"); }}'
);

// 4. Add "govt-validation" to Screen type
code = code.replace(
  '| "govt-dashboard" | "smart-match" | "assign-success"',
  '| "govt-dashboard" | "govt-validation" | "smart-match" | "assign-success"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Types fixed.");
