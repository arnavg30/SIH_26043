const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function TrackingScreen(';
const endFunction = 'function FileUploadField(';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);
let trackingScreenOld = c.substring(idx1, idx2);

let trackingScreenNew = unction TrackingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role, selectedTrackingId } = useApp();
  const [trackedProblem, setTrackedProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { report: globalReport } = useApp();

  useEffect(() => {
    if (!selectedTrackingId) {
       setLoading(false);
       return;
    }
    const { getProblemDetails } = require(\"./api\");
    getProblemDetails(selectedTrackingId)
      .then((data: any) => { setTrackedProblem(data.problem || data); setLoading(false); })
      .catch((err: any) => { console.error(err); setLoading(false); });
  }, [selectedTrackingId]);

  const report = trackedProblem || globalReport;

  const getStatusIndex = (st: string) => {
    if(st === \"SOLVED\") return 6;
    if(st === \"IN_PROGRESS\") return 5; // or 4
    if(st === \"ASSIGNED\") return 3;
    if(st === \"VERIFIED\") return 2;
    if(st === \"PENDING\") return 1; // Wait, actually submitted is 0, ai processed is 1...
    return 0; // SUBMITTED
  };

  const statusMap: Record<string, number> = {
    \"SUBMITTED\": 1,
    \"PENDING\": 2, // AI Processed (waiting verification)
    \"VERIFIED\": 3,
    \"ASSIGNED\": 4, // Solver matching
    \"IN_PROGRESS\": 5, // Dev & Testing
    \"IMPLEMENTATION\": 6, // Implementation
    \"SOLVED\": 7, // Citizen feedback
  };

  const currentLevel = statusMap[report.status || \"SUBMITTED\"] || 1;

  const timeline = [
    { label: \"Challenge Submitted\", sub: report.problemCode || report.problem_code || \"Pending\", done: currentLevel > 1, active: currentLevel === 1, pending: currentLevel < 1 },
    { label: \"AI Processed\", sub: report.aiAnalysis || report.priority_score ? \Priority: \/100\ : \"Pending\", done: currentLevel > 2, active: currentLevel === 2, pending: currentLevel < 2 },
    { label: \"Government Verification\", sub: \"District Level Verification\", done: currentLevel > 3, active: currentLevel === 3, pending: currentLevel < 3 },
    { label: \"University / Solver Matching\", sub: \"Matching with problem solvers\", done: currentLevel > 4, active: currentLevel === 4, pending: currentLevel < 4 },
    { label: \"Development & Testing\", sub: \"Solution being built\", done: currentLevel > 5, active: currentLevel === 5, pending: currentLevel < 5 },
    { label: \"Implementation\", sub: \"Solution deployed on ground\", done: currentLevel > 6, active: currentLevel === 6, pending: currentLevel < 6 },
    { label: \"Citizen Feedback\", sub: \"Final validation by reporter\", done: currentLevel === 7, active: currentLevel === 7, pending: currentLevel < 7 }
  ];

  return (
    <div className=\"min-h-screen pb-10\" style={{ background: \"var(--bg)\" }}>
      <NavBar role={role} screen=\"tracking\" onNav={onNav} />
      <div className=\"px-4 py-5\" style={{ background: \"var(--nav-bg)\" }}>
        <button onClick={() => onNav(getHomeDashboard(role))} className=\"flex items-center gap-1 text-xs mb-3 transition-all\"
          style={{ color: \"rgba(255,255,255,0.7)\" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <h1 className=\"text-xl font-black text-white\">{t(\"track.title\")}</h1>
        <div className=\"mt-2 px-3 py-1 rounded-lg inline-block\" style={{ background: \"rgba(255,255,255,0.1)\" }}>
          <span className=\"text-xs font-mono text-white\">{report.problemCode || report.problem_code || \"Your submitted challenge\"}</span>
        </div>

        {role === \"citizen\" && (
          <div className=\"mt-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15\">
            <MitraAssistant
              size=\"compact\"
              variant=\"compact\"
              message={t(\"mitra.rep.track\")}
              badgeText=\"Mitra • Live Status\"
              
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className=\"p-10 flex justify-center\"><Loader className=\"animate-spin\" color=\"var(--amber)\" /></div>
      ) : (
        <div className=\"px-4 py-5\">
          <Card className=\"p-4 mb-5\">
            <div className=\"flex items-center justify-between mb-2\">
              <p className=\"font-semibold text-sm\" style={{ color: \"var(--text)\" }}>{report.description || report.title || \"Your submitted problem\"}</p>
              <StatusBadge status={report.status === \"SOLVED\" ? \"resolved\" : (currentLevel > 3 ? \"in-progress\" : \"new\")} />
            </div>
            <p className=\"text-xs flex items-center gap-1\" style={{ color: \"var(--text-muted)\" }}>
              <MapPin size={11} /> {[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(\", \") || report.site_address || \"Map-selected location\"}
            </p>
            {report.files && report.files.length > 0 && <div className=\"flex gap-2 mt-3 overflow-x-auto\">{report.files.map((file: any, index: number) => (file.type && file.type.startsWith(\"image/\")) ? <img key={\\\} src={report.previews?.[index] || file.url} alt={file.name || \"file\"} className=\"w-16 h-16 rounded-lg object-cover border\" style={{ borderColor: \"var(--border)\" }} /> : <div key={\\\} className=\"w-16 h-16 rounded-lg border flex flex-col items-center justify-center text-[9px] p-1\" style={{ borderColor: \"var(--border)\", color: \"var(--text-muted)\" }}><Video size={18} /><span className=\"truncate w-full text-center\">{file.name || \"File\"}</span></div>)}</div>}
            <div className=\"mt-3 p-3 rounded-xl\" style={{ background: \"var(--success-bg)\" }}>
              <p className=\"text-xs font-semibold flex items-center gap-1.5\" style={{ color: \"var(--green)\" }}>
                <GraduationCap size={13} /> Your {report.category || report.category_id || \"selected\"} problem is being reviewed.
              </p>
              <p className=\"text-xs mt-1\" style={{ color: \"var(--success)\" }}>
                Your submitted report is safely recorded and will move through review and matching.
              </p>
            </div>
          </Card>

          <h2 className=\"font-bold text-sm mb-4\" style={{ color: \"var(--text)\" }}>Progress Timeline</h2>
          {timeline.map((item, i) => (
            <div key={i} className=\"flex gap-4 mb-5\">
              <div className=\"flex flex-col items-center\">
                <div className=\"w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0\"
                  style={{
                    background: item.done ? \"var(--success)\" : item.active ? \"var(--amber)\" : \"var(--border)\",
                    color: item.done ? \"white\" : item.active ? \"var(--navy)\" : \"var(--text-muted)\",
                    border: item.active ? \"3px solid var(--navy)\" : \"none\"
                  }}>
                  {item.done ? <CheckCircle size={16} /> : item.active ? <Activity size={14} /> : <Clock size={14} />}
                </div>
                {i < timeline.length - 1 && (
                  <div className=\"w-0.5 h-8 mt-1\"
                    style={{ background: item.done ? \"var(--success)\" : \"var(--border)\" }} />
                )}
              </div>
              <div className=\"flex-1\">
                <p className=\"font-semibold text-sm\"
                  style={{ color: item.done ? \"var(--text)\" : item.active ? \"var(--navy)\" : \"var(--text-muted)\" }}>
                  {item.label}
                </p>
                <p className=\"text-xs mt-0.5\" style={{ color: \"var(--text-muted)\" }}>{item.sub}</p>
                {item.active && i === 2 && (
                   <Btn className=\"mt-2 text-[10px] py-1 px-3\" icon={<Phone size={12}/>}>Contact Govt Official</Btn>
                )}
                {item.active && i !== 2 && (
                  <div className=\"flex gap-2 mt-2\">
                    <div className=\"h-1.5 rounded-full flex-1\" style={{ background: \"var(--border)\" }}>
                      <div className=\"h-full rounded-full w-1/2\" style={{ background: \"var(--navy)\" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

;

c = c.substring(0, idx1) + trackingScreenNew + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
console.log('patched TrackingScreen');
