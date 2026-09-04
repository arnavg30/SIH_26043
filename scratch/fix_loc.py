import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# I need to add state variables for cascading logic in ReportStep2Screen
# But wait, ReportStep2Screen doesn't have these states right now. 
# It's okay, I can just write them. But instead of fully implementing complex state logic in python regex, 
# I can just implement a simplified version or add states:
# const [dist, setDist] = useState("");
# const [block, setBlock] = useState("");
# const [panch, setPanch] = useState("");

state_replacement = '''  const [method, setMethod] = useState<"none" | "gps" | "map" | "manual">("none");
  const [dist, setDist] = useState("");
  const [block, setBlock] = useState("");
  const [panch, setPanch] = useState("");
'''
app_code = app_code.replace('  const [method, setMethod] = useState<"none" | "gps" | "map" | "manual">("none");', state_replacement)

manual_old = '''        {method === "manual" && (
          <Card className="p-4 mb-5">
            {[
              { key: "loc.district", opts: ["Ranchi", "Dhanbad", "Bokaro", "Jamshedpur", "Giridih"] },
              { key: "loc.block", opts: ["Kanke", "Namkum", "Ratu", "Ormanjhi"] },
              { key: "loc.panchayat", opts: ["Piska Nagri", "Tatisilwai", "Murma"] },
              { key: "loc.village", opts: ["Bakri Bazar", "Lalgutwa", "Harmu"] },
            ].map(f => (
              <div key={f.key} className="mb-3">
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t(f.key)}</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                  <option value="">Select.</option>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </Card>
        )}'''

manual_new = '''        {method === "manual" && (
          <Card className="p-4 mb-5">
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("loc.district")}</label>
              <select value={dist} onChange={e => { setDist(e.target.value); setBlock(""); setPanch(""); }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                <option value="">Select District.</option>
                {["Ranchi", "Dhanbad", "Bokaro", "Jamshedpur", "Giridih"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="mb-3" style={{ opacity: dist ? 1 : 0.5 }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("loc.block")}</label>
              <select disabled={!dist} value={block} onChange={e => { setBlock(e.target.value); setPanch(""); }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                <option value="">Select Block.</option>
                {["Kanke", "Namkum", "Ratu", "Ormanjhi"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="mb-3" style={{ opacity: block ? 1 : 0.5 }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>{t("loc.panchayat")}</label>
              <select disabled={!block} value={panch} onChange={e => setPanch(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                <option value="">Select Panchayat.</option>
                {["Piska Nagri", "Tatisilwai", "Murma"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="mb-3" style={{ opacity: panch ? 1 : 0.5 }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Village / Locality</label>
              <input disabled={!panch} type="text" placeholder="Enter village or locality name" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </Card>
        )}'''

app_code = app_code.replace(manual_old, manual_new)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
