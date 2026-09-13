const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

function applyFilterToSolver(funcName) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`function ${funcName}(`)) {
      let found = false;
      for(let j=i; j<i+20; j++) {
         if (lines[j] && lines[j].includes('useState<any[]>')) {
             lines.splice(j+1, 0, '  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);');
             found = true;
             break;
         }
      }
      
      for(let j=i; j<i+50; j++) {
         if (lines[j] && lines[j].includes('return (')) {
             lines.splice(j, 0, `  if (selectedFilter) {
    let fp = problems;
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = problems.filter(p => p.status === "IN_PROGRESS");
    if (selectedFilter.filterStr === "SOLVED") fp = problems.filter(p => p.status === "SOLVED");
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }`);
             break;
         }
      }

      for(let j=i; j<i+100; j++) {
         if (lines[j] && lines[j].includes('<div key={k.label} onClick={() => k.screen ? onNav(k.screen) : null} className={k.screen ? "cursor-pointer active:scale-95 transition-all" : ""}>')) {
             lines[j] = lines[j].replace('onClick={() => k.screen ? onNav(k.screen) : null} className={k.screen ? "cursor-pointer active:scale-95 transition-all" : ""}', 'onClick={() => setSelectedFilter({ title: k.label, color: k.color, filterStr: k.label.includes("Completed") || k.label.includes("Resolved") ? "SOLVED" : k.label.includes("Collab") || k.label.includes("Active") ? "IN_PROGRESS" : "ALL" })} className="cursor-pointer active:scale-95 transition-all"');
         }
      }
      break;
    }
  }
}

applyFilterToSolver('OrgSolverDashboardScreen');
applyFilterToSolver('UniDashboardScreen');
applyFilterToSolver('IndustryDashboardScreen');

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Applied clickable solver cards');
