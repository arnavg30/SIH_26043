const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add sendPasswordResetEmail to imports
code = code.replace(/signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, reload, signOut/, 'signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, reload, signOut, sendPasswordResetEmail');

// Add reset logic and UI to EmailPasswordAuthForm
const target = `          </button>
        </div>
      </div>

      {/* Error Alert */}`;

const replacement = `          </button>
        </div>
        {authMode === "signin" && (
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
        )}
      </div>

      {/* Error Alert */}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Added Forgot Password');
