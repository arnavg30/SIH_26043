const fs = require('fs');

const bak = fs.readFileSync('src/App.tsx.bak', 'utf8');

const screenNames = [
  "ReportForSomeoneScreen",
  "TeamFormationScreen",
  "ProjectHealthScreen",
  "IndustryDashboardScreen",
  "IndustryProjectDetailScreen",
  "PartnershipFormScreen",
  "PartnershipSuccessScreen",
  "SolutionRepoScreen",
  "SolutionDetailScreen",
  "ImpactDashboardScreen"
];

let extracted = "";

for (const name of screenNames) {
  const startPattern = `function ${name}(`;
  let startIndex = bak.indexOf(startPattern);
  if (startIndex === -1) {
    console.error(`Not found: ${name}`);
    continue;
  }
  
  // Find the end of the function. We will just count braces.
  let openBraces = 0;
  let endIndex = -1;
  let started = false;
  for (let i = startIndex; i < bak.length; i++) {
    if (bak[i] === '{') {
      openBraces++;
      started = true;
    } else if (bak[i] === '}') {
      openBraces--;
    }
    if (started && openBraces === 0) {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex !== -1) {
    extracted += bak.substring(startIndex, endIndex + 1) + "\n\n";
    console.log(`Extracted: ${name}`);
  }
}

const target = "export default function App() {";
let currentApp = fs.readFileSync('src/App.tsx', 'utf8');

if (!currentApp.includes(target)) {
  console.error("Target export not found in App.tsx!");
  process.exit(1);
}

currentApp = currentApp.replace(target, extracted + target);

fs.writeFileSync('src/App.tsx', currentApp);
console.log("App.tsx updated!");
