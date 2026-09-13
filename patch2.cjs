const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

function applyFilterToDashboard(funcName) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`function ${funcName}(`)) {
      // Find `const [problems, setProblems]`
      let found = false;
      for(let j=i; j<i+20; j++) {
         if (lines[j] && lines[j].includes('useState<any[]>')) {
             lines.splice(j+1, 0, '  const [selectedFilter, setSelectedFilter] = useState<{title: string, color: string, filterStr: string}|null>(null);');
             found = true;
             break;
         }
      }
      
      // Inject return if selectedFilter
      for(let j=i; j<i+50; j++) {
         if (lines[j] && lines[j].includes('return (')) {
             lines.splice(j, 0, `  if (selectedFilter) {
    let fp = problems;
    if (selectedFilter.filterStr === "PENDING") fp = problems.filter(p => p.status === "PENDING");
    if (selectedFilter.filterStr === "IN_PROGRESS") fp = problems.filter(p => p.status === "IN_PROGRESS" || p.status === "ASSIGNED");
    if (selectedFilter.filterStr === "SOLVED") fp = problems.filter(p => p.status === "SOLVED");
    return <FilteredProblemsList title={selectedFilter.title} color={selectedFilter.color} problems={fp} onBack={() => setSelectedFilter(null)} onNav={onNav} />;
  }`);
             break;
         }
      }

      // Modify the Cards rendering to be clickable
      for(let j=i; j<i+100; j++) {
         if (lines[j] && lines[j].includes('<Card key={s.key} className="p-3 flex items-center gap-3">')) {
             lines[j] = lines[j].replace('<Card key={s.key} className="p-3 flex items-center gap-3">', '<Card key={s.key} className="p-3 flex items-center gap-3 cursor-pointer hover:scale-95 transition-all" onClick={() => setSelectedFilter({ title: t(s.key), color: s.color, filterStr: s.key === "cit.submitted" || s.key === "org.recommended" || s.key === "uni.recommended" ? "ALL" : s.key === "cit.underreview" || s.key === "org.collabs" || s.key === "uni.active" ? "PENDING" : s.key === "cit.inprogress" || s.key === "org.collabs" || s.key === "uni.active" ? "IN_PROGRESS" : "SOLVED" })}>');
         }
      }
      break;
    }
  }
}

applyFilterToDashboard('CitizenDashboardScreen');
applyFilterToDashboard('PanchayatDashboardScreen');
applyFilterToDashboard('OrgVictimDashboardScreen');

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Applied clickable status cards');
