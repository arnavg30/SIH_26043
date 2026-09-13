const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let uniCount = 0;
code = code.replace(/onNav\("solver-dashboard"\)/g, (match, offset) => {
  // If it's in UniDashboardScreen, the code before this has 'function UniDashboardScreen'
  // If it's in IndustryDashboardScreen, the code before this has 'function IndustryDashboardScreen'
  const before = code.substring(0, offset);
  const uniIdx = before.lastIndexOf('function UniDashboardScreen');
  const indIdx = before.lastIndexOf('function IndustryDashboardScreen');
  const orgIdx = before.lastIndexOf('function OrgSolverDashboardScreen');
  
  // Find which one is closest (highest index)
  if (uniIdx > indIdx && uniIdx > orgIdx) return 'onNav("uni-challenge-detail")';
  if (indIdx > uniIdx && indIdx > orgIdx) return 'onNav("industry-project-detail")';
  if (orgIdx > uniIdx && orgIdx > indIdx) return 'onNav("uni-challenge-detail")'; // Org solver doesn't have a detail screen yet, we'll route to uni-challenge-detail for now
  
  return 'onNav("uni-challenge-detail")'; // fallback
});

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed navigation routes');
