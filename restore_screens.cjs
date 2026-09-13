const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
let missing = fs.readFileSync('missing_screens.tsx', 'utf8');

const target = 'export default function App() {';
const newApp = app.replace(target, missing + '\n' + target);

fs.writeFileSync('src/App.tsx', newApp);
