const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

function fixVals(funcName) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`function ${funcName}(`)) {
      let count = 0;
      for (let j = i; j < i + 50; j++) {
        if (lines[j] && lines[j].includes('const statuses = [')) {
          for (let k = j; k < j + 20; k++) {
            if (lines[k].includes(']')) break;
            if (lines[k].includes('val:')) {
              if (count === 0) lines[k] = lines[k].replace(/val: [^,]+/, 'val: problems.length.toString()');
              if (count === 1) lines[k] = lines[k].replace(/val: [^,]+/, 'val: problems.filter((p: any) => p.status === "PENDING").length.toString()');
              if (count === 2) lines[k] = lines[k].replace(/val: [^,]+/, 'val: problems.filter((p: any) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED").length.toString()');
              if (count === 3) lines[k] = lines[k].replace(/val: [^,]+/, 'val: problems.filter((p: any) => p.status === "SOLVED").length.toString()');
              count++;
            }
          }
          break;
        }
      }
      break;
    }
  }
}

fixVals('CitizenDashboardScreen');
fixVals('PanchayatDashboardScreen');
fixVals('OrgVictimDashboardScreen');

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed dashboard vals');
