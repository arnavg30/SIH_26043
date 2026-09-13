const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replaceAll(
  '<Card key={s.label} className="p-3 flex items-center gap-3">',
  '<Card key={s.label} className="p-3 flex items-center gap-3 cursor-pointer card-hover" onClick={() => setSelectedFilter({ title: s.label, color: s.color, filterStr: s.label.includes("Total") ? "ALL" : s.label.includes("Review") ? "PENDING" : s.label.includes("Progress") ? "IN_PROGRESS" : "SOLVED" })}>'
);

fs.writeFileSync('src/App.tsx', c);
