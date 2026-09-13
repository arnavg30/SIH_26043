const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For citizen, panchayat, org-victim
code = code.replace(
  /if \(selectedFilter\.filterStr === "PENDING"\)/g,
  'if (selectedFilter.filterStr === "SUBMITTED") fp = problems.filter(p => p.status === "SUBMITTED");\n    if (selectedFilter.filterStr === "PENDING")'
);

code = code.replace(
  /s\.key === "cit\.submitted" \|\| s\.key === "org\.recommended" \|\| s\.key === "uni\.recommended" \? "ALL" :/g,
  's.key === "cit.submitted" ? "SUBMITTED" : s.key === "org.recommended" || s.key === "uni.recommended" ? "ALL" :'
);

// Fix the View Details button dead logic!
// "View Details button must actually work OR remove the dead button."
// The dead button is in `FilteredProblemsList`
code = code.replace(
  /<Btn variant="secondary" className="w-full text-xs" onClick=\{\(\) => \{\s*\/\/ Usually navigating to detail screen needs saving problem code\s*\/\/ We don't have problem code nav here easily, just basic view\s*\}\}>View Details<\/Btn>/g,
  ''
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed cards mapping and removed dead button');
