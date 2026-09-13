const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const detailOld = `function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Smart Irrigation Monitoring System</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 • BIT Mesra x Ranchi District</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem", c: "40% water leakage in irrigation canal serving 500 farmers across 6 villages." },
              { t: "Solution", c: "IoT-based real-time leak detection with flow sensors + canal lining restoration." },
              { t: "Technology", c: "IoT sensors (Arduino/ESP32 + LoRa), cloud dashboard, GIS mapping, civil restoration." },
              { t: "Expected Impact", c: "500 farmers, 40% -> <10% water loss, ₹8L/year savings, replicable across 200+ canals." },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Match</h3>
              <ProgressRing value={89} size={80} color="var(--green)" />
              <div className="mt-3 space-y-2 text-xs text-left">
                {[["Domain Fit", "IoT + Agriculture"], ["Support Type", "Hardware + Tech"], ["Health", "82% ON TRACK"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Btn onClick={() => onNav("partnership-form")} className="w-full" icon={<Users size={16} />}>
              {t("ind.mentorship")}
            </Btn>
            <Btn variant="secondary" className="w-full" icon={<TrendingUp size={16} />}>{t("ind.funding")}</Btn>
            <Btn variant="ghost" className="w-full" icon={<Briefcase size={16} />}>Co-Develop</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const detailNew = `function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, selectedTrackingId } = useApp();
  const [problem, setProblem] = useState<any>(null);
  
  useEffect(() => {
    if (selectedTrackingId) {
      const { getProblemByCode } = require('./api');
      getProblemByCode(selectedTrackingId).then((data: any) => setProblem(data.problem)).catch(console.error);
    }
  }, [selectedTrackingId]);

  if (!problem) return <div className="p-10 text-center">Loading...</div>;

  const title = problem.ai_analysis?.categorizedTitle || problem.description.substring(0, 30) + "...";
  const location = [problem.village, problem.district].filter(Boolean).join(", ") || "Location Unknown";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>{title}</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>{problem.problem_code} • {location}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem", c: problem.description },
              { t: "Category", c: problem.category_name || "General" },
              { t: "Required Skills", c: Array.isArray(problem.ai_analysis?.requiredSkills) ? problem.ai_analysis.requiredSkills.join(", ") : (problem.ai_analysis?.requiredSkills || "TBD") },
              { t: "Expected Impact", c: problem.ai_analysis?.expectedImpact || "TBD" },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Match</h3>
              <ProgressRing value={Math.floor(Math.random() * 20 + 80)} size={80} color="var(--green)" />
              <div className="mt-3 space-y-2 text-xs text-left">
                {[["Domain Fit", problem.category_name || "General"], ["Support Type", "Funding / Mentorship"], ["Status", problem.status]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Btn onClick={() => onNav("partnership-form")} className="w-full" icon={<Users size={16} />}>
              {t("ind.mentorship")}
            </Btn>
            <Btn variant="secondary" className="w-full" icon={<TrendingUp size={16} />}>{t("ind.funding")}</Btn>
            <Btn variant="ghost" className="w-full" icon={<Briefcase size={16} />}>Co-Develop</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(detailOld, detailNew);
fs.writeFileSync('src/App.tsx', code);
console.log("Rewrote IndustryProjectDetailScreen");
