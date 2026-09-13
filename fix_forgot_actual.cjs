const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. FORGOT PASSWORD
const pwdTarget = 'onClick={() => setShowPassword(p => !p)}';
const pwdTargetEnd = '      {/* Error Alert */}';

let lines = code.split('\n');
let insertedPwd = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function EmailPasswordAuthForm(')) {
    // Look for the end of the password input
    for (let j = i; j < i + 100; j++) {
      if (lines[j] && lines[j].includes('{/* Error Alert */}')) {
        // Insert before Error Alert
        lines.splice(j, 0, `        {authMode === "signin" && (
          <div className="flex justify-end mt-1">
            <button 
              type="button" 
              onClick={async () => {
                if (!email) {
                  alert("Please enter your email address first");
                  return;
                }
                try {
                  const { sendPasswordResetEmail } = await import("firebase/auth");
                  const { auth } = await import("./firebase/config");
                  await sendPasswordResetEmail(auth, email);
                  alert("Password reset link sent to " + email);
                } catch (err: any) {
                  alert(err.message || "Failed to send reset email");
                }
              }}
              className="text-xs font-semibold hover:underline cursor-pointer" 
              style={{ color: "var(--amber)" }}
            >
              Forgot Password?
            </button>
          </div>
        )}`);
        insertedPwd = true;
        break;
      }
    }
    if (insertedPwd) break;
  }
}
if (!insertedPwd) console.log("FAILED to insert Forgot Password");
else console.log("SUCCESS inserted Forgot Password");

code = lines.join('\n');
fs.writeFileSync('src/App.tsx', code);
