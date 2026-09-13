const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\} from "\.\/api";/,
  '  getRecommendedProblems, getMyProblems, acceptProblem, submitSolutionAI, markSolved\n} from "./api";'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed API imports');
