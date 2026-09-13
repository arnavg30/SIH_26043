const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const profileCode = `
function ProfileScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const [email, setEmail] = useState("Loading...");

  useEffect(() => {
    import('./firebase/config').then(({ auth }) => {
      if (auth.currentUser) setEmail(auth.currentUser.email || "No email");
      else setEmail("Not logged in");
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="profile" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 flex items-center justify-center mb-4">
          <User size={40} className="text-slate-400" />
        </div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white mb-1">{t("nav.profile")}</h1>
        <p className="text-sm text-slate-500 mb-8">{email}</p>
        
        <Card className="p-4 text-left space-y-4">
           <Btn variant="ghost" className="w-full justify-start text-red-500" onClick={() => {
              import('./firebase/config').then(({ auth }) => {
                import('firebase/auth').then(({ signOut }) => {
                  signOut(auth).then(() => onNav("landing"));
                });
              });
           }}>
             <LogOut size={18} className="mr-2" /> Sign Out
           </Btn>
        </Card>
      </div>
    </div>
  );
}
`;

c = c.replace('export default function App() {', profileCode + '\nexport default function App() {');
fs.writeFileSync('src/App.tsx', c);
