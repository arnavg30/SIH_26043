const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const panchayatOldList =             {[
              { title: "Handpump kharab \\u2014 Ward 3", sub: "Bakri Bazar", status: "under-review", id: "JH-WTR-1024" },
              { title: "Road damaged near school", sub: "Kanke Chowk", status: "in-progress", id: "JH-RD-982" },
              { title: "Street lights not working", sub: "Lalgutwa", status: "submitted", id: "JH-EL-456" },
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
            ))};

const panchayatNewList =             {problems.length === 0 && <p className="text-sm text-gray-500">No problems found.</p>}
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
            ))};

code = code.replace(panchayatOldList, panchayatNewList);
fs.writeFileSync('src/App.tsx', code);
