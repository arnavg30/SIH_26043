const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

function injectState(funcName, fetchRole, targetVar) {
  let success = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`function ${funcName}(`)) {
      lines.splice(i+2, 0, `  const [problems, setProblems] = useState<any[]>([]);`);
      lines.splice(i+3, 0, `  useEffect(() => { getMyProblems().then(data => { if(data) setProblems(data.problems || data); }).catch(console.error); }, []);`);
      
      // Look for the statuses array
      for (let j = i; j < i + 50; j++) {
        if (lines[j] && lines[j].includes('const statuses = [')) {
          // Replace hardcoded values inside the array block until ]
          for (let k = j; k < j + 20; k++) {
            if (lines[k].includes(']')) break;
            if (funcName === 'CitizenDashboardScreen') {
              lines[k] = lines[k].replace(/val: "\d+"/, 'val: problems.length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "PENDING").length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "SOLVED").length.toString()');
            } else {
              lines[k] = lines[k].replace(/val: "\d+"/, 'val: problems.length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "PENDING").length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString()')
                               .replace(/val: "\d+"/, 'val: problems.filter((p: any) => p.status === "SOLVED").length.toString()');
            }
          }
          success = true;
          break;
        }
      }
      break;
    }
  }
  console.log(funcName, success ? "SUCCESS" : "FAILED");
}

injectState('CitizenDashboardScreen', 'citizen');
injectState('PanchayatDashboardScreen', 'panchayat');
injectState('OrgVictimDashboardScreen', 'localorg');

fs.writeFileSync('src/App.tsx', lines.join('\n'));
