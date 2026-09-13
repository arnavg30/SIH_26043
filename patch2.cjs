const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const modalComponent = `
function ForgotPasswordModal({ isOpen, onClose, initialEmail }: { isOpen: boolean; onClose: () => void; initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  if (!isOpen) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    setStatus("idle");
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { auth } = await import("./firebase/config");
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
      setMsg("Reset link sent to " + email + "! Check your inbox.");
    } catch(err: any) {
      setStatus("error");
      setMsg(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-sm p-6 flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
          <X size={20} color="var(--text)" />
        </button>
        
        <h2 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Forgot Password?</h2>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--success-bg)" }}>
              <CheckCircle size={24} color="var(--success)" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{msg}</p>
            <Btn className="mt-6 w-full" onClick={onClose}>Back to Login</Btn>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            
            {status === "error" && (
              <div className="p-2.5 rounded-xl flex items-start gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>{msg}</p>
              </div>
            )}
            
            <Btn type="submit" disabled={loading} className="w-full" icon={loading ? <Loader size={16} className="animate-spin" /> : undefined}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Btn>
          </form>
        )}
      </Card>
    </div>
  );
}
`;

code = code.replace('function EmailPasswordAuthForm(', modalComponent + '\nfunction EmailPasswordAuthForm(');
fs.writeFileSync('src/App.tsx', code);
console.log('Added ForgotPasswordModal');
