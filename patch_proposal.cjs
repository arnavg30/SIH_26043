const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetFunction = 'function ProposalScreen({';
const endFunction = 'function ProjectLifecycleScreen({';

let idx1 = c.indexOf(targetFunction);
let idx2 = c.indexOf(endFunction);

let newContent = `function ProposalScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, selectedTrackingId } = useApp();
  const [inputText, setInputText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleGenerate = async () => {
    if (!inputText || !selectedTrackingId) return;
    setGenerating(true);
    try {
      const { submitSolutionAI, acceptProblem } = await import('./api');
      
      // Accept the problem first (creates initiative)
      await acceptProblem(selectedTrackingId);
      
      // Submit solution for AI processing
      const res = await submitSolutionAI(selectedTrackingId, inputText);
      if (res && res.solution) setResult(res.solution);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-challenge-detail")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <FileText size={22} /> Generate AI Proposal
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>{selectedTrackingId}</p>
        
        {!result ? (
          <Card className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "var(--text)" }}>Brief Solution Description</label>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Describe your solution approach, methodology, or paste document text here.</p>
              <textarea rows={6} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="E.g. We will use IoT sensors to detect leaks..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            
            <Btn onClick={handleGenerate} disabled={generating || !inputText} className="w-full" icon={generating ? <Loader className="animate-spin" size={16} /> : <Zap size={16} />}>
              {generating ? "AI is structuring your proposal..." : "Generate Structured Proposal"}
            </Btn>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-5">
               <h3 className="font-bold text-sm mb-2 text-green-600 flex items-center gap-2"><CheckCircle size={16}/> AI Structured Solution</h3>
               <div className="space-y-4 mt-4">
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">PROPOSED SOLUTION</h4>
                   <p className="text-sm">{result.proposed_solution}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">TIMELINE</h4>
                   <p className="text-sm">{result.timeline}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500\">RESOURCES NEEDED</h4>
                   <p className="text-sm">{result.resources_needed}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-xs text-slate-500">FEASIBILITY SCORE</h4>
                   <div className="mt-2 text-2xl font-black text-amber-500">{result.feasibility_score}/100</div>
                 </div>
               </div>
               
               <Btn onClick={() => onNav("project-lifecycle")} className="w-full mt-6">Start Project</Btn>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
`;

c = c.substring(0, idx1) + newContent + c.substring(idx2);
fs.writeFileSync('src/App.tsx', c);
