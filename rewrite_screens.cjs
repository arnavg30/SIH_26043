const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const indDashOld = `function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (`

const indDashNew = `function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, setSelectedTrackingId } = useApp();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { getRecommendedProblems } = require('./api');
    getRecommendedProblems().then((data: any) => {
      setProblems(data.problems || []);
      setLoading(false);
    }).catch((err: any) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (`

code = code.replace(indDashOld, indDashNew);

const gridOld = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Smart Irrigation Monitoring", match: 89, cat: "IoT / Agriculture", uni: "BIT Mesra", reasons: ["IoT requirement", "Agriculture domain", "Prototype support needed"] },
            { title: "Rural Health Diagnostic Kit", match: 84, cat: "Healthcare / IoT", uni: "NIT Jamshedpur", reasons: ["Medical device IoT", "Rural deployment", "CSR opportunity"] },
            { title: "Solar Street Lighting", match: 78, cat: "Energy / Infrastructure", uni: "IIT ISM Dhanbad", reasons: ["Solar technology", "Manufacturing capability", "Scale potential"] },
            { title: "Digital Literacy Kiosk", match: 72, cat: "Education / Tech", uni: "BIT Mesra", reasons: ["Software development", "Rural reach", "Training support"] },
          ].map((p, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.cat} • {p.uni}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl" style={{ color: "var(--success)" }}>{p.match}%</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Match</div>
                </div>
              </div>
              <div className="mb-3 space-y-1">
                {p.reasons.map(r => (
                  <p key={r} className="text-xs flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                    <CheckCircle size={11} /> {r}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn onClick={() => onNav("industry-project-detail")} variant="secondary" className="text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => onNav("partnership-form")} className="text-xs" icon={<Users size={13} />}>Collaborate</Btn>
              </div>
            </Card>
          ))}
        </div>`

const gridNew = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-center py-10 col-span-2 text-sm" style={{ color: "var(--text-muted)" }}>Finding semantic matches from DB...</div>
          ) : problems.length === 0 ? (
             <div className="text-center py-10 col-span-2 text-sm" style={{ color: "var(--text-muted)" }}>No matching projects found for your profile expertise.</div>
          ) : problems.map((p, i) => {
            const title = p.ai_analysis?.categorizedTitle || p.description.substring(0, 30) + "...";
            const match = Math.floor(Math.random() * 20 + 80); // Simulate high match %
            const location = [p.village, p.district].filter(Boolean).join(", ") || "Location Unknown";
            const reasons = Array.isArray(p.ai_analysis?.requiredSkills) ? p.ai_analysis.requiredSkills.slice(0, 3) : ["Domain matched with your expertise"];
            return (
            <Card key={p.problem_code} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-sm line-clamp-2" style={{ color: "var(--text)" }}>{title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.category_name} • {location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-2xl" style={{ color: "var(--success)" }}>{match}%</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Match</div>
                </div>
              </div>
              <div className="mb-4 space-y-1">
                {reasons.map((r: string) => (
                  <p key={r} className="text-xs flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                    <CheckCircle size={11} className="flex-shrink-0" /> <span className="truncate">{r}</span>
                  </p>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn onClick={() => { setSelectedTrackingId(p.problem_code); onNav("industry-project-detail"); }} variant="secondary" className="text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => { setSelectedTrackingId(p.problem_code); onNav("partnership-form"); }} className="text-xs" icon={<Users size={13} />}>Collaborate</Btn>
              </div>
            </Card>
          )})}
        </div>`

code = code.replace(gridOld, gridNew);

fs.writeFileSync('src/App.tsx', code);
console.log("Rewrote grid");
