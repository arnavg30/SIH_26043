const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('submitSolutionAI\n}', 'submitSolutionAI,\n  markSolved\n}');

const modal = `
function ImpactReportModal({ isOpen, onClose, reportData }: { isOpen: boolean; onClose: () => void; reportData: any }) {
  if (!isOpen || !reportData) return null;

  const metrics = (() => {
    try {
       return typeof reportData.key_metrics === 'string' ? JSON.parse(reportData.key_metrics) : reportData.key_metrics;
    } catch(e) { return []; }
  })();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 text-green-700">
           <CheckCircle size={24} />
           <h2 className="text-xl font-bold">Problem Solved Successfully</h2>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--navy)" }}>{reportData.title}</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text)" }}>{reportData.summary}</p>
        
        <h4 className="font-bold text-sm mb-2" style={{ color: "var(--text-muted)" }}>Key Metrics & Impact</h4>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
           {metrics && metrics.map((m:string, i:number) => <li key={i}>{m}</li>)}
        </ul>

        <h4 className="font-bold text-sm mb-2" style={{ color: "var(--text-muted)" }}>Challenges Overcome</h4>
        <p className="text-sm mb-6 bg-gray-50 p-3 rounded-lg border">{reportData.challenges_overcome}</p>

        <Btn onClick={onClose} className="w-full">Done</Btn>
      </Card>
    </div>
  );
}

function SolutionModal`;

code = code.replace('function SolutionModal', modal);

// 3. Add to IndustryProjectDetailScreen
code = code.replace(
  'const [showModal, setShowModal] = useState(false);',
  'const [showModal, setShowModal] = useState(false);\n  const [showImpactModal, setShowImpactModal] = useState(false);\n  const [impactData, setImpactData] = useState<any>(null);\n  const [solving, setSolving] = useState(false);'
);

const replaceBtn = `
            {report.status === "IN_PROGRESS" ? (
              <Btn onClick={async () => {
                 setSolving(true);
                 try {
                   const res = await markSolved(report.problemCode || "");
                   setImpactData(res.report);
                   setShowImpactModal(true);
                 } catch(e:any) {
                   alert(e.message);
                 } finally {
                   setSolving(false);
                 }
              }} className="w-full" style={{ background: "var(--success)" }} icon={<CheckCircle size={16} />}>
                {solving ? "Generating Report..." : "Mark Solved & Generate AI Report"}
              </Btn>
            ) : (
              <Btn onClick={() => setShowModal(true)} className="w-full" icon={<Users size={16} />}>
                Submit AI Proposal
              </Btn>
            )}
            <ImpactReportModal isOpen={showImpactModal} onClose={() => setShowImpactModal(false)} reportData={impactData} />
            <SolutionModal isOpen={showModal} onClose={() => setShowModal(false)} problemCode={report.problemCode || ""} />`;
code = code.replace(
  /<Btn onClick=\{\(\) => setShowModal\(true\)\} className="w-full" icon=\{<Users size=\{16\} \/>\}>\n\s*Submit AI Proposal\n\s*<\/Btn>\n\s*<SolutionModal isOpen=\{showModal\} onClose=\{\(\) => setShowModal\(false\)\} problemCode=\{report\.problemCode \|\| ""\} \/>/,
  replaceBtn
);

// 4. Do the same for UniChallengeDetailScreen
code = code.replace(
  'const [showModal, setShowModal] = useState(false);\n  return (',
  'const [showModal, setShowModal] = useState(false);\n  const [showImpactModal, setShowImpactModal] = useState(false);\n  const [impactData, setImpactData] = useState<any>(null);\n  const [solving, setSolving] = useState(false);\n  return ('
);

const replaceBtnUni = `
            {report.status === "IN_PROGRESS" ? (
              <Btn onClick={async () => {
                 setSolving(true);
                 try {
                   const res = await markSolved(report.problemCode || "");
                   setImpactData(res.report);
                   setShowImpactModal(true);
                 } catch(e:any) {
                   alert(e.message);
                 } finally {
                   setSolving(false);
                 }
              }} className="w-full" style={{ background: "var(--success)" }} icon={<CheckCircle size={16} />}>
                {solving ? "Generating Report..." : "Mark Solved & Generate AI Report"}
              </Btn>
            ) : (
              <Btn onClick={() => setShowModal(true)} className="w-full" icon={<CheckCircle size={16} />}>
                Submit AI Proposal
              </Btn>
            )}
            <ImpactReportModal isOpen={showImpactModal} onClose={() => setShowImpactModal(false)} reportData={impactData} />
            <SolutionModal isOpen={showModal} onClose={() => setShowModal(false)} problemCode={report.problemCode || ""} />`;

code = code.replace(
  /<Btn onClick=\{\(\) => setShowModal\(true\)\} className="w-full" icon=\{<CheckCircle size=\{16\} \/>\}>\n\s*Submit AI Proposal\n\s*<\/Btn>\n\s*<SolutionModal isOpen=\{showModal\} onClose=\{\(\) => setShowModal\(false\)\} problemCode=\{report\.problemCode \|\| ""\} \/>/,
  replaceBtnUni
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully');
