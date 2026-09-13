const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function EmailPasswordAuthForm(')) {
    lines.splice(i+21, 0, '  const [showForgotModal, setShowForgotModal] = useState(false);');
    console.log("Added state");
    break;
  }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
