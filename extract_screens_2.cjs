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

// Split the file by function declarations at the start of a line
const parts = bak.split(/\nfunction /);

let extracted = "";

for (const name of screenNames) {
  // find the part that starts with `name(`
  const p = parts.find(part => part.startsWith(`${name}(`));
  if (p) {
    extracted += "function " + p + "\n";
    console.log(`Extracted: ${name}`);
  } else {
    console.log(`Not found: ${name}`);
  }
}

const target = "export default function App() {";
let currentApp = fs.readFileSync('src/App.tsx', 'utf8');

if (!currentApp.includes(target)) {
  console.error("Target export not found in App.tsx!");
  process.exit(1);
}

currentApp = currentApp.replace(target, extracted + "\n" + target);

fs.writeFileSync('src/App.tsx', currentApp);
console.log("App.tsx updated!");
