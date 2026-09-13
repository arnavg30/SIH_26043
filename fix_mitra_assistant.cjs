const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldBanner = `{/* AI Helper Banner */}
        <div className="mb-6 rounded-lg p-4 flex gap-4 items-start" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <img src="/mitra.png" alt="Mitra Sahayak" className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-teal-500/30" />
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>Here is your profile information. You can view or update your details anytime.</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Tap Edit Profile below to update your name, address or contact details.</p>
          </div>
        </div>`;

const newBanner = `{/* AI Helper Banner */}
        <div className="mb-6">
          <MitraAssistant
            size="compact"
            message="Here is your profile information. You can view or update your details anytime."
            subMessage="Tap Edit Profile below to update your name, address or contact details."
          />
        </div>`;

code = code.replace(oldBanner, newBanner);
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced with MitraAssistant component");
