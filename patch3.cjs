const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the old button's onClick
let lines = code.split('\n');
let inAuthForm = false;
let foundButton = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function EmailPasswordAuthForm(')) {
    inAuthForm = true;
  }
  
  if (inAuthForm && lines[i].includes('onClick={async () => {')) {
    // This is the start of the old onClick handler.
    // We want to replace everything from onClick={...} to the end of the button logic
    // We know it spans several lines.
    for (let j = i; j < i + 20; j++) {
      if (lines[j].includes('Forgot Password?')) {
        // We found the end of the button text
        // Replace from i to j-1
        lines.splice(i, j - i, `              onClick={() => setShowForgotModal(true)}`);
        foundButton = true;
        break;
      }
    }
  }
  
  if (inAuthForm && lines[i].includes('</form>')) {
    // Inject the modal rendering right before </form> or after?
    // Let's inject after </form> by wrapping <form> in a <>...</> fragment
    // Wait, EmailPasswordAuthForm returns a <form>. So we can't just put it after. We have to wrap it in <> </>.
    // Let's find the return ( line
    break;
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Button replaced:', foundButton);
