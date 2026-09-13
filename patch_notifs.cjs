const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function NotificationsScreen({';
const endFunction = 'function ProfileScreen({';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function NotificationsScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./api').then(({ getNotifications }) => {
      getNotifications()
        .then(data => { setNotifs(data.notifications || []); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    });
  }, []);

  const handleRead = async (id: number) => {
    try {
      const { markNotificationRead } = await import('./api');
      await markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="notifications" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
        <h1 className="text-xl font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Bell size={22} color="var(--amber)" /> {t("btn.notifications")}
        </h1>
        {loading ? (
          <div className="p-10 flex justify-center"><Loader className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="space-y-3 pb-20">
            {notifs.map((n, i) => (
              <Card key={i} className={\`p-4 cursor-pointer card-hover \${!n.is_read ? 'border-l-4 border-l-amber-500' : ''}\`} onClick={() => { if(!n.is_read) handleRead(n.id); }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ background: "rgba(245,158,11,0.1)" }}>
                    <Bell size={18} color="var(--amber)" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                      <span className="text-xs text-slate-500">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  </div>
                </div>
              </Card>
            ))}
            {notifs.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Bell size={40} className="mx-auto mb-3 opacity-20" />
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
