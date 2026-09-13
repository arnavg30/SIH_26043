const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const orgOld = unction OrgVictimDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, resetReport } = useApp();
  const profile = useProfileDisplay("localorg");
  const statuses = [
    { label: "Total Reported", val: "12", color: "var(--navy)", icon: <FileText size={18} /> },
    { label: "Pending Review", val: "2", color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: "3", color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: "7", color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];;

const orgNew = unction OrgVictimDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, resetReport } = useApp();
  const profile = useProfileDisplay("localorg");
  const [problems, setProblems] = useState<any[]>([]);
  
  useEffect(() => {
    getMyProblems().then(data => {
      setProblems(data.problems || []);
    }).catch(console.error);
  }, []);

  const total = problems.length;
  const underReview = problems.filter(p => p.status === 'UNDER_REVIEW').length;
  const inProgress = problems.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ASSIGNED').length;
  const resolved = problems.filter(p => p.status === 'SOLVED').length;

  const statuses = [
    { label: "Total Reported", val: total.toString(), color: "var(--navy)", icon: <FileText size={18} /> },
    { label: "Pending Review", val: underReview.toString(), color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: inProgress.toString(), color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: resolved.toString(), color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];;

const orgListOld =           {/* Recent Community Problems */}
          <div>
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Community Problems</h2>
            {[
              { title: "Garbage accumulation near community park", sub: "Kanke Ward 4", status: "in-progress", id: "JH-SAN-712" },
              { title: "Drainage overflow during monsoon", sub: "Kanke Main Rd", status: "under-review", id: "JH-DRN-389" },
              { title: "Street light pole damaged", sub: "Sector 2 Block B", status: "resolved", id: "JH-EL-204" },
            ].map(p => (
              <Card key={p.id} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={11} /> {p.sub}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </Card>
            ))}
          </div>;

const orgListNew =           {/* Recent Community Problems */}
          <div>
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Community Problems</h2>
            {problems.length === 0 && <p className="text-sm text-gray-500">No problems found.</p>}
            {problems.map(p => (
              <Card key={p.problem_code} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={11} /> {p.village || p.panchayat || "Unknown Location"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.problem_code}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </Card>
            ))}
          </div>;

code = code.replace(orgOld, orgNew);
code = code.replace(orgListOld, orgListNew);
fs.writeFileSync('src/App.tsx', code);
