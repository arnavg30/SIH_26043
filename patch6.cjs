const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function EmailPasswordAuthForm(')) {
    for (let j = i; j < i + 150; j++) {
      if (lines[j] && lines[j].includes('</form>')) {
        // We found the end of EmailPasswordAuthForm's form
        lines.splice(j + 1, 0, `    <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} initialEmail={email} />`, `    </>`);
        console.log("Injected modal and fragment close");
        break;
      }
    }
    break;
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
