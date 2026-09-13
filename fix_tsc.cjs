const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add selectedTrackingId to AppCtx
code = code.replace(
  'type AppCtx = {',
  'type AppCtx = {\n  selectedTrackingId: string | null;\n  setSelectedTrackingId: (id: string | null) => void;'
);
code = code.replace(
  'const AppContext = createContext<AppCtx>({',
  'const AppContext = createContext<AppCtx>({\n  selectedTrackingId: null,\n  setSelectedTrackingId: () => {},'
);

// 2. Add behind to timeline steps type
code = code.replace(
  'type TimelineStepProps = { step: { label: string; done: boolean; active?: boolean; pending?: boolean }; index: number; total: number };',
  'type TimelineStepProps = { step: { label: string; done: boolean; active?: boolean; pending?: boolean; behind?: boolean }; index: number; total: number };'
);

// 3. Fix event handlers
code = code.replace(
  'onClick={(e) => { e.stopPropagation(); onNav("assign-success"); }}',
  'onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNav("assign-success"); }}'
);
// It happens twice
code = code.replace(
  'onClick={(e) => { e.stopPropagation(); onNav("assign-success"); }}',
  'onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNav("assign-success"); }}'
);

// 4. Add "govt-validation" to Screen type
code = code.replace(
  '| "govt-dashboard" | "smart-match" | "assign-success"',
  '| "govt-dashboard" | "govt-validation" | "smart-match" | "assign-success"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed');
