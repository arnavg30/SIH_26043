const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add submitSolutionAI to imports
code = code.replace(/getRecommendedProblems,\n  acceptProblem\n} from "\.\/api";/, 'getRecommendedProblems,\n  acceptProblem,\n  submitSolutionAI\n} from "./api";');

// 2. Add SolutionModal component before IndustryProjectDetailScreen
const modalCode = `
function SolutionModal({ isOpen, onClose, problemCode }: { isOpen: boolean; onClose: () => void; problemCode: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-5 flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold mb-3" style={{ color: "var(--navy)" }}>Submit AI Solution</h2>
        {!result ? (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Describe your proposed solution, timeline, and resources needed. Our AI will automatically structure this into a formal proposal and assign the project.
            </p>
            <textarea 
              value={text} 
              onChange={e => setText(e.target.value)}
              className="w-full p-3 rounded-xl border flex-1 min-h-[150px] mb-4 text-sm"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
              placeholder="E.g. We will implement an IoT based sensor network over 6 months using  budget..."
            />
            <div className="flex gap-2 justify-end">
              <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
              <Btn onClick={async () => {
                if(!text) return;
                setLoading(true);
                try {
                  const res = await submitSolutionAI(problemCode, text);
                  setResult(res.initiative);
                } catch(e:any) {
                  alert("Error: " + e.message);
                } finally {
                  setLoading(false);
                }
              }}>
                {loading ? "Processing via AI..." : "Submit Proposal"}
              </Btn>
            </div>
          </>
        ) : (
          <div className="space-y-4 overflow-y-auto">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <h3 className="font-bold text-green-800 text-lg mb-1">Solution Structured Successfully!</h3>
              <p className="text-green-700 text-sm">Status updated to IN_PROGRESS.</p>
            </div>
            
            <div><label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>AI Generated Title</label>
            <p className="text-sm font-semibold">{result.initiative_title}</p></div>
            
            <div><label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Extracted Timeline</label>
            <p className="text-sm">{result.timeline_display || "Not specified"}</p></div>
            
            <div><label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Resources Needed</label>
            <p className="text-sm">{result.expected_impact || "Not specified"}</p></div>
            
            <div><label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Feasibility Score</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden"><div className="h-full bg-amber-500" style={{ width: \\%\ }}></div></div>
              <span className="text-sm font-bold">{result.feasibility_score}/100</span>
            </div></div>

            <Btn onClick={onClose} className="w-full mt-4">Close & Return</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

`;

code = code.replace(/function IndustryProjectDetailScreen/, modalCode);

// 3. Add to IndustryProjectDetailScreen
code = code.replace(
  /const { t, report } = useApp\(\);/,
  'const { t, report } = useApp();\n    const [showModal, setShowModal] = useState(false);'
);

code = code.replace(
  /<Btn onClick=\{\(\) => onNav\("partnership-form"\)\} className="w-full" icon=\{<Users size=\{16\} \/>\}>\n\s*\{t\("ind\.mentorship"\)\}\n\s*<\/Btn>/,
  '<Btn onClick={() => setShowModal(true)} className="w-full" icon={<Users size={16} />}>\n                Submit AI Proposal\n              </Btn>\n              <SolutionModal isOpen={showModal} onClose={() => setShowModal(false)} problemCode={report.problemCode} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully');
