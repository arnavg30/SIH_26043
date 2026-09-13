const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function ProblemsNearMeScreen(';
const endFunction = 'function FeedbackScreen(';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function ProblemsNearMeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role, setSelectedTrackingId } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { getProblemsNearMe } = require("./api");
          getProblemsNearMe(pos.coords.latitude, pos.coords.longitude)
            .then((data: any) => { setProblems(data.problems || []); setLoading(false); })
            .catch((err: any) => { console.error(err); setLoading(false); });
        },
        (err) => {
          setLocationError("Could not access location.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="problems-near-me" onNav={onNav} />
      <div className="px-4 py-5" style={{ background: "var(--nav-bg)" }}>
        <button onClick={() => onNav(getHomeDashboard(role))} className="flex items-center gap-1 text-xs mb-3 transition-all"
          style={{ color: "rgba(255,255,255,0.7)" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Map size={20} color="var(--amber)" /> {t("cit.nearby")}
        </h1>
      </div>
      
      {loading ? (
        <div className="p-10 flex justify-center"><Loader className="animate-spin" color="var(--amber)" /></div>
      ) : (
        <>
          <div className="mx-4 mt-4 rounded-2xl overflow-hidden map-placeholder h-48 relative">
            {problems.map((p, i) => (
              <div key={i} className="absolute z-10" style={{ top: \`\${20 + (i * 15) % 60}%\`, left: \`\${20 + (i * 20) % 60}%\` }}>
                <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2"
                  style={{ borderColor: "var(--navy)" }}>
                  <MapPin size={16} color="var(--error)" />
                </div>
              </div>
            ))}
            <div className="absolute top-2 right-2 z-10 bg-white rounded-lg px-2 py-1 text-xs font-semibold shadow"
              style={{ color: "var(--navy)" }}>5 km radius</div>
          </div>
          
          <div className="px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm" style={{ color: "var(--text)" }}>{problems.length} problems nearby</h2>
              <button className="p-2 rounded-lg" style={{ background: "var(--input-bg)", color: "var(--text-muted)" }}>
                <Filter size={16} />
              </button>
            </div>
            
            {locationError && <p className="text-xs text-center text-red-500 mb-4">{locationError}</p>}
            
            <div className="space-y-3">
              {problems.map((p, i) => (
                <Card key={i} className="p-4 cursor-pointer card-hover" onClick={() => { setSelectedTrackingId(p.id || p.problem_code); onNav("tracking"); }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm flex-1 pr-4 line-clamp-1" style={{ color: "var(--text)" }}>{p.description || p.title}</h3>
                    <StatusBadge status={p.status === "SOLVED" ? "resolved" : (p.status === "IN_PROGRESS" ? "in-progress" : "under-review")} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium" style={{ color: "var(--navy)" }}>
                      <MapPin size={12} /> {Math.round(p.distance / 100) / 10 || "0.5"} km
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>{p.category || p.category_name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
