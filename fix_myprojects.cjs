const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix UniDashboardScreen
code = code.replace(
  /function UniDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);/,
  'function UniDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t, setReport } = useApp();\n  const [myProjects, setMyProjects] = useState<any[]>([]);'
);

// Fix IndustryDashboardScreen
code = code.replace(
  /function IndustryDashboardScreen\(\{ onNav \}: \{ onNav: \(s: Screen\) => void \}\) \{\n  const \{ t \} = useApp\(\);/,
  'function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {\n  const { t, setReport } = useApp();\n  const [myProjects, setMyProjects] = useState<any[]>([]);'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed myProjects definition');
