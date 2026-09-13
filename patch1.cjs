const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const filteredComponent = `
function FilteredProblemsList({ title, color, problems, onBack, onNav }: { title: string; color: string; problems: any[]; onBack: () => void; onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen pb-10 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="px-4 py-4 flex items-center gap-3 sticky top-0 z-10" style={{ background: "var(--nav-bg)", color: "white" }}>
        <button onClick={onBack} className="p-2 -ml-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="p-4 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color }}>{problems.length} PROBLEMS FOUND</h3>
        {problems.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <CheckCircle size={40} className="mx-auto mb-3" />
            <p>No problems in this status</p>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((p, i) => (
              <Card key={i} className="p-4 relative">
                <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded"
                     style={{ background: \`color-mix(in srgb, \${color} 15%, transparent)\`, color }}>
                  {p.status || "PENDING"}
                </div>
                <h3 className="font-bold mb-1" style={{ color: "var(--text)", paddingRight: 80 }}>{p.title || p.description?.substring(0, 30)}</h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text-muted)" }}>{p.description}</p>
                <Btn variant="secondary" className="w-full text-xs" onClick={() => {
                   // Usually navigating to detail screen needs saving problem code
                   // We don't have problem code nav here easily, just basic view
                }}>View Details</Btn>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;

code = code.replace('export default function App', filteredComponent + '\nexport default function App');
fs.writeFileSync('src/App.tsx', code);
console.log('Added FilteredProblemsList component');
